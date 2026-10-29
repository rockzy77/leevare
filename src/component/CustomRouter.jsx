import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Leevare from "../pages/Home";


const CustomRouter = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Leevare />}/>
        </Routes>
    </BrowserRouter>
}

export default CustomRouter;