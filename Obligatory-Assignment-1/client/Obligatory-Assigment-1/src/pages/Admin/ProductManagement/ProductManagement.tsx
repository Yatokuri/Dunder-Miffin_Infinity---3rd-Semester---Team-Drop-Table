import { useState } from 'react';
import { Api } from "../../../../Api.ts";
import './ProductManagement.css';

export const MyApi = new Api();

async function createPaper(name: string, stock: number, price: number) {
    const response = await MyApi.api.paperCreatePaper({
        name: name,
        stock: stock,
        price: price
    });
    console.log(response.data);
}

function ProductManagement() {
    const [name, setName] = useState('');
    const [stock, setStock] = useState(0);
    const [price, setPrice] = useState(0);

    const handleCreatePaper = () => {
        createPaper(name, stock, price);
        setName('');
        setStock(0);
        setPrice(0);
    };

    return (
        <div className="flex flex-col justify-center mt-32">
            <div>
                <h1 className="text-black text-6xl">Product Management</h1>
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Name</p>
                <input
                    className="flex-grow input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Stock</p>
                <input
                    className="flex-grow input-field"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                />
            </div>

            <div className="text-black text-3xl mt-10 flex items-center">
                <p className="w-32">Price</p>
                <input
                    className="flex-grow input-field"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
            </div>

            <div>
                <button
                    className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10"
                    onClick={handleCreatePaper}
                >
                    Add Product
                </button>
            </div>
        </div>
    );
}

export default ProductManagement;