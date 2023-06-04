/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';

import BackgroundGeolocation from './src/react-native-background-geolocation';
import {scheduleNotificatonOnDistanceLess500} from './src/services/pushNotificationService';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // // Update external API
    // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
    //   method: 'POST',
    // });
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);

/**
 * BackgroundGeolocation Headless JS task.
 * For more information, see:  https://github.com/transistorsoft/react-native-background-geolocation/wiki/Android-Headless-Mode
 */
const BackgroundGeolocationHeadlessTask = async event => {
  let params = event.params;
  console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);

  switch (event.name) {
    case 'heartbeat':
      const location = await BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        persist: false,
      });
      console.log(
        '[BackgroundGeolocation HeadlessTask] - getCurrentPosition:',
        location,
      );

      break;
    case 'location':
      scheduleNotificatonOnDistanceLess500(params);

      break;
    case 'authorization':
      BackgroundGeolocation.setConfig({
        url: ENV.TRACKER_HOST + '/api/locations',
      });
      break;
  }
};

BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);
