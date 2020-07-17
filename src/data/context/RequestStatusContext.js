import React, { useState, useEffect, createContext } from 'react';

export const RequestStatusContext = createContext();

export const RequestStatusProvider = ({ children }) => {
  const [isRequesting, setIsRequesting] = useState(true);
  const store = {
    isRequesting,
    setIsRequesting,
  };

  useEffect(() => {
    return () => null;
  }, [isRequesting]);

  return (
    <RequestStatusContext.Provider value={store}>
      {children}
    </RequestStatusContext.Provider>
  );
};

export default RequestStatusProvider;
