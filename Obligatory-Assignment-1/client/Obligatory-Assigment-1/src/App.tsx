import './App.css';
import Home from './pages/Home/Home.tsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import NewOrderTest from "./pages/NewOrderTest.tsx";
import NavBar from "./components/NavBar.tsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/CustomService/Contact.tsx";
import CustomService from './pages/CustomService/CustomService.tsx';
import SalesAndDeliveryConditions from "./pages/CustomService/SalesAndDeliveryConditions.tsx";
import GDPRDataProtectionPolicy from "./pages/CustomService/GDPRDataProtectionPolicy.tsx";
import CookiePolicy from "./pages/CustomService/CookiePolicy.tsx";
import WhistleBlowingPolicy from "./pages/CustomService/WhistleBlowingPolicy.tsx";
import FAQ from "./pages/CustomService/FAQ.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import AllOrders from "./pages/AllOrders.tsx";
import Admin from "./pages/Admin/Admin.tsx";

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <BrowserRouter>
                <Toaster />
                <NavBar />
                <div className="flex-grow m-2 pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/ipsum" element={<NewOrderTest />} />
                        <Route path="/customer-service" element={<CustomService />} />
                        <Route path="/customer-service/contact-us" element={<Contact />} />
                        <Route path="/customer-service/faq" element={<FAQ />} />
                        <Route path="/customer-service/sales-and-delivery-conditions" element={<SalesAndDeliveryConditions />} />
                        <Route path="/customer-service/gdpr-data-protection-policy" element={<GDPRDataProtectionPolicy />} />
                        <Route path="/customer-service/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/customer-service/whistleblowing-policy" element={<WhistleBlowingPolicy />} />
                        <Route path="/*" element={<NotFound />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/myOrders" element={<MyOrders />} />
                        <Route path="/allOrders" element={<AllOrders />} />
                    </Routes>
                </div>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;