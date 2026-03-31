import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00c2a8"
    },
    secondary: {
      main: "#ff8f3f"
    },
    background: {
      default: "#0a1218",
      paper: "#111f2a"
    },
    text: {
      primary: "#ecf7ff",
      secondary: "#9db1be"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h2: {
      fontFamily: '"Space Grotesk", "Manrope", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.015em"
    },
    h3: {
      fontFamily: '"Space Grotesk", "Manrope", sans-serif',
      fontWeight: 700
    },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 14px 36px rgba(0, 0, 0, 0.35)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    }
  }
});

export default theme;
