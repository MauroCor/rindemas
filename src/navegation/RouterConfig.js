import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FijosScreen from '../pages/FijosScreen';

export default function RouterConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/fijos' element={<FijosScreen />} />
            </Routes>
        </BrowserRouter>
    )
}