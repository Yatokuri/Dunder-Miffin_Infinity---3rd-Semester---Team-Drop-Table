import {useAtom} from "jotai";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {BasketAtom, TotalAmountAtom, clearBasket, loadBasketFromStorage} from "../../atoms/BasketAtoms.ts";
import {toast} from "react-hot-toast";
import TrashIcon from '../../assets/icons/TrashbinIcon.tsx';
import ConfirmationModal from '../../components/Modals/ConfirmationModal.tsx';
import InputFieldPaperQuantity from '../../components/Orders/InputFieldPaperQuantity.tsx';


// Utility function to format price
const formatPrice = (price: number) => {
    if (price >= 1e9) return `$${(price / 1e9).toFixed(1)}B`; // = Billion
    if (price >= 1e6) return `$${(price / 1e6).toFixed(1)}M`; // = Million
    if (price >= 1e3) return `$${(price / 1e3).toFixed(1)}K`; // = Thousand
    return `$${price.toFixed(2)}`; // Regular price
};

// Utility function to truncate long names
const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

function Basket() {
    const [basket, setBasket] = useAtom(BasketAtom);
    const [totalAmount] = useAtom(TotalAmountAtom);
    const [isModalOpen, setModalOpen] = useState(false);
    const [maxNameLength, setMaxNameLength] = useState(18);

    // Load basket from local storage once when the component mounts
    useEffect(() => {
        loadBasketFromStorage(setBasket);
    }, [setBasket]);

    // Track screen size and adjust max length dynamically
    useEffect(() => {
        const updateMaxNameLength = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 640) {
                setMaxNameLength(18);
            } else { // Mobile screens
                setMaxNameLength(28);
            }
        };

        updateMaxNameLength();

        // Listen for window resize and update max name length
        window.addEventListener("resize", updateMaxNameLength);

        return () => window.removeEventListener("resize", updateMaxNameLength);
    }, []);


    // Handle clearing the basket with a confirmation dialog
    const handleClearBasket = () => {
        setModalOpen(true); // Open the modal
    };

    // Confirm action inside the modal
    const handleConfirmClearBasket = () => {
        clearBasket(setBasket);
        setModalOpen(false);
        toast.success("Basket cleared");
    };

    return (
        <div className="shopping-basket p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Shopping Cart</h2>
            {basket.length > 0 ? (
                <div>
                    <ul className="space-y-2">
                        {basket.map((item) => (
                            <li key={item.product_id} className="border-b py-2">
                                {/* Product Name and Input Field in one line on large screens */}
                                <div className="flex justify-between items-center">
                                    <div className="flex-shrink-0 w-1/2 max-w-[160px]">
                                        <span
                                            className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis"
                                            title={item.name}
                                        >
                                            {truncateString(item.name || 'Unknown', maxNameLength)}
                                        </span>
                                        <span
                                            className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis ml-1"
                                            title={item.selectedProperty}
                                        >
                                            ({truncateString(item.selectedProperty || '', maxNameLength)})
                                        </span>
                                    </div>
                                    {/* Input field taking consistent space */}
                                    <div className="sm:flex-grow w-1/4 justify-items-end">
                                        <InputFieldPaperQuantity item={item} />
                                    </div>
                                    {/* Price and Total on one line on large screens */}
                                    <div className="w-1/4 text-center flex-col hidden sm:flex">
                                        <span>Price:</span>
                                        <span>{formatPrice(item.price)}</span>
                                    </div>
                                    <div className="w-1/4 text-center flex-col hidden sm:flex">
                                        <span>Total:</span>
                                        <span>{formatPrice(item.quantity * item.price)}</span>
                                    </div>
                                </div>

                                {/* Price and Total on a new line for mobile */}
                                <div className="flex justify-between items-center sm:hidden mt-2">
                                    <span className="w-1/2 text-left">
                                        Price: {formatPrice(item.price)}
                                    </span>
                                    <span className="w-1/2 text-right">
                                        Total: {formatPrice(item.quantity * item.price)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-6 flex">
                        <Link to={"/basket/checkout"} className="btn btn-primary w-4/5 mr-2">
                            Go to Checkout
                        </Link>
                        <button onClick={handleClearBasket} className="w-1/5 flex justify-center items-center">
                            <TrashIcon className="w-8 h-8 text-icon-color" />
                        </button>
                    </div>

                    {/* Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={handleConfirmClearBasket}
                        title="Confirm Action"
                        message="Are you sure you want to clear the basket?"
                    />
                </div>
            ) : (
                <p className="text-center">Your cart is empty</p>
            )}
        </div>
    );
}

export default Basket;
