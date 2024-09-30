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
        <table className="text-black text-4xl w-full">
            <thead>
            <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Stock</th>
                <th className="text-left p-2">Price</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr key={index}>
                    <td className="text-left p-2">{product.name}</td>
                    <td className="text-left p-2">{product.stock}</td>
                    <td className="text-left p-2">{product.price}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default ProductTable;