import React, { useState, useEffect, createContext,useRef } from "react";

import { MuiThemeProvider, CssBaseline, createMuiTheme } from "@material-ui/core";
import { darkThemeObj, lightThemeObj } from "../../theme"

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const isInitialMount = useRef(true);
  const [currentTheme, setCurrentTheme] = useState(darkThemeObj);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const changeTheme = (isDarkTheme) => {
    return isDarkTheme ? darkThemeObj : lightThemeObj;
  };

  useEffect(() => {
    if(isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      let newCurrentTheme = changeTheme(isDarkTheme);
      setCurrentTheme(newCurrentTheme);
    }
    return () => null
  }, [isDarkTheme])

  const muiTheme = createMuiTheme(currentTheme);

  return (
    <ThemeContext.Provider value={{isDarkTheme, setIsDarkTheme}}>
      <MuiThemeProvider theme={muiTheme} >
          <CssBaseline />
          {props.children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;