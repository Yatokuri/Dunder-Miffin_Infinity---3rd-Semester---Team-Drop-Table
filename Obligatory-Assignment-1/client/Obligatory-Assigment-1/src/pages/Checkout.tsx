// CheckoutPage.tsx
import { useAtom } from 'jotai';
import { BasketAtom, TotalAmountAtom } from '../atoms/BasketAtoms.ts'; // Corrected path
import { clearCustomerData, CustomerAtoms } from '../atoms/CustomerAtoms.ts'; // Corrected path
import { authAtom, clearAuthData, loginFormAtom } from "../atoms/LoginAtoms.ts"; // Import the auth atom
import { ShippingAtom, SelectedShippingOptionAtom } from '../atoms/ShippingAtom.ts'; // Import shipping atoms
import { useState, useEffect } from 'react';
import OrderPlacementComponent from "../components/PlaceOrder.tsx";

const CheckoutPage = () => {
    const [customer, setCustomer] = useAtom(CustomerAtoms);
    const [basket] = useAtom(BasketAtom);
    const [totalAmountBasket] = useAtom(TotalAmountAtom);
    const [authState, setAuthState] = useAtom(authAtom); // Subscribe to auth state
    const [, setLoginForm] = useAtom(loginFormAtom); // Get loginFormAtom state
    const [shippingOptions] = useAtom(ShippingAtom); // Use shipping options atom
    const [selectedShippingOption, setSelectedShippingOption] = useAtom(SelectedShippingOptionAtom); // Use selected shipping option atom



    // Local state for payment details
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    const [fakePassword, setFakePassword] = useState({
        password: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Validation states
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        name: '',
        address: '',
        phoneNumber: '',
        cardNumber: '',
        expirationDate: '',
        cvv: '',
    });

    // Automatically set current step to 2 if customer data exists
    useEffect(() => {
        if (authState.isLoggedIn) { // Check if user is logged in
            setCurrentStep(2);
        } else {
            setCurrentStep(1); // Reset to Step 1 if not logged in
        }
    }, [authState.isLoggedIn]); // Dependency array to run effect when login state changes


    // Validate all steps
    const validateAllFields = () => {
        const newErrors = { ...errors };

        // Step 1 validation
        if (currentStep === 1) {
            if (!customer.email) {
                newErrors.email = 'Email is required';
            } else {
                newErrors.email = '';
            }
            if (!fakePassword.password) {
                newErrors.password = 'Password is required';
            } else {
                newErrors.password = '';
            }
        }

        // Step 2 validation
        if (currentStep === 2) {
            if (!customer.name) {
                newErrors.name = 'Name is required';
            } else {
                newErrors.name = '';
            }
            if (!customer.address) {
                newErrors.address = 'Address is required';
            } else {
                newErrors.address = '';
            }
            if (!customer.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required';
            } else {
                newErrors.phoneNumber = '';
            }
        }

        // Step 3 validation
        if (currentStep === 3) {
            if (!paymentDetails.cardNumber) {
                newErrors.cardNumber = 'Card number is required';
            } else {
                newErrors.cardNumber = '';
            }
            if (!paymentDetails.expirationDate) {
                newErrors.expirationDate = 'Expiration date is required';
            } else {
                newErrors.expirationDate = '';
            }
            if (!paymentDetails.cvv) {
                newErrors.cvv = 'CVV is required';
            } else {
                newErrors.cvv = '';
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleNextStep = () => {
        if (validateAllFields()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePlaceOrder = () => {
        // Here, you would typically send order data to a backend for processing
        setOrderPlaced(true);
    };

    const handleLogout = () => {
        clearAuthData(); // Clear authentication data from localStorage
        clearCustomerData(); // -||-
        setAuthState({ email: '', isLoggedIn: false }); // Set user as logged out
        setLoginForm({ email: '', password: '' }); // Reset login form state
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {/* Step Indicator */}
            <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className={`flex-1 text-center ${currentStep === step ? 'font-bold' : ''}`}>
                        Step {step}
                    </div>
                ))}
            </div>

            {/* Step 1: Log In */}
            {currentStep === 1 && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Log In</h2>
                    <form className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                placeholder="john.doe@example.com"
                                className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <div className="h-2 text-red-500 text-sm">{errors.email}</div>}
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                className={`input input-bordered w-full ${errors.password ? 'border-red-500' : ''}`}
                                onChange={(e) => setFakePassword({ ...fakePassword, password: e.target.value })}
                            />
                            {errors.password && <div className="h-2 text-red-500 text-sm">{errors.password}</div>}
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handleLogout}>
                            Logout
                        </button>
                        <button className="btn btn-primary mt-4" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Address and Shipping Options */}
            {currentStep === 2 && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    {/* Container for Address and Shipping Options */}
                    <div className="flex bg-base-100 rounded-lg shadow-md mb-4 p-4">
                        <div className="flex-1 pr-4">
                            <h2 className="text-2xl font-semibold mb-4">Address</h2>
                            <form className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                        placeholder="John Doe"
                                        className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    {errors.name && <div className="h-2 text-red-500 text-sm">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="label">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={customer.address}
                                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                        placeholder="123 Main St"
                                        className={`input input-bordered w-full ${errors.address ? 'border-red-500' : ''}`}
                                    />
                                    {errors.address && <div className="h-2 text-red-500 text-sm">{errors.address}</div>}
                                </div>
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={customer.phoneNumber}
                                        onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
                                        placeholder="(555) 123-4567"
                                        className={`input input-bordered w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                    />
                                    {errors.phoneNumber && (
                                        <div className="h-2 text-red-500 text-sm">{errors.phoneNumber}</div>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="flex-1 pl-4">
                            <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
                            <form className="grid grid-cols-1 gap-4">
                                {shippingOptions.map(option => (
                                    <div key={option.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={option.id}
                                            name="shipping"
                                            checked={selectedShippingOption.id === option.id}
                                            onChange={() => setSelectedShippingOption(option)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={option.id} className="flex-1">
                                            <span className="font-semibold">{option.name}</span><br />
                                            Price: ${option.price.toFixed(2)}<br />
                                            Estimated Delivery: {option.deliveryTime}<br />
                                            {option.price >= option.freeShippingRequirement
                                                ? `Free shipping on orders over $${option.freeShippingRequirement}.`
                                                : ''
                                            }
                                        </label>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>

                    {/* Buttons for Navigation */}
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <button className="btn btn-primary" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}




            {/* Step 3: Payment */}
            {currentStep === 3 && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Payment</h2>
                    <form className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="label">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                placeholder="1234 5678 9012 3456"
                                className={`input input-bordered w-full ${errors.cardNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.cardNumber && <div className="h-2 text-red-500 text-sm">{errors.cardNumber}</div>}
                        </div>
                        <div>
                            <label className="label">Expiration Date</label>
                            <input
                                type="text"
                                name="expirationDate"
                                value={paymentDetails.expirationDate}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, expirationDate: e.target.value })}
                                placeholder="MM/YY"
                                className={`input input-bordered w-full ${errors.expirationDate ? 'border-red-500' : ''}`}
                            />
                            {errors.expirationDate && <div className="h-2 text-red-500 text-sm">{errors.expirationDate}</div>}
                        </div>
                        <div>
                            <label className="label">CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={paymentDetails.cvv}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                placeholder="123"
                                className={`input input-bordered w-full ${errors.cvv ? 'border-red-500' : ''}`}
                            />
                            {errors.cvv && <div className="h-2 text-red-500 text-sm">{errors.cvv}</div>}
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <button className="btn btn-primary mt-4" onClick={handleNextStep}>
                            Next
                        </button>
                    </div>
                </div>
            )}


            {/* Step 4: Confirm */}
            {currentStep === 4 && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Confirm Your Order</h2>

                    {/* Customer Information */}
                    <h3 className="text-lg mb-2">Customer Information</h3>
                    <p>Name: {customer.name}</p>
                    <p>Email: {customer.email}</p>
                    <p>Address: {customer.address}</p>
                    <p>Phone: {customer.phoneNumber}</p>

                    {/* Delivery Method */}
                    <h3 className="text-lg mt-4 mb-2">Delivery Method</h3>
                    <p>
                        {selectedShippingOption.name} - ${selectedShippingOption.price.toFixed(2)}
                    </p>

                    {/* Order Summary */}
                    <h3 className="text-lg mt-4 mb-2">Order Summary</h3>
                    <ul className="space-y-2">
                        {basket.map((item) => (
                            <li key={item.product_id} className="flex justify-between">
                                <span>ID {item.product_id} (x{item.quantity})</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Calculate Total Price */}
                    {/* Sum the prices of the basket items */}
                    <p className="mt-4 font-bold">
                        Subtotal: $
                        {totalAmountBasket.toFixed(2)}
                    </p>

                    {/* Add Shipping Cost */}
                    <p className="mt-2">Shipping Cost: ${selectedShippingOption.price.toFixed(2)}</p>

                    {/* Total Price Calculation */}
                    <p className="mt-4 font-bold">
                        Total Price: $

                        {(totalAmountBasket + selectedShippingOption.price).toFixed(2)}
                    </p>

                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={handlePrevStep}>
                            Previous
                        </button>
                        <OrderPlacementComponent />
                    </div>
                </div>
            )}


            {/* Step 5: Complete */}
            {orderPlaced && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p>A confirmation email has been sent to {customer.email}.</p>
                    <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
                        Back to Home
                    </button>
                </div>
            )}

            {/* Order Confirmation */}
            {orderPlaced && (
                <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
                    <p>Your order has been placed successfully!</p>
                    <p>Total Price: ${totalAmountBasket.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
