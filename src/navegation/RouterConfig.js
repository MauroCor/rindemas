import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';

import FijosScreen from '../pages/FijosScreen';
import AddScreen from '../pages/AddScreen';
import CardScreen from '../pages/CardScreen';

export default function RouterConfig() {
    return (
        <BrowserRouter basename="/sm">
            <NavbarComponent />
            <Routes>
                <Route path='/' element={<Navigate to="/fijos" />} />
                <Route path='/fijos' element={<FijosScreen />} />
                <Route path='/agregar' element={<AddScreen />} />
                <Route path='/tarjetas' element={<CardScreen />} />
            </Routes>
        </BrowserRouter>
    )
}