import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FijosScreen from '../pages/FijosScreen';
import AddScreen from '../pages/AddScreen';
import NavbarComponent from '../components/NavbarComponent';

export default function RouterConfig() {
    return (
        <BrowserRouter>
            <NavbarComponent />
            <Routes>
                <Route path='/fijos' element={<FijosScreen />} />
                <Route path='/agregar' element={<AddScreen />} />
            </Routes>
        </BrowserRouter>
    )
}