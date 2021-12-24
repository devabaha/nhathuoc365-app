import {AppState} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import EventEmitter from 'eventemitter3';

import {
  LocationPermission,
  LOCATION_PERMISSION_TYPE,
  REQUEST_RESULT_TYPE,
} from 'app-helper/permissionHelper';

const gpsTrackingListener = new EventEmitter();

const GPS_TRACKING_EVENT_NAME = 'gps_tracking';

class LocationTracker {
  listener = null;
  geolocationWatchId = 0;
  appState = 'active';
  isPermissionGranted = false;

  gpsConfig = {
    // timeout for getting GPS (ms)
    timeout: 5000,
    // enable high accuracy of getting GPS
    enableHighAccuracy: false,
    // distance to update GPS (m)
    distanceFilter: 5,
  };

  constructor(gpsConfig = this.gpsConfig) {
    this.gpsConfig = {...this.gpsConfig, ...gpsConfig};
  }

  getListener() {
    return this.listener;
  }

  watchLocation = async (isPermissionGranted = this.isPermissionGranted) => {
    this.isPermissionGranted = isPermissionGranted;

    if (this.isPermissionGranted !== REQUEST_RESULT_TYPE.GRANTED) {
      this.isPermissionGranted = await LocationPermission.callPermission(
        LOCATION_PERMISSION_TYPE.CHECK,
      );
    }

    if (this.isPermissionGranted !== REQUEST_RESULT_TYPE.GRANTED) {
      return;
    }

    Geolocation.clearWatch(this.geolocationWatchId);
    Geolocation.getCurrentPosition(
      (currentPosition) => {
        this.updateLocation(currentPosition);

        this.geolocationWatchId = Geolocation.watchPosition(
          (position) => this.updateLocation(position),
          (error) => {
            console.log(
              'location_watch_location',
              this.geolocationWatchId,
              error,
            );
            gpsTrackingListener.emit(GPS_TRACKING_EVENT_NAME, {
              error: true,
              ...(error || {}),
            });
          },
          this.gpsConfig,
        );
      },
      (error) => {
        console.log('location_get_current_location', error);
        gpsTrackingListener.emit(GPS_TRACKING_EVENT_NAME, {
          error: true,
          ...(error || {}),
        });
      },
    );
  };

  updateLocation = (position) => {
    gpsTrackingListener.emit(GPS_TRACKING_EVENT_NAME, position);
  };

  addListener(listener, isPermissionGranted) {
    console.log('location_tracker_add_listener');
    this.listener = listener;
    gpsTrackingListener.addListener(GPS_TRACKING_EVENT_NAME, listener);
    AppState.addEventListener('change', this.handleAppStateChange);
    this.watchLocation(isPermissionGranted);
  }

  removeListener() {
    console.log('location_tracker_remove_listener');
    Geolocation.clearWatch(this.geolocationWatchId);
    gpsTrackingListener.removeListener(GPS_TRACKING_EVENT_NAME, this.listener);
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.listener = null;
  }

  handleAppStateChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log(
        'appState',
        this.isPermissionGranted !== REQUEST_RESULT_TYPE.GRANTED,
        this.geolocationWatchId,
      );
      if (
        this.isPermissionGranted !== REQUEST_RESULT_TYPE.GRANTED &&
        !this.geolocationWatchId
      ) {
        this.watchLocation();
      }
    }
    this.appState = nextAppState;
  };
}

export default LocationTracker;
