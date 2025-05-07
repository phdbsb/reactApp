import { createTheme } from "@mui/material";


const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#2188a3",
      light: "#ddd",
      contrastText: "#ffffff",
    },
    background: {
      paper: "#4f5459",
    },
    text: {
      primary: "#fff",
      secondary: "#ddd",
    },
    grey: {
      "100": "#4c5053"
    },
    action: {
      active: "#ddd",
      hover: "#ddd",
      hoverOpacity: 0.2,
    },
    divider: "#b3b1b1",
  },
});

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#2188a3",
      light: "#ddd",
      contrastText: "#ffffff",
    }
  },
});

export const returnTheme = (themeMode: string) => {
  if (themeMode === "dark")
    return darkTheme;
  else
    return lightTheme;
}