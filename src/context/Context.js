import React, { createContext } from 'react';

export const Context = createContext();

export function ContextProvider(props) {
    
    const contextValue = {
        someValue: 'Este es un valor de contexto',
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}