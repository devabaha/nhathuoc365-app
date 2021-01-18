import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  AppState,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import Button from 'react-native-button';
import {getPreciseDistance} from 'geolib';
import Ionicons from 'react-native-vector-icons/Ionicons';

import appConfig from 'app-config';

import ScreenWrapper from '../../components/ScreenWrapper';
import Modal from '../../components/account/Transfer/Payment/Modal';
import {
  LocationPermission,
  LOCATION_PERMISSION_TYPE,
  REQUEST_LOCATION_RESULT_TYPE,
} from '../../helper/permissionHelper';
import Loading from '../../components/Loading';
import {APIRequest} from '../../network/Entity';
import Container from '../../components/Layout/Container';

const APPLE_MAPS_SCHEME = 'maps://';
const APPLE_MAPS_LINKING_URL = 'https://maps.apple.com/?dirflg=d&daddr=';

const GOOGLE_MAPS_SCHEME = 'comgooglemaps://';
const GOOGLE_MAPS_LINKING_URL =
  'https://www.google.com/maps/dir/?api=1&travelmode=bike&destination=';

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  storeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
  description: {
    color: '#666',
    marginTop: 3,
  },
  mapInfoContainer: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  distanceContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderColor: '#ccc',
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.05),
  },
  disabledDistance: {
    backgroundColor: '#f5f5f5',
    color: '#aaa',
  },
  distanceLoadingContainer: {
    position: 'relative',
    top: undefined,
    left: undefined,
  },
  distanceLoading: {
    padding: 0,
    width: 11,
    height: 11,
  },
  distanceIcon: {
    fontSize: 11,
    color: appConfig.colors.primary,
  },
  distanceTxt: {
    marginLeft: 7,
    fontSize: 11,
    color: appConfig.colors.primary,
  },
  distanceUnitTxt: {
    fontSize: 9,
  },
  openMapWrapper: {
    overflow: 'hidden',
    borderRadius: 15,
    marginLeft: 15,
  },
  openMapContainer: {
    backgroundColor: appConfig.colors.primary,
  },
  openMapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  mapIcon: {
    fontSize: 11,
    marginRight: 7,
    color: '#fff',
  },
  openMapTxt: {
    fontSize: 11,
    color: '#fff',
  },
});

