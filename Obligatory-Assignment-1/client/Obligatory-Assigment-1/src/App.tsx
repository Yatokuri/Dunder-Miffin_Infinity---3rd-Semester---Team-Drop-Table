import './App.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound.tsx";


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/home'} element={<Home />} />
                    <Route path={'/*'} element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App