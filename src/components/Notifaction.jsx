import React, { useState, useEffect, memo } from 'react';
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';


function WrappedNotification(props) {
    let { stateNotification, dispatchNotification } = props;
    const [isSnackOpen, setIsSnackOpen] = useState(false);

    const Alert = props => {
        return <MuiAlert
            elevation={6}
            variant="filled"
            {...props} />;
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsSnackOpen(false);
        dispatchNotification({ type: 'CLEAR_NOTIFICATION_AFTER_DISPLAY' })
    };
    useEffect(() => {
        if (stateNotification.isNotificationPending ) {
            setIsSnackOpen(true);
        }
    }, [stateNotification ])

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isSnackOpen}
            autoHideDuration={stateNotification?.newNotification?.duration}
            onClose={handleClose}
        >
            <Alert
                role="Alert"
                onClose={handleClose}
                severity={stateNotification?.newNotification?.display?.severity}>
                <AlertTitle>{stateNotification?.newNotification?.display?.message}</AlertTitle>
            </Alert>
        </Snackbar>
    )
}

function compareStateNotification(prevProps, nextProps) {
    let isAPendingNotif = (nextProps.stateNotification.isNotificationPending === true) && (nextProps.stateNotification.newNotification !== null);
    let isStateTheSame =  !isAPendingNotif
    return isStateTheSame;
}
export const Notification = memo(WrappedNotification, compareStateNotification);
export default Notification;


/*
 TO DO : check update material ui  to solve the error thrown by React'StrictMode : "Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode."
*/