import BackgroundGeolocation from 'react-native-background-geolocation';
import {scheduleNotificatonOnDistanceLess500} from './pushNotificationService';
import {Platform} from 'react-native';

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c * 1000; // Convert distance to meters
  return distance;
};

const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const startLocationUpdates = async () => {
  const config = async () => {
    try {
      const state = await BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        stopTimeout: 5,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        foregroundService: true, //Set true to make the pg
        debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true, // <-- Auto start tracking when device is powered-up.
        reset: true,
        enableHeadless: true,
        forceReloadOnBoot: false, //Force launch your terminated App after a device reboot or application update.
        heartbeatInterval: 60,
      });
      BackgroundGeolocation.start();
      console.log('- BackgroundGeolocation is ready: ', state);

      if (Platform.OS === 'ios') {
        BackgroundGeolocation.on('location', (location: any) => {
          console.log(
            '[ERROR] BackgroundGeolocation ',
            JSON.stringify(location),
          );
          scheduleNotificatonOnDistanceLess500(location);
        });
      } else {
        BackgroundGeolocation.watchPosition(
          async location => {
            console.log('[watchPosition] -', location);
            await scheduleNotificatonOnDistanceLess500(location);
          },
          errorCode => {
            console.log('[watchPosition] ERROR -', errorCode);
          },
          {
            interval: 1000,
          },
        );
      }
    } catch (e) {
      console.warn('- BackgroundGeolocation error: ', e);
    }
  };

  config();
};
