import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import { BasketAtom, updateQuantity } from '../../atoms/BasketAtoms';

type InputFieldPaperQuantityProps = {
    item: {
        quantity: number;
        product_id: number;
        price: number;
        name: string;
    };
};

function InputFieldPaperQuantity({ item}: InputFieldPaperQuantityProps) {
    const [inputValue, setInputValue] = useState<string>(item.quantity.toString());
    const [basket, setBasket] = useAtom(BasketAtom); // Access the basket state

    useEffect(() => {
        // Set the input value when item.quantity changes
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    const handleQuantityChange = (newQuantity: string) => {
        // Immediately update the input value
        setInputValue(newQuantity);

        // Exit early if the input is empty
        if (newQuantity === '') return;

        // Parse the new quantity
        const quantity = parseInt(newQuantity, 10);
        const productId = item.product_id;

        // Update the basket based on the new quantity
        if (quantity === 0) {
            updateQuantity(basket, productId, 0, item.price, item.name, setBasket);
            // Remove product if quantity is 0
            setBasket(basket.filter(item => item.product_id !== productId));
            toast.success("Product removed from basket");
        } else {
            updateQuantity(basket, productId, quantity, item.price, item.name, setBasket);
        }
    };

    return (
        <input
            type="number"
            className="w-16 text-center border rounded"
            value={inputValue}
            onChange={(e) => {
                const { value } = e.target;

                // Check if the input value is not empty
                if (value === '') {
                    handleQuantityChange("");
                } else {
                    const numericValue = parseInt(value, 10);
                    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 9999) {
                        handleQuantityChange(numericValue.toString());
                    }
                }
            }}
            min={0}
            max={9999}
        />
    );
}

export default InputFieldPaperQuantity;