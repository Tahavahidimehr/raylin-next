import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    direction: "rtl",
    palette: {
        primary: {
            main: '#D85FA1'
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;