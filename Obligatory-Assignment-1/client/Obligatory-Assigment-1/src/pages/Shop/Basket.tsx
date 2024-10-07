import {useAtom} from "jotai";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {MyApi} from "./Shop.tsx";
import {BasketAtom, TotalAmountAtom, clearBasket, loadBasketFromStorage} from "../../atoms/BasketAtoms.ts";
import {toast} from "react-hot-toast";
import TrashIcon from '../../assets/icons/TrashbinIcon.tsx';
import ConfirmationModal from '../../components/Modals/ConfirmationModal.tsx';
import InputFieldPaperQuantity from '../../components/Orders/InputFieldPaperQuantity.tsx';

type ProductNames = {
    [key: number]: string; // Maps product IDs to product names
};

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
    const [productNames, setProductNames] = useState<ProductNames>({});
    const [isModalOpen, setModalOpen] = useState(false);

    // Load basket from local storage once when the component mounts
    useEffect(() => {
        loadBasketFromStorage(setBasket);
    }, [setBasket]);

    // Fetch product names when the page starts - Might take a quick second since names are not saved in the basket atom
    useEffect(() => {
        const fetchProductNames = async () => {
            const names = {};
            for (const item of basket) {
                try {
                    const response = await MyApi.api.paperGetPaper(item.product_id);
                    // @ts-expect-error: Ignore an error if it doesn't exist
                    names[item.product_id] = response.data.name;
                } catch (error) {
                    console.error(`Error fetching product ${item.product_id}:`, error);
                }
            }
            setProductNames(names);
        };

        fetchProductNames().then();
    }, [basket]);

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
                            <li key={item.product_id} className="flex justify-between items-center py-2 border-b">
                                <div className="w-2/5">
                                    <span
                                        className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis"
                                        title={productNames[item.product_id] || 'Loading...'}
                                    >
                                    {truncateString(productNames[item.product_id] || 'Loading...', 18)}
                                </span>
                                </div>
                                <div className="flex w-3/5 justify-between items-center">
                                    <InputFieldPaperQuantity item={item}/>
                                    <span className="w-1/4 text-center">Price: {formatPrice(item.price)}</span>
                                    <span className="w-1/4 text-center">Total: {formatPrice(item.quantity * item.price)}</span>
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