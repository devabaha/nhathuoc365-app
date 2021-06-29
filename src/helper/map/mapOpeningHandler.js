import {Linking} from 'react-native';

const APPLE_MAPS_SCHEME = 'maps://';
const APPLE_MAPS_LINKING_URL = 'https://maps.apple.com/?dirflg=d&daddr=';

const GOOGLE_MAPS_SCHEME = 'comgooglemaps://';
const GOOGLE_MAPS_LINKING_URL =
  'https://www.google.com/maps/dir/?api=1&travelmode=bike&destination=';

const openAppleMap = (lat, lng) => {
  const ll = `${lat},${lng}`;
  const url = APPLE_MAPS_LINKING_URL + ll;
  Linking.openURL(url).catch((err) => {
    console.log('%cerr_open_apple_maps_app', 'color:red', err);
  });
};

const openGoogleMap = (lat, lng) => {
  const ll = `${lat},${lng}`;
  const url = GOOGLE_MAPS_LINKING_URL + ll;
  Linking.openURL(url).catch((err) => {
    console.log('%cerr_open_google_maps_app', 'color:red', err);
  });
};

const openMap = (lat, lng) => {
  // check if device installed google maps app.
  Linking.canOpenURL(GOOGLE_MAPS_SCHEME)
    .then((res) => {
      if (res) {
        // open google maps app
        openGoogleMap(lat, lng);
      } else {
        // check if device installed apple maps app.
        Linking.canOpenURL(APPLE_MAPS_SCHEME)
          .then((res) => {
            if (res) {
              // open apple maps app
              openAppleMap(lat, lng);
            } else {
              // open google maps web
              openGoogleMap(lat, lng);
            }
          })
          .catch((err) => {
            console.log('%cerr_CAN_open_apple_maps_app', 'color:red', err);
          });
      }
    })
    .catch((err) => {
      console.log('%cerr_CAN_open_google_maps_app', 'color:red', err);
    });
};

export {openMap};
