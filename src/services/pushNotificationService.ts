import {Alert} from 'react-native';
import {calculateDistance} from './locationService';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

const latitude = 37.7400931875;
const longtitude = -122.434370098;
let prevDistance = 0;

console.log(prevDistance, 'prevDistance');

async function requestUserPermission() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Permission settings:', settings);
  } else {
    console.log('User declined permissions');
  }
}

export const scheduleLocalNotification = async () => {
  console.log('Schedule local notification');
  try {
    await requestUserPermission();
    const channelId = await notifee.createChannel({
      id: 'default 4',
      name: 'Default Channel',
      sound: 'hollow',
      importance: AndroidImportance.HIGH,
    });
    // Display a notification
    await notifee.displayNotification({
      title: 'Local Notification',
      body: 'point has been reached',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
  } catch (error) {
    console.log('!!!!!!', error);
  }
};

export const scheduleNotificatonOnDistanceLess500 = async (location: any) => {
  if (!location || !location.coords) {
    return;
  }
  const distance = calculateDistance(
    latitude,
    longtitude,
    location.coords.latitude,
    location.coords.longitude,
  );
  console.log(distance, prevDistance, 'distance, prevDistance');
  if (distance < 500 && prevDistance > 500) {
    try {
      await scheduleLocalNotification();
    } catch (error) {
      console.log('Error', error);
    }
    console.log('Distance smaller than 500', distance);
  }

  prevDistance = distance;
  console.log('Received background location updates:', location);
};

export const dondKillAppService = async () => {
  const batteryOptimizationEnabled =
    await notifee.isBatteryOptimizationEnabled();
  if (batteryOptimizationEnabled) {
    // 2. ask your users to disable the feature
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please disable battery optimization for the app.',
      [
        // 3. launch intent to navigate the user to the appropriate screen
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openBatteryOptimizationSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  const powerManagerInfo = await notifee.getPowerManagerInfo();
  if (powerManagerInfo.activity) {
    // 2. ask your users to adjust their settings
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
      [
        // 3. launch intent to navigate the user to the appropriate screen
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openPowerManagerSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
};
