import { Api } from "../../../../Api.ts";
import { useAtom } from "jotai";
import { productsAtom } from "../ProductTable/ProductTable.tsx";
import './DeleteProduct.css';

export const MyApi = new Api();

async function discontinueProductById(id: string) {
    await MyApi.api.paperUpdateDiscontinued(id, { discontinued: true });
}

function DeleteProduct({ productId }: { productId: string }) {
    const [products, setProducts] = useAtom(productsAtom);

    const handleDelete = async () => {
        await discontinueProductById(productId);
        setProducts(products.map(product =>
            product.id === productId ? { ...product, discontinued: true } : product
        ));
    };

    return (
        <button className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10" onClick={handleDelete}>
            Discontinue
        </button>
    );
}

export default DeleteProduct;