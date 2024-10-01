import { atom } from 'jotai';

// Define types for the authentication state
interface AuthState {
    email: string;
    isLoggedIn: boolean;
}

// Atom to manage login form state
export const loginFormAtom = atom({
    email: '',
    password: '',
});

// Initial auth state
const initialAuthState: AuthState = {
    email: '', //ITM 0 = Admin - or a customer
    isLoggedIn: false,
};

// Set authentication data in localStorage and return updated state
export const setAuthData = (data: AuthState) => {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
    localStorage.setItem('authData', JSON.stringify({ ...data, expirationTime }));
    return data; // Return the updated state to tell relevant site there is now logged out
};

// Function to get authentication data from localStorage
const getAuthData = (): AuthState | null => {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
        const { email, isLoggedIn, expirationTime } = JSON.parse(storedAuthData);
        if (new Date().getTime() < expirationTime) {
            return { email, isLoggedIn };
        } else {
            localStorage.removeItem('authData');
        }
    }
    return null;
};

// Function to clear authentication data
export const clearAuthData = () => {
    localStorage.removeItem('authData'); // Clear authentication data
    return initialAuthState; // Return initial state
};


// Initialize authAtom with stored data if available
const storedAuthData = getAuthData();
export const authAtom = atom<AuthState>(storedAuthData || initialAuthState);
