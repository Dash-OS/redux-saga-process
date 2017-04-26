import Process from 'redux-saga-process'
import { put } from 'redux-saga/effects'

const DEFAULT_NOTIFICATION = {
  title:       'Attention!',
  message:     '',
  level:       'info',
  autoDismiss: 15,
  position:    'br',
}

/*
  Accepts the redux action NOTIFICATION and creates the notification.
*/
export default class NotificationsProcess extends Process {
  
  // Our action can be imported with 'notifications' as the key
  static config = { pid: 'notifications' };
  
  static exports = [ 'actions' ];
  
  static actionRoutes = {
    notificationRef: 'ref',
    notification:    'notification'
  };
  
  static actions = {
    notification: null
  };
  
  // Save the ref when it is updated
  * ref({ ref }) { this.notifier = ref }

  // Dispatch a message if we have the ref to do so
  * notification(message) {
    if ( this.notifier ) {
      this.notifier.addNotification({
        ...DEFAULT_NOTIFICATION,
        ...message
      })
    }
  }

}