import {Linking} from 'react-native';

const ORIGIN_KEY = '#ORIGIN';
const DESTINATION_KEY = '#DESTINATION';

const APPLE_MAPS_SCHEME = 'maps://';
const APPLE_MAPS_LINKING_URL = 'https://maps.apple.com/?dirflg=d&daddr=';
const APPLE_MAPS_LINKING_WITH_ORIGIN_URL = `https://maps.apple.com/?dirflg=d&saddr=${ORIGIN_KEY}&daddr=${DESTINATION_KEY}`;

const GOOGLE_MAPS_SCHEME = 'comgooglemaps://';
const GOOGLE_MAPS_LINKING_URL =
  'https://www.google.com/maps/dir/?api=1&travelmode=bike&destination=';
const GOOGLE_MAPS_LINKING_WITH_ORIGIN_URL = `https://www.google.com/maps/dir/?api=1&travelmode=bike&origin=${ORIGIN_KEY}&destination=${DESTINATION_KEY}`;

const openAppleMap = (lat, lng, dLat, dLng) => {
  let ll = `${lat},${lng}`;
  let url = APPLE_MAPS_LINKING_URL + ll;
  if (dLat !== undefined && dLng !== undefined) {
    let dll = `${dLat},${dLng}`;
    url = APPLE_MAPS_LINKING_WITH_ORIGIN_URL.replace(ORIGIN_KEY, ll).replace(
      DESTINATION_KEY,
      dll,
    );
  }

  Linking.openURL(url).catch((err) => {
    console.log('%cerr_open_apple_maps_app', 'color:red', err);
  });
};

const openGoogleMap = (lat, lng, dLat, dLng) => {
  let ll = `${lat},${lng}`;
  let url = GOOGLE_MAPS_LINKING_URL + ll;
  if (dLat !== undefined && dLng !== undefined) {
    let dll = `${dLat},${dLng}`;
    url = GOOGLE_MAPS_LINKING_WITH_ORIGIN_URL.replace(ORIGIN_KEY, ll).replace(
      DESTINATION_KEY,
      dll,
    );
  }

  Linking.openURL(url).catch((err) => {
    console.log('%cerr_open_google_maps_app', 'color:red', err);
  });
};

const openMap = (lat, lng, dLat, dLng) => {
  // check if device installed google maps app.
  Linking.canOpenURL(GOOGLE_MAPS_SCHEME)
    .then((res) => {
      if (res) {
        // open google maps app
        openGoogleMap(lat, lng, dLat, dLng);
      } else {
        // check if device installed apple maps app.
        Linking.canOpenURL(APPLE_MAPS_SCHEME)
          .then((res) => {
            if (res) {
              // open apple maps app
              openAppleMap(lat, lng, dLat, dLng);
            } else {
              // open google maps web
              openGoogleMap(lat, lng, dLat, dLng);
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
