import React, { useContext, useState, useRef, useEffect } from 'react';
import { NotificationContext } from "../data/reducers/NotificationContext";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

function Notification() { 
    const isInitialMount = useRef(true);
    const { stateNotification, dispatchNotification } = useContext(NotificationContext)
    const [isSnackOpen, setIsSnackOpen] = useState(false)
    const Alert = props => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsSnackOpen(false);
        dispatchNotification({ type: 'CLEAR_NOTIFICATION_AFTER_DISPLAY' })
    };
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (stateNotification.isNotificationPending) {
                setIsSnackOpen(true);
            }
        }
        return () => null
    }, [stateNotification.isNotificationPending])
    
    return (
        <Snackbar
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isSnackOpen}
        autoHideDuration={stateNotification?.newNotification?.duration}
        onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={stateNotification?.newNotification?.display?.color}>
                {stateNotification?.newNotification?.display?.message}
            </Alert>
        </Snackbar>
    )
}

export default Notification;


/*
 TO DO : check update material ui  to solve the error thrown by React'StrictMode : "Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode."
*/