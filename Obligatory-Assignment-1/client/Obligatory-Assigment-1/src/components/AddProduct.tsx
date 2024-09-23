import { useEffect } from "react";
import { Api } from "../../Api.ts";
import { atom, useAtom } from "jotai";

export const MyApi = new Api({
    baseUrl: "http://localhost:5261/api/product",
});

export interface Product {
    id: number;
    name: string;
    discontinued: boolean;
    stock: number;
    price: number;
}

export const productsAtom = atom<Product[]>([]);

function AddProduct() {
    const [products, setProducts] = useAtom(productsAtom);

    useEffect(() => {
        MyApi.api.productGetAllProducts()
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div>
            <h1>Products:</h1>
            <table border={1} className="table-lg">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Discontinued</th>
                    <th>Stock</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {products.length > 0 ? (
                    products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.discontinued ? "Yes" : "No"}</td>
                            <td>{product.stock}</td>
                            <td>{product.price}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5}>No products found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default AddProduct;