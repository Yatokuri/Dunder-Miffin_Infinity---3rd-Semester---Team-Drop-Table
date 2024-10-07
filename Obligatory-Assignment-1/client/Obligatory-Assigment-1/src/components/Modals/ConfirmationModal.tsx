import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null; // Do not render if modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="btn btn-gray mr-2">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-primary bg-red-700">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
