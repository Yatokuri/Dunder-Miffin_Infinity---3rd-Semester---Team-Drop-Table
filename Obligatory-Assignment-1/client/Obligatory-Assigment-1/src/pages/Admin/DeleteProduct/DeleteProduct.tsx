import { Api } from "../../../../Api.ts";
import { useAtom } from "jotai";
import { productsAtom } from "../ProductTable/ProductTable.tsx";
import './DeleteProduct.css';

export const MyApi = new Api();

async function deleteProductById(id: string) {
    await MyApi.api.paperDeletePaper(id);
}

function DeleteProduct({ productId }: { productId: string }) {
    const [products, setProducts] = useAtom(productsAtom);

    const handleDelete = async () => {
        await deleteProductById(productId);
        setProducts(products.filter(product => product.id !== productId));
    };

    return (
        <button className="delete-button" onClick={handleDelete}>
            &times;
        </button>
    );
}

export default DeleteProduct;