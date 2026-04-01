import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#14d6b6",
      light: "#59f5d6",
      dark: "#07a58c"
    },
    secondary: {
      main: "#ff9f52",
      light: "#ffc08f",
      dark: "#d6762d"
    },
    background: {
      default: "#081018",
      paper: "#0f1d29"
    },
    text: {
      primary: "#ecf7ff",
      secondary: "#9db1be"
    },
    divider: "rgba(173, 229, 255, 0.14)"
  },
  shadows: [
    "none",
    "0 2px 6px rgba(0,0,0,0.25)",
    "0 3px 10px rgba(0,0,0,0.28)",
    "0 4px 14px rgba(0,0,0,0.30)",
    "0 6px 20px rgba(0,0,0,0.33)",
    "0 8px 26px rgba(0,0,0,0.36)",
    "0 10px 30px rgba(0,0,0,0.38)",
    "0 12px 34px rgba(0,0,0,0.40)",
    "0 14px 38px rgba(0,0,0,0.42)",
    "0 16px 42px rgba(0,0,0,0.44)",
    "0 18px 46px rgba(0,0,0,0.46)",
    "0 20px 50px rgba(0,0,0,0.48)",
    "0 22px 54px rgba(0,0,0,0.50)",
    "0 24px 58px rgba(0,0,0,0.52)",
    "0 26px 62px rgba(0,0,0,0.54)",
    "0 28px 66px rgba(0,0,0,0.56)",
    "0 30px 70px rgba(0,0,0,0.58)",
    "0 32px 74px rgba(0,0,0,0.60)",
    "0 34px 78px rgba(0,0,0,0.62)",
    "0 36px 82px rgba(0,0,0,0.64)",
    "0 38px 86px rgba(0,0,0,0.66)",
    "0 40px 90px rgba(0,0,0,0.68)",
    "0 42px 94px rgba(0,0,0,0.70)",
    "0 44px 98px rgba(0,0,0,0.72)",
    "0 46px 102px rgba(0,0,0,0.74)"
  ],
  transitions: {
    duration: {
      enteringScreen: 280,
      leavingScreen: 220
    }
  },
  shape: {
    borderRadius: 18
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
    h5: {
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
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)), radial-gradient(circle at 0% 0%, rgba(20,214,182,0.12), transparent 40%)",
          border: "1px solid rgba(173, 229, 255, 0.12)",
          boxShadow: "0 18px 44px rgba(0, 0, 0, 0.42)",
          backdropFilter: "blur(6px)",
          transition: "transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgba(20,214,182,0.45)",
            boxShadow: "0 24px 52px rgba(0, 0, 0, 0.5)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          letterSpacing: "0.01em"
        },
        containedPrimary: {
          backgroundImage: "linear-gradient(135deg, #0db39a, #16d6b6)",
          boxShadow: "0 10px 24px rgba(20,214,182,0.3)",
          "&:hover": {
            backgroundImage: "linear-gradient(135deg, #09a88f, #11c8aa)",
            boxShadow: "0 12px 28px rgba(20,214,182,0.38)"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(10, 22, 31, 0.7)",
            borderRadius: 12,
            "& fieldset": {
              borderColor: "rgba(173, 229, 255, 0.14)"
            },
            "&:hover fieldset": {
              borderColor: "rgba(173, 229, 255, 0.28)"
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          backdropFilter: "blur(4px)"
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg"
      }
    }
  }
});

export default theme;
