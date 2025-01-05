import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import SimpleConverter from "./components/SimpleConverter";
import AdvancedConverter from "./components/AdvancedConverter";
import HomeScreen from "./components/HomeScreen";
import Navbar from "./components/Navbar";
import CesiumMap from "./components/CesiumMap";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/simple" element={<SimpleConverter/>}/>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/advanced" element={<CesiumMap/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;