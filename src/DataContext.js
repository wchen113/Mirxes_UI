import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [articles, setArticles] = useState([]); // Add articles state

  return (
    <DataContext.Provider value={{ suppliers, setSuppliers, events, setEvents, selectedSupplier, setSelectedSupplier, articles, setArticles }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
