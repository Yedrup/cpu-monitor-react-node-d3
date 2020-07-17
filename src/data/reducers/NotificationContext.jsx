import React, { useReducer, createContext } from 'react';
import Notification from '../../utilities/classes/Notification';

export const NotificationContext = createContext();

export const initialNotificationState = {
  isNotificationPending: false,
  newNotification: null,
  notificationsHistory: [],
};

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_NEW_NOTIFICATION':
      console.log('CREATE_NEW_NOTIFICATION');
      let formattedNotification = new Notification(
        action.payload.type,
        action.payload.trace
      );
      return {
        ...state,
        isNotificationPending: true,
        newNotification: formattedNotification,
        notificationsHistory: [
          formattedNotification,
          ...state.notificationsHistory,
        ],
      };
    case 'CLEAR_NOTIFICATION_AFTER_DISPLAY':
      console.log('CLEAR_NOTIFICATION_AFTER_DISPLAY');
      return {
        ...state,
        isNotificationPending: false,
        newNotification: null,
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [stateNotification, dispatchNotification] = useReducer(
    notificationReducer,
    initialNotificationState
  );
  return (
    <NotificationContext.Provider
      value={{ dispatchNotification, stateNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
