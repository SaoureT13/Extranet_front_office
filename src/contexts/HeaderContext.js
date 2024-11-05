// src/contexts/HeaderContext.js
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  return (
    <HeaderContext.Provider value={{ searchTerm, setSearchTerm, handleSearchSubmit }}>
      {children}
    </HeaderContext.Provider>
  );
};
