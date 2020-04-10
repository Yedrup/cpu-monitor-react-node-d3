import {
    createMuiTheme
} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import cyan from '@material-ui/core/colors/cyan';
import red from '@material-ui/core/colors/red';


const typography = createMuiTheme({
    fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    h1: {
        fontSize: "2.5rem",
    }
})

export const darkThemeObj = {
    palette: {
        type: 'dark',
        primary: {
            light: purple[200],
            main: purple[500],
            dark: purple[900],
            contrastText: "#FFF"

        },
        secondary: {
            light: cyan[200],
            main: cyan[500],
            dark: cyan[700],
            contrastText: "#FFF"
        },
        error: {
            light: red[200],
            main: red[500],
            dark: red[700],
            contrastText: "#FFF"
        }
    },
    typography: {
        ...typography
    }
};

export const lightThemeObj = {
    palette: {
        type: 'light',
        primary: {
            light: purple[200],
            main: purple[500],
            dark: purple[900],
            contrastText: "#FFF"

        },
        secondary: {
            light: cyan[200],
            main: cyan[500],
            dark: cyan[700],
            contrastText: "#FFF"
        },
        error: {
            light: red[200],
            main: red[500],
            dark: red[700],
            contrastText: "#FFF"
        }
    },
    typography: {
        ...typography
    }
};

export default darkThemeObj;