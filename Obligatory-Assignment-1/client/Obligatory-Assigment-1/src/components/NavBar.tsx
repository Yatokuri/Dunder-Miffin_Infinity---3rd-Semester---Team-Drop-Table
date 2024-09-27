import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoDMI.png';
import AccountIcon from '../assets/icons/AccountIcon';
import BasketIcon from '../assets/icons/BasketIcon';
import BurgerMenuIcon from '../assets/icons/BurgerMenuIcon';
import { searchAtom } from "../atoms/atoms.ts";
import { loginFormAtom, authAtom } from '../atoms/LoginAtoms.ts'; // Importing the atoms
import { LoginModal } from './LoginModal.tsx';
import { toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define prop types for NavLinks
interface NavLinksProps {
    toggleDropdown: (name: string) => void;
    activeDropdown: string | null; // Track the currently active dropdown
}

// Navigation Links Component
const NavLinks: React.FC<NavLinksProps> = ({ toggleDropdown, activeDropdown }) => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    // Update isMobile on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="dropdown relative">
                <button onClick={() => toggleDropdown('products')} className="btn btn-ghost">
                    Products
                </button>
                {activeDropdown === 'products' && (
                    <ul
                        className={`absolute ${
                            isMobile
                                ? 'left-full top-0 ml-2 w-max' // Mobile: dropdown to the right of button
                                : 'left-0 top-full mt-3' // Desktop: dropdown below button
                        } p-2 shadow bg-base-100 rounded-box w-auto z-10`}
                    >
                        <li className="hover:bg-gray-200">
                            <Link to="catagory/1">Page 1</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="catagory/2">Page 2</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="catagory/3">Page 3</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="catagory/4">Page 4</Link>
                        </li>
                    </ul>
                )}
            </div>
            <Link to="/ipsum" className="btn btn-ghost">Lorem</Link>
            <Link to="/about" className="btn btn-ghost">About Us</Link>
            <Link to="/customer-service/contact-us" className="btn btn-ghost">Contact</Link>
        </>
    );
};

// Define props for AccountDropdown
interface AccountDropdownProps {
    isOpen: boolean;
    toggle: () => void;
    userLoggedIn: boolean; // Check if the user is logged in
    handleLogin: () => void; // Function to handle login
    handleLogout: () => void; // Function to handle logout
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({isOpen, toggle, userLoggedIn, handleLogin, handleLogout,}) => (
    <div className="relative">
        <button onClick={toggle} className="btn btn-ghost">
            <AccountIcon className="w-6 h-6 text-icon-color" />
        </button>
        {isOpen && (
            <ul className={`absolute left-0 top-full mt-3 p-2 shadow bg-base-100 rounded-box w-max z-10`}>
                {userLoggedIn ? (
                    <>
                        <li className="hover:bg-gray-200">
                            <Link to="/profile">My Profile</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="/myOrders">My Orders</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <Link to="/allOrders">All Orders</Link>
                        </li>
                        <li className="hover:bg-gray-200">
                            <button onClick={handleLogout} className="w-full text-left">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="hover:bg-gray-200">
                        <button onClick={handleLogin} className="w-full text-left">
                            Login
                        </button>
                    </li>
                )}
            </ul>
        )}
    </div>
);

// NavBar Component
const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false); // Track burger menu open state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Track active dropdown
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false); // Track login modal state
    const [searchValue, setSearchValue] = useAtom(searchAtom);
    const [authState, setAuthState] = useAtom(authAtom); // Get authAtom state
    const [, setLoginForm] = useAtom(loginFormAtom); // Get loginFormAtom state
    const navigate = useNavigate(); // Create navigate instance

    const handleLogin = () => {
        setLoginModalOpen(true); // Show login modal
    };

    const handleCloseModal = () => {
        setLoginModalOpen(false); // Close login modal
    };

    const handleLogout = () => {
        setAuthState({ email: '', isLoggedIn: false }); // Set user as logged out
        setLoginForm({ email: '', password: '' }); // Reset login form state
        toast.success("You have logged out successfully!", {duration: 3000,});
        navigate('/'); // Navigate to home page
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = (name: string) => {
        setActiveDropdown((prev) => (prev === name ? null : name)); // Toggle dropdown
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && !target.closest('.dropdown')) { // Check if target is defined
                setActiveDropdown(null); // Close dropdowns if clicked outside
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);


    return (
        <nav className="navbar bg-base-100 shadow-lg fixed top-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className="mr-4"> {/* Margin for spacing */}
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10 min-w-10"/>
                    </Link>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div
                        className="md:hidden bg-base-100 p-4 transition-all duration-300 ease-in-out absolute top-16 left-0">
                        <div className="flex flex-col space-y-2">
                            <NavLinks
                                toggleDropdown={toggleDropdown}
                                activeDropdown={activeDropdown}
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Menu */}
                <div className="hidden md:flex justify-start space-x-4 items-center">
                    <NavLinks
                        toggleDropdown={toggleDropdown}
                        activeDropdown={activeDropdown}
                    />
                </div>

                {/* Search Field (Always Visible) */}
                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Navigation Icons (Always Visible) */}
                <div className="flex items-center space-x-4">
                    {/* Toggle Button for Mobile View */}
                    <button
                        onClick={toggleMenu}
                        className="block md:hidden btn btn-ghost"
                        aria-label="Toggle Menu"
                    >
                        <BurgerMenuIcon className="w-6 h-6"/>
                    </button>

                    {/* Account Menu */}
                    <div className="dropdown">
                        <AccountDropdown
                            isOpen={activeDropdown === 'account'}
                            toggle={() => toggleDropdown('account')}
                            userLoggedIn={authState.isLoggedIn} // Check from authAtom
                            handleLogin={handleLogin} // Pass the login function
                            handleLogout={handleLogout} // Pass the logout function
                        />
                    </div>

                    {/* Basket Menu */}
                    <Link to="/basket" className="btn btn-ghost">
                        <BasketIcon className="w-6 h-6 text-icon-color"/>
                    </Link>
                </div>
            </div>

            {isLoginModalOpen && (
                <LoginModal
                    onConfirm={() => {
                        handleCloseModal(); // Close modal
                    }}
                    onCancel={handleCloseModal} // Close modal on cancel
                />
            )}

        </nav>
    );
};

export default NavBar;
