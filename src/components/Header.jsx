import React, { useContext, Fragment } from 'react'
import { RequestStatusContext } from '../data/context/RequestStatusContext';
import { ThemeContext } from '../data/context/ThemeContext';
import { Typography, makeStyles, Switch, AppBar, Toolbar, Button, IconButton } from "@material-ui/core";

function Header() {
    const { isRequesting, setIsRequesting } = useContext(RequestStatusContext);
    const { currentThemeName, setCurrentThemeName } = useContext(ThemeContext);

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1
        },
        title: {
            flexGrow: 1,
            fontSize: "2rem"
        },
    }));

    const handleChange = (event) => {
        if (event.target.checked) {
            setCurrentThemeName("darkTheme")
        } else {
            setCurrentThemeName("lightTheme")
        }
    };

    const classes = useStyles();
    return (
        <AppBar position="sticky" className={classes.root}>
            <Toolbar >
                <Typography className={classes.title}>
                    CPU Monitor
          </Typography>
                <Switch
                    checked={currentThemeName === "darkTheme"}
                    onChange={handleChange}
                    name="switchTheme"
                    inputProps={{ 'aria-label': 'checkbox' }}
                /> 
                <Typography component="span">Dark Theme</Typography>
            </Toolbar>
        </AppBar>
    )
}


export default Header
