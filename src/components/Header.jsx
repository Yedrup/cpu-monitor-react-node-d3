import React, { useContext } from 'react';
import { ThemeContext } from '../data/context/ThemeContext';
import {
  Typography,
  makeStyles,
  Switch,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import * as LABELS from '../data/labels.json';

function Header() {
  const { currentThemeName, setCurrentThemeName } = useContext(ThemeContext);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      height: '3rem',
      justifyContent: 'center',
      color: theme.palette.primary.lighter,
    },
    title: {
      flexGrow: 1,
      fontSize: '1.5rem',
    },
  }));

  const handleChange = (event) => {
    if (event.target.checked) {
      setCurrentThemeName('darkTheme');
    } else {
      setCurrentThemeName('lightTheme');
    }
  };

  const classes = useStyles();
  return (
    <AppBar position="sticky" className={classes.root}>
      <Toolbar>
        <Typography className={classes.title}>{LABELS.header.title}</Typography>
        <Switch
          checked={currentThemeName === 'darkTheme'}
          onChange={handleChange}
          name="switchTheme"
          inputProps={{ 'aria-label': 'checkbox' }}
        />
        <Typography component="span">{LABELS.header.darkTheme}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
