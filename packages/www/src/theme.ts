"use client";

import { createTheme } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const theme = createTheme({
  typography: {
    fontFamily: "var(--fo]nt-noto-sans-jp)",
  },
  palette: {
    primary: deepOrange,
  },
  components: {
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
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
    },
  },
  shape: {
    borderRadius: 2,
  },
});

export { theme };
