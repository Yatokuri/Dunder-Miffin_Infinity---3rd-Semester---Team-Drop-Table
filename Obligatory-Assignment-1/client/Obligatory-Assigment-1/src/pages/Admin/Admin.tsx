import ProductManagement from "./ProductManagement/ProductManagement.tsx";

function Admin() {
    return (
        <div className="flex flex-col items-center">
            <div>
                <h1 className="text-black text-6xl">Admin Page</h1>
            </div>
            <div>
                <ProductManagement />
            </div>
        </div>
    )
}

export default Admin;