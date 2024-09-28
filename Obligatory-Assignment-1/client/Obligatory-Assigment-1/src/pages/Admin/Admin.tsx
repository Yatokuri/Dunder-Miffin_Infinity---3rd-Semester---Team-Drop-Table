import ProductManagement from "./ProductManagement/ProductManagement.tsx";
import OpenModal from "../OpenModal.tsx";

function Admin() {
    return (
        <div className="flex flex-col items-center">
            <div>
                <h1 className="text-black text-6xl">Admin Page</h1>
            </div>
            <div>
                <OpenModal component={<ProductManagement />} buttonText={"Create new product"} />
            </div>
        </div>
    )
}

export default Admin;