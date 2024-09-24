import { atom } from 'jotai';

// Atom to manage login form state
export const loginFormAtom = atom({
    email: '',
    password: '',
});

// Atom to manage authentication state
export const authAtom = atom({
    email: '', //ITM 0 = Admin - or a customer
    isLoggedIn: false,
});
