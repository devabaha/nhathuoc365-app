import React, {Component, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  AppState,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import appConfig from 'app-config';
import ScreenWrapper from '../../components/ScreenWrapper';
import Modal from '../../components/account/Transfer/Payment/Modal';
import {
  LocationPermission,
  LOCATION_PERMISSION_TYPE,
  REQUEST_RESULT_TYPE,
} from '../../helper/permissionHelper';
import Loading from '../../components/Loading';
import {APIRequest} from '../../network/Entity';
import Container from '../../components/Layout/Container';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from '../../store/Store';
import AddressItem from '../../components/payment/AddressItem';

const styles = StyleSheet.create({
  storeContainer: {
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
  description: {
    color: '#666',
    marginTop: 5,
  },

  address_selected_box: {
    flex: 1,
    justifyContent: 'center',
    bottom: 45,
    alignItems: 'center',
  },

  containerDescription: {
    flexDirection: 'row',
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
  containerEmptyText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

const ListAddressStore = ({onChangeAddress = () => {}, selectedAddressId}) => {
  const getListAddressStoreRequest = new APIRequest();
  const requests = [getListAddressStoreRequest];
  const appState = useRef('active');
  const watchID = useRef('');
  const isUpdatedListStoreByPosition = useRef(false);
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

  const errContent =
    'Vui lòng cho phép truy cập vị trí để hiển hị cửa hàng theo thứ tự gần nhất!';

  useEffect(() => {
    didMount();
    return unMount;
  }, []);

  const didMount = () => {
    AppState.addEventListener('change', handleAppStateChange);
    requestLocationPermission();
    getListAddressStore();
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
    getListAddressStoreRequest.data = APIHandler.site_address(data, site_id);

    try {
      const responseData = await getListAddressStoreRequest.promise();
      console.log(responseData);
      setListStore(responseData?.data || []);
      console.log('list store', listStore);
    } catch (error) {
      console.log('get_list_store', 'color:red', error);
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
      requestLocationErrorCode === REQUEST_RESULT_TYPE.GRANTED &&
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
          updateLocation();
        } else {
          handleErrorLocationPermission({code: result});
          !listStore?.length &&
            getListAddressStore({lat: latitude, lng: longitude});
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
    watchID.current = Geolocation.watchPosition(
      (position) => handleSaveLocation(position),
      (err) => {
        console.log('watch_position', watchID.current, err);
        setConnectGPS(false);
        !listStore?.length &&
          getListAddressStore({lat: latitude, lng: longitude});
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

  const handleLocationError = (errorCode) => {
    setGotoSetting(true);
    LocationPermission.openPermissionAskingModal(
      errorCode,
      undefined,
      undefined,
      errContent,
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getListAddressStore();
  };

  const handleSelectAddress = (storeAddress) => {
    onChangeAddress(storeAddress);
  };

  const renderListAddress = ({item: storeAddress}) => {
    let isSelected = storeAddress.id == selectedAddressId;

    return (
      <AddressItem
        key={storeAddress.id}
        address={storeAddress}
        selectable
        selected={isSelected}
        onSelectAddress={() => handleSelectAddress(storeAddress)}
      />
    );
  };

  return listStore.map((store, index) =>
    renderListAddress({item: store, index}),
  );
};

export default ListAddressStore;
