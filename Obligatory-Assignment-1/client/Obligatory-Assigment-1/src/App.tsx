import './App.css';
import Home from './pages/Home.tsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import NewOrderTest from "./pages/NewOrderTest.tsx";
import NavBar from "./components/NavBar.tsx";
import {Toaster} from "react-hot-toast";
import Footer from "./components/Footer.tsx";
import About from "./pages/About.tsx";

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
                            <Route path={'/ipsum'} element={<NewOrderTest />} />
                            <Route path={'/*'} element={<NotFound />} />
                            <Route path={'/about'} element={<About />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
