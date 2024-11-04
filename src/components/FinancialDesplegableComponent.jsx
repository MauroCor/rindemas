import React, { useState } from 'react';

const FinancialDesplegableComponent = ({ title, amount, isIncome }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div>
            <div onClick={() => setShowDetails(!showDetails)} className="cursor-pointer mt-4 bg-gray-700 hover:bg-gray-600 rounded-3xl flex justify-between items-center p-4">
                <label>{title}</label>
                <div className='right-4 text-xs text-gray-950'>{showDetails ? '▲' : '▼'}</div>
                <div>
                    <label className={`text-2xl ${isIncome ? 'text-green-500' : 'text-red-500'}`}>${amount}k</label>
                </div>
            </div>
            {showDetails && (
                <div className="grid grid-cols-[2fr,2fr,1fr] mt-2 border-gray-600 divide-y divide-gray-600">
                    <div className="p-2 text-center">Tarjeta</div>
                    <div className="p-2 text-center">$350k</div>
                    <div className="text-center cursor-pointer text-red-500 hover:text-red-700 text-xl pt-1">x</div>
                    <div className="p-2 text-center">Alquiler</div>
                    <div className="p-2 text-center">$300k</div>
                    <div className="text-center cursor-pointer text-red-500 hover:text-red-700 text-xl pt-1">x</div>
                </div>
            )}

            {/* Filas de datos con divide-y */}
            {/* {ingresos.map((ingreso) => (
                <div key={ingreso.id} className="grid grid-cols-3 divide-y divide-gray-600">
                    <div className="p-2 text-center">{ingreso.nombre}</div>
                    <div className="p-2 text-center">${ingreso.monto}</div>
                    <div
                        onClick={() => handleDelete(ingreso.id)}
                        className="p-2 text-center cursor-pointer text-red-500 hover:text-red-700"
                    >
                        x
                    </div>
                </div>
            ))} */}

            {/* {ingresos.map((ingreso, index) => (
                <div
                    key={ingreso.id}
                    className={`grid grid-cols-3 ${index > 0 ? 'divide-y divide-gray-600' : ''}`}
                >
                    <div className="p-2 text-center">{ingreso.nombre}</div>
                    <div className="p-2 text-center">${ingreso.monto}</div>
                    <div
                        onClick={() => handleDelete(ingreso.id)}
                        className="p-2 text-center cursor-pointer text-red-500 hover:text-red-700"
                    >
                        x
                    </div>
                </div>
            ))} */}
        </div>
    );
};

export default FinancialDesplegableComponent;
