import {useAtom} from "jotai";
import {useEffect} from "react";
import {productsAtom} from "../Basket.tsx";
import {addToBasket, BasketAtom, updateQuantity} from "../../atoms/BasketAtoms.ts";
import {Api} from "../../../Api.ts";
import {toast} from "react-hot-toast";



export const MyApi = new Api();


function Shop() {

    const [products, setProducts] = useAtom(productsAtom);
    const [basket, setBasket] = useAtom(BasketAtom);

    const getProductQuantity = (productId) => {
        const productInBasket = basket.find((item) => item.product_id === productId);
        return productInBasket ? productInBasket.quantity : 0;
    };

    const handleAdd = (product) => {
        const existingQuantity = getProductQuantity(product.id);
        if (existingQuantity > 0) {
            // Update quantity for an existing product
            updateQuantity(basket, product.id, existingQuantity + 1, product.price, setBasket);
            toast.success("Product added to basket");
        } else {
            // Add a new product to the basket
            addToBasket(basket, { product_id: product.id, quantity: 1, price: product.price }, setBasket);
            toast.success("Product added to basket");
        }
    };

    const handleRemove = (product) => {
        const existingQuantity = getProductQuantity(product.id);
        if (existingQuantity > 1) {
            // Decrease quantity if more than 1
            updateQuantity(basket, product.id, existingQuantity - 1, product.price, setBasket);
            toast.error("Product removed from basket");
        } else {
            // Remove product from the basket if quantity reaches 0
            const updatedBasket = basket.filter(item => item.product_id !== product.id);
            setBasket(updatedBasket);
            toast.error("Product removed from basket");
        }
    };
    
    
    // @ts-ignore
    const ShopCard = ({product, quantity}) => {
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
                        <button onClick={() => handleAdd(product)} className="btn bg-green-500">+</button>
                        <p>In Basket: {quantity}</p> {/* Display quantity here */}
                        <button onClick={() => handleRemove(product)} className="btn bg-red-500">-</button>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                // @ts-ignore
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
            <div className="card-list grid grid-cols-4 gap-5 mt-10">
                {products.filter(product => !product.discontinued).map((product, index) => (
                    <ShopCard key={index} product={product} quantity={getProductQuantity(product.id)}/>
                ))}
            </div>
        </div>
    );
}

export default Shop;