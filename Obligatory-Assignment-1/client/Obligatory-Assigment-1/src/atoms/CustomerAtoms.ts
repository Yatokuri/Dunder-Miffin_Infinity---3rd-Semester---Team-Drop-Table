import { atom } from 'jotai';

// Atom to manage Customer form state
export const CustomerAtoms = atom({
    id: 1,
    address: '',
    email: '',
    name: '',
    phoneNumber: 1,
});

