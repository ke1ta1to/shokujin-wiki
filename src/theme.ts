"use client";

import { createTheme } from "@mui/material";
import { deepOrange, grey } from "@mui/material/colors";

export const theme = createTheme({
  typography: {
    fontFamily: "var(--font-noto-sans-jp)",
  },
  palette: {
    primary: deepOrange,
    secondary: grey,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
  },
  shape: {
    borderRadius: 2,
  },
});
