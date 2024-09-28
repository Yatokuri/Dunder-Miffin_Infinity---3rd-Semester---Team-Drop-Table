import { useState } from 'react';

interface OpenModalProps {
    component: React.ReactNode;
    buttonText: string;
}

function OpenModal({ component, buttonText }: OpenModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div>
            <button onClick={openModal} className="btn btn-primary">{buttonText}</button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-black text-2xl"
                        >
                            &#x2715;
                        </button>
                        {component}
                    </div>
                </div>
            )}
        </div>
    );
}

export default OpenModal;