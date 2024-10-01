import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import {productsAtom} from "../Basket.tsx";
import {BasketAtom} from "../../atoms/BasketAtom.ts";
import {Api} from "../../../Api.ts";



export const MyApi = new Api();


function Shop() {

    const [products, setProducts] = useAtom(productsAtom);
    const [basket, setBasket] = useAtom(BasketAtom);

    const ShopCard = ({product}) => {
        return (
            <div className="card card-compact bg-base-100 w-96 shadow-xl mr-5">
                <figure>
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes"/>
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{product.name}</h2>
                    <p>Price {product.price}</p>
                    <div className="card-actions justify-end font-bold">
                        <button className="btn bg-green-500">+</button>
                        <button className="btn bg-red-500">-</button>
                    </div>
                </div>
            </div>
        );
    }
    
    const addToBasket = (productId: string) => {

    }

    const removeFromBasket = () => {

    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
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
            <div className="card-list flex flex-row w-full justify-around mt-10">
                {products.filter(product => !product.discontinued).map((product, index) => (
                    <ShopCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
}

export default Shop;