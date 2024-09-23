import './App.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/home'} element={<Home />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App