import {grey, teal, orange} from '@mui/material/colors';

const getDesignTokens = mode => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: teal[500],
          },
          secondary: {
            main: orange[500],
          },
          divider: teal[200],
          background: {
            default: '#ffffff',
            paper: '#f5f5f5',
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          primary: {
            main: grey[300],
          },
          secondary: {
            main: teal[300],
          },
          divider: grey[500],
          background: {
            default: '#000000',
            paper: grey[900],
          },
          text: {
            primary: grey[100],
            secondary: grey[300],
          },
        }),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
  },
});
export default getDesignTokens;
