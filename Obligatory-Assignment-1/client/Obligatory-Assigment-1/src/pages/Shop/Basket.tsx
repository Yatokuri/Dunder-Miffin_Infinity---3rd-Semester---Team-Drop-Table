import {atom} from "jotai/index";
import {useAtom} from "jotai";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {MyApi} from "./Shop.tsx";
import {BasketAtom, TotalAmountAtom} from "../../atoms/BasketAtoms.ts";
import {Product} from "../../atoms/ProductAtom.ts";


export const productsAtom = atom<Product[]>([]);

function Basket() {
    const [basket] = useAtom(BasketAtom);
    const [totalAmount] = useAtom(TotalAmountAtom);
    const [productNames, setProductNames] = useState({});

    // Fetch product names when the page starts - Might take a quick second since names are not saved in the basket atom
    useEffect(() => {
        const fetchProductNames = async () => {
            const names = {};
            for (const item of basket) {
                try {
                    const response = await MyApi.api.paperGetPaper(item.product_id);
                    // @ts-ignore
                    names[item.product_id] = response.data.name;
                } catch (error) {
                    console.error(`Error fetching product ${item.product_id}:`, error);
                }
            }
            setProductNames(names);
        };

        fetchProductNames();
    }, [basket]);

    return (
        <div className="shopping-basket p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Shopping Cart</h2>
            {basket.length > 0 ? (
                <div>
                    <ul>
                        {basket.map((item) => (
                            <li key={item.product_id} className="flex justify-between py-2">
                                <span className="font-semibold">{productNames[item.product_id] || 'Loading...'}</span>
                                <span>Quantity: {item.quantity}</span>
                                <span>Price: ${item.price}</span>
                                <span>Total: ${item.quantity * item.price}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <Link to={"/basket/checkout"} className="mt-6 w-full btn bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Go to Checkout
                    </Link>
                </div>
            ) : (
                <p className="text-center">Your cart is empty</p>
            )}
        </div>
    );
}

export default Basket;