import {
	CssBaseline,
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material";
import React, {PropsWithChildren} from "react";
  
const appTheme = createTheme({
  palette: {
    primary: {
      main: "#65558F",
    },
    secondary: {
      main: "#625B71",
    },
    error: {
      main: "#BA1A1A",
    },
    background: {
      default: "#FDF7FF",
    },
    text: {
      primary: "#1D1B20",
      secondary: "#49454E",
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica",
    h1: {
      fontSize: "32px",
      fontWeight: 400,
      letterSpacing: "0px",
      lineHeight: "40px",
    	textAlign: "center",
    },
    h2: {
      fontSize: "22px",
      fontWeight: 400,
      letterSpacing: "0px",
      lineHeight: "36px",
      textAlign: "center",
    },
    h3: {
      fontSize: "24px",
      fontWeight: 400,
      letterSpacing: "0px",
      lineHeight: "32px",
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      letterSpacing: "0.5px",
      lineHeight: "24px",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "0.25px",
      lineHeight: "20px",
    },
    button: {
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "0.1px",
      lineHeight: "20px",
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          fontWeight: 400,
          letterSpacing: "0.5px",
          lineHeight: "24px",
        },
      },
    },
  },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};  