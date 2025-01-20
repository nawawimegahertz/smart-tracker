import { grey, orange } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? grey[900] : grey[50],
    // default: grey[900],
    // Untuk search bar
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? orange[200] : orange[900]),
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? orange[100] : orange[700]),
  },
  neutral: {
    main: grey[500],
  },
  geometry: {
    main: '#ff9800', // Oranye terang untuk elemen geometris.
  },
});