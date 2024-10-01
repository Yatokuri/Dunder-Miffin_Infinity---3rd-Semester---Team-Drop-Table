import { atom } from 'jotai';

// Define a type for a basket item
type BasketItem = {
    product_id: number;
    quantity: number;
};

export const BasketAtom = atom<BasketItem[]>([]);