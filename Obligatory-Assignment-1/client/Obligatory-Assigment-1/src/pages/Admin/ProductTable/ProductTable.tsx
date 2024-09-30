import { Api } from "../../../../Api.ts";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

interface Product {
    name: string;
    stock: number;
    price: number;
}

export const MyApi = new Api();
export const productsAtom = atom<Product[]>([]);

function ProductTable() {
    const [products, setProducts] = useAtom(productsAtom);

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
        <table className="text-black text-4xl text-left">
            <thead>
            <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr key={index} >
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.price}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default ProductTable;