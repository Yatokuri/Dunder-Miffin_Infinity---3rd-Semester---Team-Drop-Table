import { atom } from 'jotai';

// Atom to hold the order data
export const orderAtom = atom<OrderDto[]>([]); // Initialize with an empty array


// OrderEntryDto interface
export interface OrderEntryDto {
    id: number;
    quantity: number;
    productId: number;
}

// OrderDto interface
export interface OrderDto {
    id: number;
    customerId: number;
    customerName: string;
    orderDate: number;
    deliveryDate: number;
    status: string;
    totalAmount: number;
    orderEntries: OrderEntryDto[];
}