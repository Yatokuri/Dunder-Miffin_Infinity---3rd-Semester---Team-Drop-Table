import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Api } from "../../Api.ts";
import { useAtom } from "jotai/index";
import { Product, productAtom } from '../atoms/ProductAtom.ts';

// Define the interface for order entries
interface OrderEntry {
    productId: number;
    quantity: number;
    price: number;
}

export const MyApi = new Api();

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

    const [products, setProducts] = useAtom<Product[]>(productAtom);
    const [orderEntries, setOrderEntries] = useState<OrderEntry[]>([]); // Initially empty

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await MyApi.api.paperGetAllPapers(); // Fetch data
                const fetchedProducts: Product[] = response.data as unknown as Product[]; // Use type assertion
                setProducts(fetchedProducts); // Set the products atom
                handleFillOrder(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchData().then(null);
    }, [setProducts]);

    // Autofill predefined test data
    const fillFields = () => {
        const currentDate = new Date();
        // Format order date manually to local time without UTC conversion
        const orderDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}T${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
        const deliveryDate = new Date(currentDate); // Create a new Date object based on the current date
        deliveryDate.setDate(deliveryDate.getDate() + 2); // Two days from now

        // Set the order date and delivery date
        setOrderDate(orderDate); // Using local time format
        setDeliveryDate(deliveryDate.toISOString().slice(0, 10)); // Delivery date in 'YYY
        setStatus('Pending');
        setCustomerId('1');
        setCustomerName('John Doe');
        setCustomerEmail('johndoe@example.com');
        setCustomerPhone('123-456-7890');
        setCustomerAddress('123 Main St, Springfield, IL 62701, USA');

        handleFillOrder(products);
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedOrderEntries = [...orderEntries];
        updatedOrderEntries[index].quantity = newQuantity; // Update quantity
        setOrderEntries(updatedOrderEntries);
        calculateTotalAmount(updatedOrderEntries); // Recalculate total amount
    };

    // Function to calculate total amount
    const calculateTotalAmount = (entries = orderEntries) => {
        const total = entries.reduce((sum: number, entry: OrderEntry) => {
            return sum + (entry.price * entry.quantity);
        }, 0);
        setTotalAmount(total);
    };

    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const selectedId = parseInt(e.target.value);
        const product = products.find(p => p.id === selectedId);

        if (product) {
            const updatedOrderEntries = [...orderEntries];
            updatedOrderEntries[index] = {
                productId: product.id,
                quantity: 1, // Default quantity
                price: product.price
            };
            setOrderEntries(updatedOrderEntries);
            calculateTotalAmount(updatedOrderEntries);
        }
    };

    // Handle filling the order with the first product
    const handleFillOrder = (availableProducts: Product[]) => {
        if (availableProducts.length > 0) {
            const firstProduct = availableProducts[0];
            setOrderEntries([{ productId: firstProduct.id, quantity: 1, price: firstProduct.price }]);
            calculateTotalAmount([{ productId: firstProduct.id, quantity: 1, price: firstProduct.price }]);
        } else {
            setOrderEntries([]);
            setTotalAmount(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            setOrderEntries([]); // Clear the order entries
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

                {/* Order Entries List */}
                {orderEntries.map((entry, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`productSelect${index}`}>
                            Select Product:
                        </label>
                        <select
                            id={`productSelect${index}`}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={entry.productId}
                            onChange={(e) => handleProductSelect(e, index)}
                        >
                            <option value="" disabled>
                                {products.length === 0 ? "No products available" : "Select a product"}
                            </option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${product.price.toFixed(2)} - X{product.stock}
                                </option>
                            ))}
                        </select>

                        {/* Quantity Input */}
                        <input
                            type="numberOfEntries"
                            min="1"
                            value={entry.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 mt-2"
                        />
                    </div>
                ))}

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