const GPSListStore = () => {
  const getListStoreRequest = new APIRequest();
  const requests = [getListStoreRequest];
  let appState = 'active';
  let watchID = '';

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isGoToSetting, setGotoSetting] = useState(false);
  const [requestLocationLoading, setRequestLocationLoading] = useState(true);
  const [isConnectGPS, setConnectGPS] = useState(false);
  const [requestLocationErrorCode, setRequestLocationErrorCode] = useState(0);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [listStore, setListStore] = useState([]);

  const title = 'Không truy cập được Vị trí';
  const content =
    requestLocationErrorCode === REQUEST_LOCATION_RESULT_TYPE.TIMEOUT
      ? 'Hết thời gian yêu cầu.'
      : 'Bạn vui lòng bật Vị trí và cấp quyền truy cập Vị trí cho ứng dụng để có thể đạt được trải nghiệm sử dụng tốt nhất.';
  const okText =
    requestLocationErrorCode === REQUEST_LOCATION_RESULT_TYPE.TIMEOUT
      ? 'Thử lại'
      : 'Cài đặt';
  const cancelText = 'Bỏ qua';

  useEffect(() => {
    didMount();

    return unMount;
  }, []);

  const didMount = () => {
    getListStore();
    AppState.addEventListener('change', handleAppStateChange);
    requestLocationPermission();
  };

  const unMount = () => {
    Geolocation.clearWatch(watchID);
    // Geolocation.stopObserving();
    AppState.removeEventListener('change', handleAppStateChange);
    cancelRequests(requests);
  };

  const getListStore = async () => {
    getListStoreRequest.data = APIHandler.user_site_store();
    try {
      const responseData = await getListStoreRequest.promise();
      setListStore(responseData?.stores || []);
    } catch (error) {
      console.log('%cget_list_store', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.match(/inactive|background/) &&
      !modalVisible &&
      nextAppState === 'active'
    ) {
      if (isGoToSetting) {
        requestLocationPermission();
      } else if (
        requestLocationErrorCode === REQUEST_LOCATION_RESULT_TYPE.GRANTED
      ) {
        updateLocation();
      }
    }
    appState = nextAppState;
  };

  const requestLocationPermission = () => {
    LocationPermission.callPermission(
      LOCATION_PERMISSION_TYPE.REQUEST,
      (result) => {
        console.log(result);
        if (result === REQUEST_LOCATION_RESULT_TYPE.GRANTED) {
          setGotoSetting(false);
          updateLocation();
        } else {
          handleErrorLocationPermission({code: result});
        }
      },
    );
  };

  const updateLocation = (timeout = 5000, loading = false) => {
    if (requestLocationErrorCode !== REQUEST_LOCATION_RESULT_TYPE.GRANTED)
      return;
    const config = {
      timeout,
      enableHighAccuracy: appConfig.device.isIOS,
      distanceFilter: 1,
    };
    Geolocation.clearWatch(watchID);
    watchID = Geolocation.watchPosition(
      (position) => handleSaveLocation(position),
      (err) => {
        console.log('watch_position', watchID, err);
        setConnectGPS(false);
      },
      config,
    );
  };

  const handleSaveLocation = (position) => {
    const {coords} = position;
    if (coords && !latitude) {
      const {longitude, latitude} = coords;
      setConnectGPS(true);
      setRequestLocationErrorCode(REQUEST_LOCATION_RESULT_TYPE.GRANTED);
      setRequestLocationLoading(false);
      setLongitude(longitude);
      setLatitude(latitude);
    }
  };

  const handleErrorLocationPermission = (error) => {
    Geolocation.clearWatch(watchID);
    setRequestLocationLoading(false);
    setRequestLocationErrorCode(error.code);
    setTimeout(() => setModalVisible(appState === 'active'), 500);
  };

  const handleLocationError = () => {
    closeModal();
    setGotoSetting(true);
    LocationPermission.handleAccessSettingWhenRequestLocationError(
      requestLocationErrorCode,
    );
  };

  const cancelModal = () => {
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const calculateDiffDistance = (lng, lat) => {
    if (latitude && longitude) {
      return (
        <Text>
          {getPreciseDistance(
            {latitude, longitude},
            {latitude: Number(lat), longitude: Number(lng)},
            100,
          ) / 1000}{' '}
          <Text style={styles.distanceUnitTxt}>km</Text>
        </Text>
      );
    }
    return '-';
  };

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

  const onRefresh = () => {
    setRefreshing(true);
    getListStore();
  };

  const renderStore = ({item: store}) => {
    const disabledDistanceStyle = !isConnectGPS && styles.disabledDistance;
    return (
      <Container row style={styles.storeContainer}>
        <FastImage source={{uri: store.image_url}} style={styles.image} />

        <Container flex centerVertical={false} style={styles.infoContainer}>
          <Container centerVertical={false}>
            <Text style={styles.title}>{store.name}</Text>
            <Text style={styles.description}>{store.address}</Text>
          </Container>

          <Container flex row style={styles.mapInfoContainer}>
            <Container
              row
              style={[styles.distanceContainer, disabledDistanceStyle]}>
              {requestLocationLoading ? (
                <Loading
                  style={styles.distanceLoading}
                  wrapperStyle={styles.distanceLoadingContainer}
                  size="small"
                />
              ) : (
                <Ionicons
                  name="ios-navigate"
                  style={[styles.distanceIcon, disabledDistanceStyle]}
                />
              )}
              <Text style={[styles.distanceTxt, disabledDistanceStyle]}>
                {calculateDiffDistance(store.lng, store.lat)}
              </Text>
            </Container>

            <Container style={styles.openMapWrapper}>
              <Button
                containerStyle={styles.openMapContainer}
                onPress={() => openMap(store.lat, store.lng)}>
                <Container row style={styles.openMapBtn}>
                  <Ionicons name="ios-map-sharp" style={styles.mapIcon} />
                  <Text style={styles.openMapTxt}>Xem bản đồ</Text>
                </Container>
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    );
  };

  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}

      <Modal
        visible={modalVisible}
        title={title}
        content={content}
        okText={okText}
        cancelText={cancelText}
        onShow={Keyboard.dismiss}
        onRequestClose={closeModal}
        onCancel={cancelModal}
        onOk={handleLocationError}
      />
      <FlatList
        data={listStore}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderStore}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

export default GPSListStore;
