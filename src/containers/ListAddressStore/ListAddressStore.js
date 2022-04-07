import React, {useEffect, useRef, useState, useMemo} from 'react';
import {AppState, View} from 'react-native';
// 3-party libs
import Geolocation from '@react-native-community/geolocation';
import useIsMounted from 'react-is-mounted-hook';
import {getPreciseDistance} from 'geolib';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {
  LOCATION_PERMISSION_TYPE,
  REQUEST_RESULT_TYPE,
} from 'app-helper/permissionHelper';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
import {LocationPermission} from 'app-helper/permissionHelper';
// custom components
import AddressItem from 'src/components/payment/AddressItem';
import NoResult from './NoResult';
import {Typography} from 'src/components/base';

const ListAddressStore = ({
  refreshing,
  selectedAddressId,
  navigation,
  onChangeAddress = () => {},
  onLoadedData = () => {},
  onSelectedAddressLayout = () => {},
  onListAddressStoreChanged = (listAddressStore) => {},
}) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();

  const getListAddressStoreRequest = new APIRequest();
  const requests = [getListAddressStoreRequest];
  const appState = useRef('active');
  const watchID = useRef('');
  const isGoToSetting = useRef(false);
  const isUpdatedListStoreByPosition = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isPermissionRequesting, setPermissionRequesting] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  // const [isGoToSetting, setGotoSetting] = useState(false);
  const [requestLocationLoading, setRequestLocationLoading] = useState(true);
  const [isConnectGPS, setConnectGPS] = useState(false);
  const [requestLocationErrorCode, setRequestLocationErrorCode] = useState(-1);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [listStore, setListStore] = useState([]);

  const {t} = useTranslation(['address', 'common']);

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    didMount();
    return unMount;
  }, []);

  useEffect(() => {
    onListAddressStoreChanged(listStore);
  }, [listStore]);

  useEffect(() => {
    if (refreshing) {
      requestLocationPermission(() => {
        if (latitude !== undefined && longitude !== undefined) {
          getListAddressStore();
        }
      });
    }
  }, [refreshing]);

  const didMount = () => {
    AppState.addEventListener('change', handleAppStateChange);
    requestLocationPermission();
  };

  const unMount = () => {
    Geolocation.clearWatch(watchID.current);
    // Geolocation.stopObserving();
    AppState.removeEventListener('change', handleAppStateChange);
    cancelRequests(requests);
  };

  const getListAddressStore = async (data) => {
    const site_id = store.store_data.id;
    if (latitude !== undefined && longitude !== undefined) {
      data = {
        lat: latitude,
        lng: longitude,
      };
    }
    getListAddressStoreRequest.data = APIHandler.site_address(site_id, data);

    try {
      const responseData = await getListAddressStoreRequest.promise();
      setListStore(responseData?.data || []);
    } catch (error) {
      console.log('get_list_store', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message,
      });
    } finally {
      onLoadedData();
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      // requestLocationErrorCode === REQUEST_RESULT_TYPE.GRANTED &&
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

  const requestLocationPermission = (callbackSuccess = () => {}) => {
    setPermissionRequesting(true);
    LocationPermission.callPermission(
      LOCATION_PERMISSION_TYPE.REQUEST,
      (result) => {
        setPermissionRequesting(false);
        if (result === REQUEST_RESULT_TYPE.GRANTED) {
          setRequestLocationErrorCode(result);
          // setGotoSetting(false);
          isGoToSetting.current = false;
          callbackSuccess();
          updateLocation();
        } else {
          handleErrorLocationPermission({code: result});
          !listStore?.length && getListAddressStore();
        }
      },
    );
  };

  const updateLocation = (timeout = 5000) => {
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
            !listStore?.length && getListAddressStore();
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
        setLoading(true);
        getListAddressStore({lat: latitude, lng: longitude});
      }
    }
  };

  const handleErrorLocationPermission = (error) => {
    Geolocation.clearWatch(watchID.current);
    setRequestLocationLoading(false);
    setRequestLocationErrorCode(error.code);
    handleLocationError(error.code);
    setTimeout(() => setModalVisible(appState.current === 'active'), 500);
  };

  const handleLocationError = (errCode) => {
    // setGotoSetting(true);
    isGoToSetting.current = true;
    LocationPermission.openPermissionAskingModal({
      errCode,
      errContent: t('address.errMsgNotAllowLocationPermission'),
    });
  };

  const handleSelectAddress = (storeAddress) => {
    onChangeAddress(storeAddress);
  };

  const calculateDiffDistance = (lng, lat) => {
    if (latitude && longitude) {
      return `${
        getPreciseDistance(
          {latitude, longitude},
          {latitude: Number(lat), longitude: Number(lng)},
          100,
        ) / 1000
      } km`;
    }
    return '';
  };

  const isLoadingNoResultTextStyle = useMemo(() => {
    return {
      color: theme.color.textInactive,
    };
  }, [theme]);

  const renderListAddress = ({item: storeAddress}) => {
    const disabledDistanceStyle = !isConnectGPS;
    let isSelected = storeAddress.id == selectedAddressId;

    return (
      <AddressItem
        key={storeAddress.id}
        image={storeAddress.img}
        address={storeAddress}
        gpsDistance={calculateDiffDistance(
          storeAddress.longitude,
          storeAddress.latitude,
        )}
        disabledDistanceStyle={disabledDistanceStyle}
        selectable
        selected={isSelected}
        onSelectAddress={() => handleSelectAddress(storeAddress)}
        onLayout={isSelected ? onSelectedAddressLayout : undefined}
      />
    );
  };
  return (
    <View>
      {listStore?.length
        ? listStore?.map((store, index) =>
            renderListAddress({item: store, index}),
          )
        : !isLoading && (
            <NoResult iconName={'storefront'} message={t('address.noStore')} />
          )}

      {!isLoading &&
        requestLocationErrorCode !== REQUEST_RESULT_TYPE.GRANTED &&
        !!listStore?.length && (
          <NoResult
            iconName={'map-marker-off'}
            message={t('address.permissionNotGranted')}
            btnTitle={t('address.confirmPermission')}
            btnIconName={'setting'}
            onPress={() => requestLocationPermission()}
          />
        )}

      {isLoading && (
        <NoResult
          renderTitle={() => (
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM}
              style={isLoadingNoResultTextStyle}>
              {t('common:loading')}
            </Typography>
          )}
        />
      )}
    </View>
  );
};

export default ListAddressStore;
