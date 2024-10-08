import { Api } from "../../../../../Api.ts";
import { useAtom } from "jotai";
import { productsAtom } from "../ProductTable/ProductTable.tsx";
import './DiscontinueProduct.css';

export const MyApi = new Api();

async function toggleProductDiscontinueStatus(id: string, discontinued: boolean) {
    if (discontinued) {
        await MyApi.api.paperUpdateContinue(id);
    } else {
        await MyApi.api.paperUpdateDiscontinue(id, { discontinued: true });
    }
}

function DiscontinueProduct({ productId, discontinued }: { productId: string, discontinued: boolean }) {
    const [products, setProducts] = useAtom(productsAtom);

    const handleToggle = async () => {
        await toggleProductDiscontinueStatus(productId, discontinued);
        setProducts(products.map(product =>
            product.id === productId ? { ...product, discontinued: !discontinued } : product
        ));
    };

    return (
        <button className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10" onClick={handleToggle}>
            {discontinued ? 'Continue' : 'Discontinue'}
        </button>
    );
}

export default DiscontinueProduct;