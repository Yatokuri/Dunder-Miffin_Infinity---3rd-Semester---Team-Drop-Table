import './App.css';
import Home from './pages/Home.tsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import NavBar from "./components/NavBar.tsx";
import {Toaster} from "react-hot-toast";
import Footer from "./components/Footer.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Toaster/>
                <NavBar />
                <div>
                    <div className="m-2 pt-16">
                        <Routes>
                            <Route path={'/'} element={<Home />} />
                            <Route path={'/home'} element={<Home />} />
                            <Route path={'/*'} element={<NotFound />} />
                            <Route path={'/about'} element={<About />} />
                            <Route path={'/contact-us'} element={<Contact />} />
                            <Route path={'/profile'} element={<Profile />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
