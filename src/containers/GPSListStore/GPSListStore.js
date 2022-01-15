import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, AppState, StyleSheet} from 'react-native';
// 3-party libs
import Geolocation from '@react-native-community/geolocation';
import {getPreciseDistance} from 'geolib';
import useIsMounted from 'react-is-mounted-hook';
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {isConfigActive} from 'app-helper/configKeyHandler';
import {servicesHandler} from 'app-helper/servicesHandler';
import {LocationPermission} from 'app-helper/permissionHelper';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {refresh} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {GPS_LIST_TYPE} from 'src/constants';
import {
  LOCATION_PERMISSION_TYPE,
  REQUEST_RESULT_TYPE,
} from 'app-helper/permissionHelper';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Modal from 'src/components/account/Transfer/Payment/Modal';
import Loading from 'src/components/Loading';
import StoreItem from './StoreItem';
import NoResult from 'src/components/NoResult';
import {
  BaseButton,
  Container,
  FlatList,
  RefreshControl,
  ScreenWrapper,
  Typography,
} from 'src/components/base';

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  infoContainer: {
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  distanceUnitTxt: {
    fontSize: 11,
  },
});

const GPSListStore = ({type = GPS_LIST_TYPE.GPS_LIST_STORE}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const appState = useRef('active');
  const watchID = useRef('');
  const isUpdatedListStoreByPosition = useRef(false);
  const isMounted = useIsMounted();

  const [getListStoreRequest] = useState(new APIRequest());
  const [setStoreRequest] = useState(new APIRequest());

  const [requests] = useState([getListStoreRequest, setStoreRequest]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isGoToSetting, setGotoSetting] = useState(false);
  const [requestLocationLoading, setRequestLocationLoading] = useState(true);
  const [isConnectGPS, setConnectGPS] = useState(false);
  const [isGetDataFirstTime, setGetDataFirstTime] = useState(true);
  const [requestLocationErrorCode, setRequestLocationErrorCode] = useState(-1);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [listStore, setListStore] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [noResult, setNoResult] = useState(false);

  const title = t('gpsStore:locationPermissionNotGranted');
  const content =
    requestLocationErrorCode === REQUEST_RESULT_TYPE.TIMEOUT
      ? t('gpsStore:requestTimeoutMessage')
      : t('gpsStore:requiredPermissionMessage');
  const okText =
    requestLocationErrorCode === REQUEST_RESULT_TYPE.TIMEOUT
      ? t('common:tryAgain')
      : t('common:settings');
  const cancelText = t('common:skip');

  useEffect(() => {
    didMount();

    return unMount;
  }, []);

  const didMount = () => {
    getListStore();
    AppState.addEventListener('change', handleAppStateChange);
    requestLocationPermission();

    setTimeout(() => {
      refresh({
        searchValue: '',
        onSearch: (text) => {
          refresh({
            searchValue: text,
          });

          // auto search on changed text
          onSearch(text);
        },
        onCancel: () => {
          Keyboard.dismiss();
        },
        onClearText: () => {
          refresh({
            searchValue: '',
          });

          onSearch('');
        },
      });
    });
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
    setLoading(true);

    if (latitude !== undefined && longitude !== undefined) {
      data = {
        lat: latitude,
        lng: longitude,
      };
    }
    getListStoreRequest.data =
      type === GPS_LIST_TYPE.GPS_LIST_STORE
        ? APIHandler.user_site_store(data)
        : APIHandler.user_list_gps_store_location(data);
    try {
      const responseData = await getListStoreRequest.promise();

      setListStore(
        (type === GPS_LIST_TYPE.GPS_LIST_STORE
          ? responseData?.stores
          : responseData?.data?.stores) || [],
      );
    } catch (error) {
      console.log('%cget_list_store', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setGetDataFirstTime(false);
    }
  };

  const onSearch = debounce((keyword) => {
    keyword = keyword.trim();
    getListStore({content: keyword});
  }, 500);

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
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('geolocation', watchID.current, position);
        if (!isMounted()) return;

        watchID.current = Geolocation.watchPosition(
          (position) => handleSaveLocation(position),
          (err) => {
            console.log('watch_position', watchID.current, err);
            setConnectGPS(false);
            !listStore?.length && getListStore();
          },
          config,
        );
        handleSaveLocation(position);
      },
      (error) => {
        console.log('update_location', error);
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

  const handlePressSite = useCallback((site) => {
    servicesHandler({
      siteId: site.site_id,
      type: SERVICES_TYPE.OPEN_SHOP,
    });
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
        <Typography style={distanceTextStyle}>
          {getPreciseDistance(
            {latitude, longitude},
            {latitude: Number(lat), longitude: Number(lng)},
            100,
          ) / 1000}{' '}
          <Typography style={distanceTextStyle}>km</Typography>
        </Typography>
      );
    }
    return '-';
  };

  const onRefresh = () => {
    setRefreshing(true);
    getListStore();
  };

  const renderStore = ({item: store}) => {
    const disabledDistanceStyle = !isConnectGPS && disabledDistanceStyle;

    return (
      <BaseButton
        activeOpacity={0.5}
        disabled={
          type === GPS_LIST_TYPE.GPS_LIST_STORE
            ? !isConfigActive(CONFIG_KEY.OPEN_STORE_FROM_LIST_KEY)
            : false
        }
        onPress={
          type === GPS_LIST_TYPE.GPS_LIST_STORE
            ? () => handlePressStore(store)
            : () => handlePressSite(store)
        }>
        <StoreItem
          name={store.name}
          image={
            type === GPS_LIST_TYPE.GPS_LIST_STORE
              ? store.image_url
              : store.image
          }
          address={store.address}
          phone={store.phone}
          lat={store.lat}
          lng={store.lng}
          enableDistance
          requestLocationLoading={requestLocationLoading}
          distance={calculateDiffDistance(store.lng, store.lat)}
          disabledDistanceStyle={disabledDistanceStyle}
          actionBtnTitle={
            type === GPS_LIST_TYPE.GPS_LIST_STORE ? t('map') : t('goShopping')
          }
          actionBtnIconName={
            type === GPS_LIST_TYPE.GPS_LIST_SITE && 'ios-cart-sharp'
          }
          onPressActionBtn={
            type === GPS_LIST_TYPE.GPS_LIST_SITE
              ? () => handlePressSite(store)
              : null
          }
        />
      </BaseButton>
    );
  };

  const renderNoResult = () => {
    return (
      !isGetDataFirstTime && (
        <NoResult
          message={
            type === GPS_LIST_TYPE.GPS_LIST_STORE
              ? t('noResult')
              : t('noStoreFound')
          }
        />
      )
    );
  };

  const distanceTextStyle = useMemo(() => {
    return mergeStyles(styles.distanceUnitTxt, {
      color: theme.color.primary,
    });
  }, [theme]);

  const disabledDistanceStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackground,
      color: theme.color.iconInactive,
    };
  }, [theme]);
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
      <Container flex>
        <FlatList
          safeLayout
          data={listStore}
          renderItem={renderStore}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderNoResult}
          onScroll={Keyboard.dismiss}
        />
      </Container>
    </ScreenWrapper>
  );
};

export default GPSListStore;
