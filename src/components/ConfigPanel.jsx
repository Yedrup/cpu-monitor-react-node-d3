import React, { memo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  withStyles,
  List,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as LABELS from '../data/labels.json';

function WrappedConfigPanel(props) {
  let { stateConfig } = props;
  const useStyles = makeStyles((theme) => ({
    item: {
      marginBottom: 20,
    },
    label: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  }));
  const CardHeaderCustom = withStyles((theme) => ({
    root: {
      textAlign: 'left',
      height: '4.5rem',
      paddingBottom: 0,
      alignItems: 'baseline',
      justifyContent: 'baseline',
      [theme.breakpoints.down('sm')]: {
        height: '5.5rem',
      },
    },
    title: {
      color: theme.palette.primary.contrastText,
      fontSize: '1rem',
      alignItems: 'flex-start',
      display: 'flex',
    },
    subheader: {
      color: theme.palette.grey,
    },
  }))(CardHeader);

  const CardContentCustom = withStyles((theme) => ({
    root: {
      flex: 1,
      paddingTop: 0,
      display: 'flex',
      textAlign: 'left',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  }))(CardContent);

  const classes = useStyles();

  return (
    <Card>
      <CardHeaderCustom title="Configuration" />
      <CardContentCustom>
        <List>
          {Object.entries(stateConfig).map((conf, index) => {
            let isAFunc = typeof conf[1] === 'function';
            return isAFunc ? null : (
              <ListItemText className={classes.item} key={index}>
                <span>{LABELS.configuration[conf[0]]}: </span>
                <span className={classes.label}>{conf[1]}</span>
              </ListItemText>
            );
          })}
        </List>
      </CardContentCustom>
    </Card>
  );
}

function compareState(prevProps, nextProps) {
  return prevProps.stateConfig === nextProps.stateConfig;
}
export const ConfigPanel = memo(WrappedConfigPanel, compareState);
export default ConfigPanel;
