import React, { useState, useEffect,createContext } from "react";

export const RequestStatusContext = createContext();

export const RequestStatusProvider =  (props) => {
  const [isRequesting, setIsRequesting] = useState(true);
  const store = {
    isRequesting,
    setIsRequesting
  }

  useEffect(() => {
    console.log("useEffect = isRequesting ==>", isRequesting);
    return () => null;
  }, [isRequesting]);

  return (
  <RequestStatusContext.Provider value={store}>
    {props.children}
  </RequestStatusContext.Provider>
  )
}

 export default RequestStatusProvider;