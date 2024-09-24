import './App.css';
import Home from './pages/Home.tsx';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <NavBar />
                <div style={{ paddingTop: '4rem' }}> {/* Adjust according to NavBar height */}
                    <div className="m-2"> {/* Global Margin */}
                        <Routes>
                            <Route path={'/'} element={<Home />} />
                            <Route path={'/home'} element={<Home />} />
                            <Route path={'/*'} element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
