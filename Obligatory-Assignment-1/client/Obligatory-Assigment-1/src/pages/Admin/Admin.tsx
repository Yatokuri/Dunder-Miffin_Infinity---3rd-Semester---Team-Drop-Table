import { useState } from 'react';
import AddProduct from "./AddProduct/AddProduct.tsx";
import ProductTable from "./ProductTable/ProductTable.tsx";
import Modal from "./Modal/Modal.tsx";

function Admin() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="flex flex-col items-center">
            <div>
                <h1 className="text-black text-6xl">Admin Page</h1>
            </div>
            <div className="flex flex-row w-full justify-around mt-10">
                <ProductTable />
            </div>
            <button
                className="btn btn-md lg:btn-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 mt-10"
                onClick={openModal}
            >
                Add Product
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AddProduct closeModal={closeModal} />
            </Modal>
        </div>
    );
}

export default Admin;