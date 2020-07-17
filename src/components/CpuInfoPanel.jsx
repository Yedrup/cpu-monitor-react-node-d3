import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
} from '@material-ui/core';
import { ExpandMore, Memory } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { callApi } from '../utilities/utilities';

import * as LABELS from '../data/labels.json';

function CpuInfo() {
  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 20,
    },
    expand: {
      transform: 'rotate(0deg)',
      margin: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }));

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [cpuInfo, setCpuInfo] = useState({
    cpusCount: null,
    cpusList: [],
  });
  useEffect(() => {
    callApi('api/cpu/info').then((info) => setCpuInfo(info));
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {LABELS.infoCPU.title}
        </Typography>
        <Typography color="primary">
          {LABELS.infoCPU.cpuCount}: {cpuInfo.cpusCount}
        </Typography>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label={LABELS.common.expandLabel}
          >
            <ExpandMore />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List>
            {cpuInfo.cpusList.map((cpu, index) => {
              const { model, speed } = cpu;
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Memory color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h4">
                        {LABELS.infoCPU.cpuTitle} {index + 1}
                      </Typography>
                    }
                    secondaryTypographyProps={{
                      component: 'div',
                    }}
                    secondary={
                      <Box>
                        <Typography component="p">
                          {LABELS.infoCPU.model}: {model}
                        </Typography>
                        <Typography component="p">
                          {LABELS.infoCPU.speed}: {speed}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default CpuInfo;
