import {
    createMuiTheme
} from '@material-ui/core/styles';
import {
    blue,
    green,
    grey,
    red,
    cyan,
    purple
} from '@material-ui/core/colors';


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
    },
    overline: {
        fontSize: "3rem",
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

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            lighter: cyan[50],
            light: cyan[100],
            main: cyan[200],
            dark: cyan[300],
            darker: cyan[400],
            contrastText: cyan[50]
        },
        secondary: {
            lighter: purple[50],
            light: purple[100],
            main: purple[200],
            dark: purple[300],
            darker: purple[400],
            contrastText: purple[50]
        },
        error: {
            lighter: red[50],
            light: red[200],
            main: red[300],
            dark: red[400],
            darker: red[500],
            contrastText: "#FAFAFA"
        },
        tile: {
            backgroundColor: "#121212"
        },
        icons: {
            highLoad: red[400],
            recovery: green[400],
            default: grey[200],
            flat: blue[400]
        }
    },
    typography: {
        ...typography,
        h1: {
            ...HEADERS.h1,
            color: cyan[50]
        },
        h2: {
            ...HEADERS.h2,
            color: cyan[300]
        },
        h3: {
            ...HEADERS.h3,
            color: cyan[300]
        },
        h4: {
            ...HEADERS.h4,
            color: cyan[300]
        },
        h5: {
            ...HEADERS.h5,
            color: cyan[300]
        },
        h6: {
            ...HEADERS.h6,
            color: cyan[300]
        },
        overline: {
            ...HEADERS.overline,
            color: cyan[400]
        }
    },
    overrides: {
        MuiButton: {
            text: {
                background: `linear-gradient(45deg, ${purple[600]} 30%, ${purple[900]}  90%)`,
                borderRadius: 3,
                border: 0,
                color: 'white',
                height: 48,
                padding: '0 30px',
                boxShadow: `0 2px 2px 1px ${purple[900]} `,
            },
        },
        MuiAppBar: {
            root: {
                background: `linear-gradient(45deg, ${cyan[600]} 30%, ${cyan[700]}  90%)`,
                color: "white",
                fontSize: "1.4rem"
            }
        },
        MuiSwitch: {
            track: {
                backgroundColor: `${grey[700]}!important`,
                opacity: `.9!important`
            },
            thumb: {
                color: grey[900]
            }
        },


    },
});

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        background: {
            default: purple[50]
        },
        primary: {
            lighter: purple[50],
            light: purple[200],
            main: purple[500],
            dark: purple[700],
            darker: purple[900],
            contrastText: purple[900]
        },
        secondary: {
            lighter: cyan[50],
            light: cyan[100],
            main: cyan[500],
            dark: cyan[700],
            darker: cyan[900],
            contrastText: cyan[900]
        },
        error: {
            lighter: red[50],
            light: red[100],
            main: red[500],
            dark: red[700],
            darker: red[900],
            contrastText: red[900]
        },
        tile: {
            backgroundColor: "#FAFAFA"
        },
        icons: {
            highLoad: red[700],
            recovery: green[700],
            default: grey[700],
            flat: blue[700]
        }
    },
    typography: {
        ...typography,
        h1: {
            ...HEADERS.h1,
            color: purple[700]
        },
        h2: {
            ...HEADERS.h2,
            color: purple[700]
        },
        h3: {
            ...HEADERS.h3,
            color: purple[700]
        },
        h4: {
            ...HEADERS.h4,
            color: purple[700]
        },
        h5: {
            ...HEADERS.h5,
            color: purple[700]
        },
        h6: {
            ...HEADERS.h6,
            color: purple[700]
        },
        overline: {
            ...HEADERS.overline,
            color: purple[700]
        }
    },
    overrides: {
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
        MuiAppBar: {
            root: {
                background: `linear-gradient(45deg, ${purple[600]} 30%, ${purple[900]}  90%)`,
                color: "white",
                fontSize: "1.4rem"
            }
        },
        MuiSwitch: {
            track: {
                backgroundColor: `${purple[50]}!important`,
                opacity: .6,
            },
            thumb: {
                color: purple[50],

            }
        },
    }
});

const themes = {
    darkTheme,
    lightTheme
};

export default themes;