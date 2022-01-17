import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, AppState, StyleSheet, View} from 'react-native';
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
import {refresh, reset} from 'app-helper/routing';
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
import {TypographyType} from 'src/components/base';
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
  checkIcon: {
    fontSize: 16,
    color: appConfig.colors.primary,
  },
});

const GPSListStore = ({
  type = GPS_LIST_TYPE.GPS_LIST_STORE,
  onPress,
  selectedStore,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const appState = useRef('active');
  const watchID = useRef('');
  const isUpdatedListStoreByPosition = useRef(false);
  const isGoToSetting = useRef(false);
  const isMounted = useIsMounted();

  const [getListStoreRequest] = useState(new APIRequest());
  const [setStoreRequest] = useState(new APIRequest());

  const [requests] = useState([getListStoreRequest, setStoreRequest]);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
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
  }, [latitude, longitude]);

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
    if (
      isConfigActive(CONFIG_KEY.OPEN_STORE_FROM_LIST_KEY) &&
      !isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)
    ) {
      handlePressStore(
        {
          id: 0,
          site_id: store?.store_data?.id,
        },
        true,
      );
    }
  };

  const formatStoreData = (storeType, store) => {
    const defaultStoreData = {
      disabled: false,
      onPress: onPress ? () => onPress(store) : () => {},
      name: store.name,
      image: '',
      address: store.address,
      phone: store.phone,
      lat: store.lat,
      lng: store.lng,
      actionBtnTitle: t('goShopping'),
      actionBtnIconName: 'ios-cart-sharp',
      onPressActionBtn: undefined,
    };

    switch (storeType) {
      case GPS_LIST_TYPE.GPS_LIST_SITE:
        return {
          ...defaultStoreData,
          onPress: onPress
            ? () => onPress(store)
            : () => handlePressSite(store),
          image: store.image,
          onPressActionBtn: () => handlePressSite(store),
        };
      case GPS_LIST_TYPE.GPS_LIST_STORE:
        if (
          isConfigActive(CONFIG_KEY.OPEN_STORE_FROM_LIST_KEY) &&
          !selectedStore
        ) {
          return {
            ...defaultStoreData,
            disabled: false,
            onPress: onPress
              ? () => onPress(store)
              : () => handlePressStore(store),
            image: store.image_url,
            phone: null,
            onPressActionBtn: () => handlePressStore(store),
          };
        } else {
          return {
            ...defaultStoreData,
            disabled: !onPress,
            image: store.image_url,
            actionBtnTitle: t('map'),
            actionBtnIconName: 'ios-map-sharp',
          };
        }
      default:
        return defaultStoreData;
    }
  };

  const getListStore = async (data, isLoading = true) => {
    isLoading && setLoading(true);

    if (latitude !== undefined && longitude !== undefined) {
      data = {
        ...data,
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
      console.log(data, responseData, latitude, longitude);
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
    setSearchValue(keyword);
    keyword = keyword.trim();

    getListStore({content: keyword});
  }, 500);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      !modalVisible &&
      nextAppState === 'active'
    ) {
      if (isGoToSetting.current) {
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
        if (result === REQUEST_RESULT_TYPE.GRANTED) {
          setRequestLocationErrorCode(result);
          isGoToSetting.current = false;
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
    isGoToSetting.current = true;
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

        if (isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)) {
          reset(appConfig.routes.sceneWrapper);
          return;
        }

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
      isMounted() && !isBack && setLoading(false);
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
    getListStore(undefined, false);
  };

  const renderRightIcon = (store) => {
    return selectedStore ? (
      store.id === selectedStore.id ? (
        <FontAwesomeIcon name="check" style={styles.checkIcon} />
      ) : (
        <View />
      )
    ) : null;
  };

  const renderStore = ({item: store}) => {
    const disabledDistanceStyle = !isConnectGPS && styles.disabledDistance;
    const formattedStore = formatStoreData(type, store);

    return (
      <BaseButton
        activeOpacity={0.5}
        disabled={formattedStore.disabled}
        onPress={formattedStore.onPress}>
        <StoreItem
          name={formattedStore.name}
          image={formattedStore.image}
          address={formattedStore.address}
          phone={formattedStore.phone}
          lat={formattedStore.lat}
          lng={formattedStore.lng}
          enableDistance
          requestLocationLoading={requestLocationLoading}
          distance={calculateDiffDistance(
            formattedStore.lng,
            formattedStore.lat,
          )}
          disabledDistanceStyle={disabledDistanceStyle}
          actionBtnTitle={formattedStore.actionBtnTitle}
          actionBtnIconName={formattedStore.actionBtnIconName}
          onPressActionBtn={formattedStore.onPressActionBtn}
          rightIcon={renderRightIcon(store)}
          pressable={!formattedStore.disabled}
        />
      </BaseButton>
    );
  };

  const renderNoResult = () => {
    return (
      !isGetDataFirstTime && (
        <NoResult
          iconName={!!searchValue ? 'magnify' : undefined}
          message={
            !!searchValue
              ? t('noResultFound')
              : type === GPS_LIST_TYPE.GPS_LIST_STORE
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
