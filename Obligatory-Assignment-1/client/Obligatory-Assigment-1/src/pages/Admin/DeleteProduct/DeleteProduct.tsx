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
        <button className="delete-button" onClick={handleDelete}>
            &times;
        </button>
    );
}

export default DeleteProduct;