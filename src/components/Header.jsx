import React, { useContext } from 'react'
import { RequestStatusContext } from '../data/context/RequestStatusContext';
import { ThemeContext } from '../data/context/ThemeContext';
import { Typography, makeStyles, Switch } from "@material-ui/core";

// TODO: use mui app toolbar
function Header() {
    const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
    const { isDarkTheme, setIsDarkTheme } = useContext(ThemeContext);

    const useStyles = makeStyles(theme => ({
        title: {
            background: "white",
            color: theme.palette.secondary.dark,
            padding: "1rem",
            marginBottom: "2rem"
        }
    }));

    const classes = useStyles();
    return (
        <header className={classes.title}>
            <Typography variant="h2" >CPU MONITOR</Typography>
            status request : {isRequesting ? "📫" : "📪"}
            
            Dark theme:
            <Switch
                checked={isDarkTheme}
                onChange={() => setIsDarkTheme(!isDarkTheme)}
                name="switchTheme"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
        </header>
    )
}


export default Header
