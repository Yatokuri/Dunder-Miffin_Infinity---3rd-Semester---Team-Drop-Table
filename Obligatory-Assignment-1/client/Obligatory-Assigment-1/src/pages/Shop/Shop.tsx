import {useAtom} from "jotai";
import {useEffect} from "react";
import {productAtom } from "../../atoms/ProductAtom.ts";
import {BasketAtom, updateQuantity, loadBasketFromStorage } from "../../atoms/BasketAtoms";
import {Api} from "../../../Api.ts";
import {toast} from "react-hot-toast";
import React, { useState } from "react";

export const MyApi = new Api();

// @ts-ignore
const ShopCard = React.memo(({ product, initialQuantity, onAdd, onRemove }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    // Update local quantity when the product quantity in the basket changes
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const handleAddClick = () => {
        setQuantity((prev: number) => prev + 1);
        onAdd(product.id, quantity + 1, product.price);
    };

    const handleRemoveClick = () => {
        setQuantity((prev: number) => prev - 1);
        onRemove(product.id, quantity - 1, product.price);
    };

    return (
        <div className="card card-compact bg-base-100 shadow-xl flex flex-col w-full">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt={product.name}
                />
            </figure>
            <div className="card-body flex flex-col flex-grow">
                <h2 className="card-title">{product.name}</h2>
                <div className="card-actions justify-between items-center mt-auto">
                    <p className="flex-grow">Price: ${product.price}</p>
                    <p className="font-semibold">In basket: {quantity}</p>
                </div>
                <div className="card-actions justify-between items-center mt-auto">
                    <button onClick={handleAddClick} className="btn bg-green-500 mr-2">
                        +
                    </button>

                    {/*
                    <input
                        type="number"
                        min="1"
                        className="w-12 text-center border rounded mx-2"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                    */}

                    <button onClick={handleRemoveClick} className="btn bg-red-500 ml-2" disabled={quantity === 0}>
                        -
                    </button>
                </div>
            </div>
        </div>
    );
});

function Shop() {
    const [products, setProducts] = useAtom(productAtom);
    const [basket, setBasket] = useAtom(BasketAtom);

    // Load basket from localStorage when the component mounts
    useEffect(() => {
        loadBasketFromStorage(setBasket);
    }, [setBasket]);

    const getProductQuantity = (productId: number) => {
        const productInBasket = basket.find((item) => item.product_id === productId);
        return productInBasket ? productInBasket.quantity : 0;
    };

    const handleAdd = (productId: number, newQuantity: number, price: number) => {
        const existingQuantity = getProductQuantity(productId);
        if (existingQuantity > 0) {
            // Update quantity for an existing product
            updateQuantity(basket, productId, newQuantity, price, setBasket);
            toast.success("Product quantity updated", { duration: 1000 });
        } else {
            // Add a new product to the basket
            updateQuantity(basket, productId, newQuantity,  price, setBasket);
            toast.success("Product added to basket", { duration: 1000 });
        }
    };

    const handleRemove = (productId: number, newQuantity: number, price: number) => {
        const existingQuantity = getProductQuantity(productId);
        console.log(existingQuantity + " hest ")
        if (existingQuantity > 1) {
            // Decrease quantity if more than 1
            updateQuantity(basket, productId, newQuantity, price, setBasket);
            toast.success("Product quantity decreased", { duration: 1000 });
        } else {
            updateQuantity(basket, productId, 0, price, setBasket);
            toast.error("Product removed from basket");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                // @ts-expect-error: Ignore an error if it doesn't exist
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData();
    }, [setProducts]);

    return (
        <div className="text-black">
            <h1 className="text-3xl font-bold bg-center">Sales: Paper</h1>
            <h1 className="text-2xl font-bold bg-center">For all your administrative needs</h1>
            <div className="card-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                {products.filter(product => !product.discontinued).map((product) => (
                    <ShopCard key={product.id} product={product} initialQuantity={getProductQuantity(product.id)} onAdd={handleAdd} onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
}

export default Shop;