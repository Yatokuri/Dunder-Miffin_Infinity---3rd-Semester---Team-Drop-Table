// OrderPlacementComponent.tsx
import React from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { BasketAtom, TotalAmountAtom } from '../atoms/BasketAtoms'; // Ensure the path is correct
import { SelectedShippingOptionAtom } from '../atoms/ShippingAtom'; // Ensure the path is correct
import { CustomerAtoms } from '../atoms/CustomerAtoms'; // Ensure the path is correct

const OrderPlacementComponent: React.FC = () => {
    // Fetching the necessary state from atoms
    const [basket, setBasket] = useAtom(BasketAtom); // Current items in the basket
    const [totalAmount] = useAtom(TotalAmountAtom); // Total amount of the order
    const [selectedShippingOption] = useAtom(SelectedShippingOptionAtom); // Selected shipping option
    const [customerData] = useAtom(CustomerAtoms); // Customer data

    const [orderPlaced, setOrderPlaced] = React.useState(false); // State to track if the order is placed


    const sendOrder = async () => {
        // Prepare the current date
        const currentDate = new Date();

        // Determine delivery days based on selected shipping option
        let deliveryDays;
        switch (selectedShippingOption.id) {
            case 'standard':
                deliveryDays = 7; // Standard shipping takes 5-7 business days
                break;
            case 'express':
                deliveryDays = 3; // Express shipping takes 2-3 business days
                break;
            case 'overnight':
                deliveryDays = 1; // Overnight shipping takes 1 business day
                break;
            default:
                deliveryDays = 2; // Default to 2 days if no option is selected
        }

        // Calculate the delivery date by adding the delivery days to the current date
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + deliveryDays);

        // Prepare the order data
        const orderData = {
            customer: {
                id: customerData.id,
                name: customerData.name,
                address: customerData.address,
                phone: customerData.phoneNumber,
                email: customerData.email,
            },
            order: {
                orderDate: currentDate.toISOString(), // Current date in ISO format
                deliveryDate: deliveryDate.toISOString(), // Delivery date based on selected shipping option
                status: 'Pending', // Default order status
                totalAmount, // Ensure totalAmount is defined
            },
            orderEntries: basket.map(item => ({
                productId: item.product_id, // Assuming product_id matches the expected API structure
                quantity: item.quantity,
                price: item.price, // Include price if needed
            })),
        };

        try {
            // Sending the order to the API
            const response = await axios.post('http://localhost:5261/api/order', orderData);
            alert(`Order created with ID: ${response.data.id}`);
            // Clear the form or perform any additional actions after order is placed
            setBasket([]); // Clear the basket after order is placed
        } catch (error) {
            console.error('There was an error creating the order!', error);
            alert('Failed to create order. Please check console for details.');
        }
    };


    const handlePlaceOrder = async () => {
        try {
            const orderId = await sendOrder(); // Call sendOrder function
            alert(`Order created with ID: ${orderId}`);
            setOrderPlaced(true); // Update state if order is placed successfully
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred while placing the order.');
        }
    };

    return (
        <>
            <button
                onClick={handlePlaceOrder}
                className="btn btn-primary"
            >
                Place Order
            </button>
            {orderPlaced && <p>Order has been placed successfully!</p>}
        </>
    );
};

export default OrderPlacementComponent;
