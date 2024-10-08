import {useAtom} from "jotai";
import React, {useEffect, useState} from "react";
import {productAtom, Product} from "../../atoms/ProductAtom.ts";
import {BasketAtom, updateQuantity, loadBasketFromStorage} from "../../atoms/BasketAtoms.ts";
import {Api} from "../../../Api.ts";
import {toast} from "react-hot-toast";
import InputFieldPaperQuantity from "../../components/Orders/InputFieldPaperQuantity.tsx";
import {searchAtom} from "../../atoms/atoms.ts";
import {productPriceFilterAtom, productPropertiesFilterAtom, productPropertyFilterAtom} from "../../atoms/ProductFilterAtoms.ts";

export const MyApi = new Api();

// Define the props for the ShopCard component
interface ShopCardProps {
    product: Product;
    initialQuantity: number;
    onAdd: (productId: number, newQuantity: number, price: number, name: string) => void;
    onRemove: (productId: number, newQuantity: number, price: number, name: string) => void;
}

// Memoized ShopCard component
const ShopCard = React.memo(({ product, initialQuantity, onAdd, onRemove, stock }: ShopCardProps & { stock: number}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    // Update local quantity when the product quantity in the basket changes
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const handleAddClick = () => {
        if (quantity < stock){
            setQuantity((prev: number) => prev + 1);
            onAdd(product.id, quantity + 1, product.price, product.name);
        }
        else {
            toast.error("No more stock available to add")
        }
    };

    const handleRemoveClick = () => {
        setQuantity((prev: number) => prev - 1);
        onRemove(product.id, quantity - 1, product.price, product.name);
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

                    <InputFieldPaperQuantity
                        item={{
                            quantity,
                            product_id: product.id,
                            price: product.price,
                            name: product.name
                        }}
                    />

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
    const [searchQuery] = useAtom(searchAtom); // Use the navbar search
    const [sortPrice, setSortPrice] = useState<string>("Normal");
    const [priceFilters] = useAtom(productPriceFilterAtom);
    const [propertyFilter, setPropertyFilter] = useAtom(productPropertyFilterAtom);
    const [availableProperties, setAvailableProperties] = useAtom(productPropertiesFilterAtom)
    
    // Load basket from localStorage when the component mounts
    useEffect(() => {
        loadBasketFromStorage(setBasket);
    }, [setBasket]);

    const getProductQuantity = (productId: number) => {
        const productInBasket = basket.find((item) => item.product_id === productId);
        return productInBasket ? productInBasket.quantity : 0;
    };
    
    const handleAdd = (productId: number, newQuantity: number, price: number, name: string) => {
        const existingQuantity = getProductQuantity(productId);
        if (existingQuantity > 0) {
            // Update quantity for an existing product
            updateQuantity(basket, productId, newQuantity, price, name, setBasket);
            toast.success("Product quantity updated", { duration: 1000 });
        } else {
            // Add a new product to the basket
            updateQuantity(basket, productId, newQuantity, price, name, setBasket);
            toast.success("Product added to basket", { duration: 1000 });
        }
    };

    const handleRemove = (productId: number, newQuantity: number, price: number, name: string) => {
        const existingQuantity = getProductQuantity(productId);
        if (existingQuantity > 1) {
            // Decrease quantity if more than 1
            updateQuantity(basket, productId, newQuantity, price, name, setBasket);
            toast.error("Product quantity decreased", { duration: 1000 });
        } else {
            updateQuantity(basket, productId, 0, price, name, setBasket);
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
        fetchData().then();
    }, [setProducts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.propertiesGetAllProperties(); // Fetch data
                // @ts-expect-error: Ignore an error if it doesn't exist
                setAvailableProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchData().then();
    }, [setAvailableProperties]);

    // Handle filtering Products by properties, price and search query
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()); // Search by Product Name
        const matchesPrice = sortPrice === "Normal" || sortPrice === "Ascending" || sortPrice === "Descending" || product.price.toString() === sortPrice;
        if (sortPrice === "Ascending" || sortPrice === "Descending" || sortPrice === "Normal") {return matchesSearch;}
        // Needs to be changed to check paper_properties when actually implemented - Currently not working
        const matchesProperty = !propertyFilter || product.properties.includes(propertyFilter);

        return matchesSearch && matchesPrice && matchesProperty; // Combine filters
    })
        .sort((a, b) => {
            if (sortPrice === "Ascending") return a.price - b.price;
            if (sortPrice === "Descending") return b.price - a.price;
            return 0; // Normal (no sorting)
        });
    
    return (
        <div className="text-black">
            <h1 className="flex text-3xl font-bold bg-center justify-center mt-5">Limitless Paper in a Paperless
                World</h1>
            <div className="mb-4">
                <label htmlFor="sortPrice" className="mr-2 bg-center flex ml-5">Sort by Price:</label>
                <select
                    id="sortPrice"
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                    className="border rounded p-1 flex-grow ml-5"
                >
                    {priceFilters.map((filter) => (
                        <option key={filter} value={filter}>
                            {filter}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="propertyFilter" className="mr-2 bg-center flex ml-5">Filters</label>
                <select
                    id="propertyFilter"
                    // @ts-ignore
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="border rounded p-1 flex-grow ml-5"
                >
                    <option value="">All</option>
                    {availableProperties.map((property) => (
                        <option key={property} value={property}>{property}</option>
                    ))}
                </select>
            </div>
            <div className="card-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                {filteredProducts.filter(product => !product.discontinued).map((product) => (
                    <ShopCard
                        key={product.id}
                        product={product}
                        initialQuantity={getProductQuantity(product.id)}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                        stock={product.stock}
                    />
                ))}
            </div>
        </div>
    );
}

export default Shop;