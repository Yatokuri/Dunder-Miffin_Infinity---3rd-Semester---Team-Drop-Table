
import axios from 'axios';
import { useState } from "react";

const NewOrderTest = () => {
    const [orderDate, setOrderDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [status, setStatus] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    // Function to fill the fields with predefined test data
    const fillFields = () => {
        const currentDate = new Date();
        setOrderDate(new Date().toISOString().slice(0, 16));
        setDeliveryDate(new Date(currentDate.setDate(currentDate.getDate() + 2)).toISOString().slice(0, 10)); // Two days from now
        setStatus('Pending');
        setTotalAmount('100.00');
        setCustomerId('1');
        setCustomerName('John Doe');
        setCustomerEmail('johndoe@example.com');
        setCustomerPhone('123-456-7890');
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const orderData = {
            customer: {
                id: parseInt(customerId), // Assuming you only need the ID for existing customers
            },
            order: {
                orderDate,
                deliveryDate,
                status,
                totalAmount: parseFloat(totalAmount),
                orderEntries: [
                    {
                        productId: 1, // Example product ID
                        quantity: 2,   // Example quantity
                        price: 100.00  // Example price
                    }
                    // Add more order entries as needed
                ]
            }
        };

        try {
            const response = await axios.post('http://localhost:5261/api/fullOrder', orderData);
            alert(`Order created with ID: ${response.data.id}`);
            // Clear the form
            setOrderDate('');
            setDeliveryDate('');
            setStatus('');
            setTotalAmount('');
            setCustomerId('');
        } catch (error) {
            console.error('There was an error creating the order!', error);
            alert('Failed to create order. Please check console for details.');
        }
    };


    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Order Management System Beta 0.1</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 py-6 mb-4 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Place an Order</h2>

                {/* Fill Fields Button */}
                <button
                    type="button"
                    onClick={fillFields}
                    className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    Fill Fields with Test Data
                </button>

                {/* Order Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderDate">
                        Order Date:
                    </label>
                    <input
                        type="datetime-local"
                        id="orderDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                    />
                </div>

                {/* Delivery Date */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryDate">
                        Delivery Date:
                    </label>
                    <input
                        type="date"
                        id="deliveryDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                    />
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status:
                    </label>
                    <input
                        type="text"
                        id="status"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>

                {/* Total Amount */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalAmount">
                        Total Amount:
                    </label>
                    <input
                        type="number"
                        id="totalAmount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        required
                    />
                </div>

                {/* Customer ID */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerId">
                        Customer ID:
                    </label>
                    <input
                        type="number"
                        id="customerId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                        Customer Name:
                    </label>
                    <input
                        type="text"
                        id="customerName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerEmail">
                        Customer Email:
                    </label>
                    <input
                        type="email"
                        id="customerEmail"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Customer Phone */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerPhone">
                        Customer Phone:
                    </label>
                    <input
                        type="tel"
                        id="customerPhone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Place Order
                </button>
            </form>
        </div>
    );
};

export default NewOrderTest;
