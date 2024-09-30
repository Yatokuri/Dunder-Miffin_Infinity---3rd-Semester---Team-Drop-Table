import AddProduct from "./AddProduct/AddProduct.tsx";
import ProductTable from "./ProductTable/ProductTable.tsx";

function Admin() {
    return (
        <div className="flex flex-col items-center">
            <div>
                <h1 className="text-black text-6xl">Admin Page</h1>
            </div>
            <div className="flex flex-row w-full justify-around mt-10">
                <AddProduct />
                <ProductTable />
            </div>
        </div>
    )
}

export default Admin;