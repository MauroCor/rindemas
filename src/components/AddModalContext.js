import React, { createContext, useContext, useState, useCallback } from 'react';

const AddModalContext = createContext();

export const AddModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Ingreso');

  const openAddModal = useCallback((option) => {
    setSelectedOption(option || 'Ingreso');
    setIsOpen(true);
  }, []);

  const closeAddModal = useCallback(() => setIsOpen(false), []);

  return (
    <AddModalContext.Provider value={{ isOpen, openAddModal, closeAddModal, selectedOption }}>
      {children}
    </AddModalContext.Provider>
  );
};

export const useAddModal = () => useContext(AddModalContext);


