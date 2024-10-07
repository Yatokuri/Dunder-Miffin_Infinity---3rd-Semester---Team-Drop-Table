// ShippingAtoms.ts
import { atom } from 'jotai';

// Define the shipping options
const shippingOptions = [
    {
        id: 'standard',
        name: 'Standard Shipping',
        price: 5.99,
        deliveryTime: '5-7 business days',
        freeShippingRequirement: 50, // Minimum purchase for free shipping
    },
    {
        id: 'express',
        name: 'Express Shipping',
        price: 15.99,
        deliveryTime: '2-3 business days',
        freeShippingRequirement: 100, // Minimum purchase for free shipping
    },
    {
        id: 'overnight',
        name: 'Overnight Shipping',
        price: 25.99,
        deliveryTime: '1 business day',
        freeShippingRequirement: 150, // Minimum purchase for free shipping
    },
];

// Create the atom for shipping options
export const ShippingAtom = atom(shippingOptions);
export const SelectedShippingOptionAtom = atom(shippingOptions[0]); // Default to the first option
