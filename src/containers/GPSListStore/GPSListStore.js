import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  AppState,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Actions} from 'react-native-router-flux';
import {getPreciseDistance} from 'geolib';

import appConfig from 'app-config';
import store from 'app-store';
import {APIRequest} from '../../network/Entity';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

import ScreenWrapper from '../../components/ScreenWrapper';
import Modal from '../../components/account/Transfer/Payment/Modal';
import {
  LocationPermission,
  LOCATION_PERMISSION_TYPE,
  REQUEST_RESULT_TYPE,
} from '../../helper/permissionHelper';
import Loading from '../../components/Loading';
import StoreItem from './StoreItem';

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
  btnWrapper: {
    overflow: 'hidden',
    borderRadius: 15,
    marginLeft: 10,
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
  const {t} = useTranslation();

  const appState = useRef('active');
  const watchID = useRef('');
  const isUpdatedListStoreByPosition = useRef(false);

  const [getListStoreRequest] = useState(new APIRequest());
  const [setStoreRequest] = useState(new APIRequest());
  const [requests] = useState([getListStoreRequest, setStoreRequest]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isGoToSetting, setGotoSetting] = useState(false);
  const [requestLocationLoading, setRequestLocationLoading] = useState(true);
  const [isConnectGPS, setConnectGPS] = useState(false);
  const [requestLocationErrorCode, setRequestLocationErrorCode] = useState(-1);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [listStore, setListStore] = useState([]);

  const title = 'Không truy cập được Vị trí';
  const content =
    requestLocationErrorCode === REQUEST_RESULT_TYPE.TIMEOUT
      ? 'Hết thời gian yêu cầu.'
      : 'Bạn vui lòng bật Vị trí và cấp quyền truy cập Vị trí cho ứng dụng để có thể đạt được trải nghiệm sử dụng tốt nhất.';
  const okText =
    requestLocationErrorCode === REQUEST_RESULT_TYPE.TIMEOUT
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
    Geolocation.clearWatch(watchID.current);
    // Geolocation.stopObserving();
    AppState.removeEventListener('change', handleAppStateChange);
    cancelRequests(requests);
    if (isConfigActive(CONFIG_KEY.OPEN_STORE_FROM_LIST_KEY)) {
      handlePressStore(
        {
          id: 0,
          site_id: store?.store_data?.id,
        },
        true,
      );
    }
  };

  const getListStore = async (data) => {
    if (latitude !== undefined && longitude !== undefined) {
      data = {
        lat: latitude,
        lng: longitude,
      };
    }
    getListStoreRequest.data = APIHandler.user_site_store(data);
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
      appState.current.match(/inactive|background/) &&
      !modalVisible &&
      nextAppState === 'active'
    ) {
      if (isGoToSetting) {
        requestLocationPermission();
      } else if (requestLocationErrorCode === REQUEST_RESULT_TYPE.GRANTED) {
        updateLocation();
      }
    }
    appState.current = nextAppState;
  };

  const requestLocationPermission = () => {
    LocationPermission.callPermission(
      LOCATION_PERMISSION_TYPE.REQUEST,
      (result) => {
        console.log(result);
        if (result === REQUEST_RESULT_TYPE.GRANTED) {
          setRequestLocationErrorCode(result);
          setGotoSetting(false);
          updateLocation(undefined, result);
        } else {
          handleErrorLocationPermission({code: result});
          !listStore?.length && getListStore();
        }
      },
    );
  };

  const updateLocation = (
    timeout = 5000,
    errorCode = requestLocationErrorCode,
  ) => {
    if (errorCode !== REQUEST_RESULT_TYPE.GRANTED) return;
    const config = {
      timeout,
      enableHighAccuracy: appConfig.device.isIOS,
      distanceFilter: 1,
    };
    Geolocation.clearWatch(watchID.current);
    watchID.current = Geolocation.watchPosition(
      (position) => handleSaveLocation(position),
      (err) => {
        console.log('watch_position', watchID.current, err);
        setConnectGPS(false);
        !listStore?.length && getListStore();
      },
      config,
    );
  };

  const handleSaveLocation = (position) => {
    const {coords} = position;
    if (coords && !latitude) {
      const {longitude, latitude} = coords;
      setConnectGPS(true);
      setRequestLocationErrorCode(REQUEST_RESULT_TYPE.GRANTED);
      setRequestLocationLoading(false);
      setLongitude(longitude);
      setLatitude(latitude);

      if (!isUpdatedListStoreByPosition.current) {
        isUpdatedListStoreByPosition.current = true;
        getListStore({lat: latitude, lng: longitude});
      }
    }
  };

  const handleErrorLocationPermission = (error) => {
    Geolocation.clearWatch(watchID.current);
    setRequestLocationLoading(false);
    setRequestLocationErrorCode(error.code);
    setTimeout(() => setModalVisible(appState.current === 'active'), 500);
  };

  const handleLocationError = () => {
    closeModal();
    setGotoSetting(true);
    LocationPermission.handleAccessSettingWhenRequestLocationError(
      requestLocationErrorCode,
    );
  };

  const handlePressStore = useCallback(async (storeInfo, isBack) => {
    !isBack && setLoading(true);
    const data = {
      store_id: storeInfo.id,
    };
    setStoreRequest.data = APIHandler.site_set_store(storeInfo.site_id, data);
    try {
      const response = await setStoreRequest.promise();
      // console.log(response, data)
      if (response?.status === STATUS_SUCCESS) {
        store.setStoreData(response.data.site);

        if (!isBack) {
          await servicesHandler({
            type: SERVICES_TYPE.OPEN_SHOP,
            siteId: storeInfo.site_id,
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('set_store', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !isBack && setLoading(false);
    }
  }, []);

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

  const onRefresh = () => {
    setRefreshing(true);
    getListStore();
  };

  const renderStore = ({item: store}) => {
    const disabledDistanceStyle = !isConnectGPS && styles.disabledDistance;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!isConfigActive(CONFIG_KEY.OPEN_STORE_FROM_LIST_KEY)}
        onPress={() => handlePressStore(store)}>
        <StoreItem
          name={store.name}
          image={store.image_url}
          address={store.address}
          phone={store.phone}
          lat={store.lat}
          lng={store.lng}
          enableDistance
          requestLocationLoading={requestLocationLoading}
          distance={calculateDiffDistance(store.lng, store.lat)}
          disabledDistanceStyle={disabledDistanceStyle}
        />
      </TouchableOpacity>
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
