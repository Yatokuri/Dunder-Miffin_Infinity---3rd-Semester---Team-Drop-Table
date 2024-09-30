import axios from 'axios';
import { useState } from "react";

// Define the interface for order entries
interface OrderEntry {
    productId: number;
    quantity: number;
    price: number;
}

const NewOrderTest = () => {
    const [orderDate, setOrderDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [status, setStatus] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');


    const [orderEntries, setOrderEntries] = useState<OrderEntry[]>([{ productId: 1, quantity: 1, price: 100.00 }]); // Default entry
    const [numberOfEntries, setNumberOfEntries] = useState(1); // New field for number of order entries

    // Autofill predefined test data
    const fillFields = () => {
        const currentDate = new Date();
        setOrderDate(new Date().toISOString().slice(0, 16));
        setDeliveryDate(new Date(currentDate.setDate(currentDate.getDate() + 2)).toISOString().slice(0, 10)); // Two days from now
        setStatus('Pending');
        setCustomerId('1');
        setCustomerName('John Doe');
        setCustomerEmail('johndoe@example.com');
        setCustomerPhone('123-456-7890');
        setCustomerAddress('123 Main St, Springfield, IL 62701, USA');

        // Reset number of entries and order entries remember to have this in you db for testing purpose and right id
        setNumberOfEntries(1); // Reset number of entries to 1
        setOrderEntries([{ productId: 1, quantity: 1, price: 100.00 }]); // Reset to default entry
        calculateTotalAmount([{ productId: 1, quantity: 1, price: 100.00 }]); // Calculate initial total amount
    };

    // Function to update the number of entries
    const handleNumberOfEntriesChange = (e: { target: { value: string; }; }) => {
        const count = parseInt(e.target.value);
        setNumberOfEntries(count);

        // Update orderEntries array based on the number of entries
        const newEntries = Array.from({ length: count }, () => ({ productId: 1, quantity: 1, price: 100.00 }));
        setOrderEntries(newEntries);
        calculateTotalAmount(newEntries);
    };

    // Function to calculate total amount
    const calculateTotalAmount = (entries: OrderEntry[]) => {
        const total = entries.reduce((sum: number, entry: OrderEntry) => sum + (entry.price * entry.quantity), 0);
        setTotalAmount(total);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const orderData = {
            customer: {
                id: parseInt(customerId),
                name: customerName,
                address: customerAddress,
                phone: customerPhone,
                email: customerEmail
            },
            order: {
                orderDate,
                deliveryDate,
                status,
                totalAmount,
            },
            orderEntries: orderEntries.map(entry => ({
                    productId: entry.productId,
                    quantity: entry.quantity
                }))
        };

        try {
            const response = await axios.post('http://localhost:5261/api/order', orderData);
            alert(`Order created with ID: ${response.data.id}`);
            // Clear the form
            setOrderDate('');
            setDeliveryDate('');
            setStatus('');
            setTotalAmount(0);
            setCustomerId('');
            setNumberOfEntries(1); // Reset number of entries to 1
            setOrderEntries([{ productId: 1, quantity: 1, price: 100.00 }]); // Reset to default entry
        } catch (error) {
            console.error('There was an error creating the order!', error);
            alert('Failed to create order. Please check console for details.');
        }
    };


    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-4">Order Management System Beta 0.2</h1>

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

                {/* Number of Order Entries */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberOfEntries">
                        Number of Order Entries:
                    </label>
                    <input
                        type="number"
                        id="numberOfEntries"
                        min="1"
                        value={numberOfEntries}
                        onChange={handleNumberOfEntriesChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

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
                        readOnly // Make it read-only since it's calculated
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

                {/* Customer Address */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerAddress">
                        Customer Address:
                    </label>
                    <input
                        type="text"
                        id="customerAddress"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
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
