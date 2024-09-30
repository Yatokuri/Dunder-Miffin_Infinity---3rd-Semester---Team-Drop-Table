import { atom } from 'jotai';

// Atom to manage Profile form state
export const ProfilePageAtom = atom({
    address: '',
    email: '',
    name: '',
    phoneNumber: '',
});

