import { atom } from 'jotai';

// Define a type for a basket item
type BasketItem = {
    product_id: number;
    quantity: number;
    price: number;
};

// Initialize the basket atom as an array of BasketItem
export const BasketAtom = atom<BasketItem[]>([]);

// Derived atom to calculate total amount from the basket items
export const TotalAmountAtom = atom((get) => {
    const basket = get(BasketAtom);
    return basket.reduce((total, item) => total + item.quantity * item.price, 0);
});
