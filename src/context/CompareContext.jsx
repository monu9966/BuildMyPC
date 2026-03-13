import React, { createContext, useState, useContext, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("compareList")) || [];
    setCompareList(saved);
  }, []);

  const toggleCompare = (product) => {
    setCompareList((prev) => {
      const isExist = prev.find(item => item._id === product._id);
      let updated;
      if (isExist) {
        updated = prev.filter(item => item._id !== product._id);
      } else {
        if (prev.length >= 4) {
          alert("You can compare up to 4 products at a time.");
          return prev;
        }
        updated = [...prev, product];
      }
      localStorage.setItem("compareList", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => {
      const updated = prev.filter(item => item._id !== id);
      localStorage.setItem("compareList", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("compareList");
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
