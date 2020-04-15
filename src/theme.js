import {
    createMuiTheme
} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import cyan from '@material-ui/core/colors/cyan';
import red from '@material-ui/core/colors/red';


const HEADERS = {
    h1: {
        fontSize: "1.5rem",
        fontWeight: "bold",
    },
    h2: {
        fontSize: "1.4rem",
        fontWeight: "bold",
    },
    h3: {
        fontSize: "1.3rem",
        fontWeight: "bold",
    },
    h4: {
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    h5: {
        fontSize: "1.1rem",
        fontWeight: "bold",
    },
    h6: {
        fontSize: "1rem",
        fontWeight: "bold",
    }
}

const FONTS = [
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
]


const typography = createMuiTheme({
    fontFamily: [...FONTS].join(','),
    ...HEADERS
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
        ...typography,
        h1: {
            ...HEADERS.h1,
            color: cyan[600]
        },
        h2: {
            ...HEADERS.h2,
            color: cyan[600]
        },
        h3: {
            ...HEADERS.h3,
            color: cyan[600]
        },
        h4: {
            ...HEADERS.h4,
            color: cyan[600]
        },
        h5: {
            ...HEADERS.h5,
            color: cyan[600]
        },
        h6: {
            ...HEADERS.h6,
            color: cyan[600]
        }
    },
    overrides: {
        // Style sheet name ⚛️
        MuiButton: {
            // Name of the rule
            text: {
                // Some CSS
                background: `linear-gradient(45deg, ${purple[600]} 30%, ${purple[900]}  90%)`,
                borderRadius: 3,
                border: 0,
                color: 'white',
                height: 48,
                padding: '0 30px',
                boxShadow: `0 2px 2px 1px ${purple[900]} `,
            },
        },
    },
}

export const lightThemeObj = {
    palette: {
        type: 'light',
        background: {
            default: purple[50]
        },
        primary: {
            light: purple[50],
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
        ...typography,
        h1: {
            ...HEADERS.h1,
            color: purple[600]
        },
        h2: {
            ...HEADERS.h2,
            color: purple[600]
        },
        h3: {
            ...HEADERS.h3,
            color: purple[600]
        },
        h4: {
            ...HEADERS.h4,
            color: purple[600]
        },
        h5: {
            ...HEADERS.h5,
            color: purple[600]
        },
        h6: {
            ...HEADERS.h6,
            color: purple[600]
        }
    },
    overrides: { //test override
        MuiButton: {
            text: {
                background: `linear-gradient(45deg, ${cyan[500]} 30%, ${cyan[900]}  90%)`,
                borderRadius: 3,
                border: 0,
                color: 'white',
                height: 48,
                padding: '0 30px',
                boxShadow: `0 2px 2px 1px ${cyan[900]} `,
            },
        },
    },

};

export default darkThemeObj;