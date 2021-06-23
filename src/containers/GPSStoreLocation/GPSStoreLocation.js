import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  View,
  TouchableHighlight,
  Alert,
  Text,
  FlatList,
  ScrollView,
  Linking,
  AppState,
  Keyboard
} from 'react-native';
import ModernList, { LIST_TYPE } from 'app-packages/tickid-modern-list';
import Row from './Row';
import { Actions } from 'react-native-router-flux';
import { debounce } from 'lodash';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Loading from '../../components/Loading';
import Modal from '../../components/account/Transfer/Payment/Modal';
import appConfig from 'app-config';
import store from 'app-store';
import { APIRequest } from '../../network/Entity';
import EventTracker from '../../helper/EventTracker';

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    // flex: 1,
    flexGrow: 1,
    justifyContent: 'center'
  },
  scrollContainer: {
    flex: 1
  },
  listContainer: {
    backgroundColor: 'transparent',
    flex: undefined
  },
  listHeader: {
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  listBody: {
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    flex: undefined
  },
  divider: {
    marginHorizontal: 15,
    height: 1,
    backgroundColor: appConfig.colors.primary
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
    color: '#444',
    letterSpacing: 1
  },
  subTitle: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#666',
    marginBottom: 3
  },
  placeholder: {
    fontWeight: '300',
    fontStyle: 'italic'
  },
  disabled: {
    backgroundColor: '#ccc'
  },
  item: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 7,
    margin: 5,
    marginVertical: 8,
    borderRadius: 4
  },
  itemText: {
    fontSize: 16,
    color: '#333'
  },
  itemActive: {
    backgroundColor: appConfig.colors.primary
  },
  itemTextActive: {
    color: '#fff'
  },
  itemDisabled: {
    backgroundColor: 'rgba(244,244,244,.3)'
  },
  itemTextDisabled: {
    color: 'rgba(0,0,0,.3)'
  },
  headerText: {
    color: '#666',
    marginLeft: 30,
    marginVertical: 7
  },
  emptyText: {
    marginTop: 30,
    width: '100%',
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666'
  },
  btnIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#fff'
  }
});

const LOCATION_PERMISSIONS_TYPE = {
  CHECK: 'check-camera-permission',
  REQUEST: 'request-camera-permission'
};

const REQUEST_LOCATION_ERROR_TYPE = {
  NOT_GRANTED: 1,
  NOT_AVAILABLE: 2,
  TIMEOUT: 3
};

const MAX_SELF_TRY_REQUEST_LOCATION_TIME = 2;

class GPSStoreLocation extends Component {
  state = {
    loading: true,
    refreshing: false,
    modalVisible: false,
    requestLocationLoading: true,
    professions: null,
    permissionLocationGranted: null,
    stores: null,
    latitude: null,
    longitude: null,
    searchValue: '',
    requestLocationErrorCode: 0
  };
  getListGPSStoreRequest = new APIRequest();
  requests = [this.getListGPSStoreRequest];
  unmounted = false;
  searchable = false;
  selfTryRequestLocationTime = 0;
  androidLocationPermissionRequesting = false;
  requestLocationRetryable = false;
  appState = 'active';
  watchID = '';
  timeoutUpdateLocation = null;
  eventTracker = new EventTracker();

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.requestLocationPermission();
    // setTimeout(() =>
    //   Actions.refresh({
    //     onChangeSearch: this.handleChangeSearch.bind(this),
    //   })
    // );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    AppState.removeEventListener('change', this.handleAppStateChange);
    Geolocation.stopObserving();
  }

  requestLocationPermission = () => {
    this.androidLocationPermissionRequesting = true;
    this.callPermission(LOCATION_PERMISSIONS_TYPE.REQUEST, type => {
      this.androidLocationPermissionRequesting = false;
      if (type === 0) {
        this.updateLocation();
      } else {
        this.handleErrorLocationPermission({ code: type });
        this.getListGPSStore();
      }
    });
  };

  updateLocation = (timeout = 5000, loading = false) => {
    const config = {
      timeout,
      enableHighAccuracy: appConfig.device.isIOS
    };
    Geolocation.clearWatch(this.watchID);
    Geolocation.getCurrentPosition(
      position => {
        console.log('geolocation', this.watchID, position);
        this.watchID = Geolocation.watchPosition(
          position => this.handleSaveLocation(position),
          err => {
            this.requestLocationRetryable = true;
            this.selfTryRequestLocation(err, this.requestLocationPermission);
            console.log('watch_position', this.watchID, err);
          },
          { ...config }
        );
        this.handleSaveLocation(position, true);
      },
      error => {
        console.log('update_location', error);
        this.requestLocationRetryable = true;
        this.selfTryRequestLocation(error, this.requestLocationPermission);
      },
      config
    );
  };

  handleErrorLocationPermission(error) {
    Geolocation.clearWatch(this.watchID);
    this.setState({
      modalVisible: this.appState === 'active',
      requestLocationErrorCode: error.code,
      requestLocationLoading: false
    });
  }

  selfTryRequestLocation(error, callBack = () => {}) {
    if (!this.requestLocationRetryable) return false;
    if (
      this.selfTryRequestLocationTime === MAX_SELF_TRY_REQUEST_LOCATION_TIME ||
      this.state.requestLocationErrorCode ===
        REQUEST_LOCATION_ERROR_TYPE.TIMEOUT
    ) {
      this.selfTryRequestLocationTime = 0;
      this.requestLocationRetryable = false;
      this.androidLocationPermissionRequesting = false;
      this.handleErrorLocationPermission(error);
      return;
    }

    callBack();
    this.selfTryRequestLocationTime++;
  }

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !this.state.loading &&
      !this.state.modalVisible &&
      (appConfig.device.isAndroid
        ? !this.androidLocationPermissionRequesting
        : true)
    ) {
      this.requestLocationRetryable = true;
      this.selfTryRequestLocationTime = 1;
      this.setState({ requestLocationLoading: true });
      this.updateLocation();
    }
    this.appState = nextAppState;
  };

  handleSaveLocation = debounce((position, loading = false) => {
    if (!this.unmounted) {
      const { coords } = position;
      if (coords) {
        const { longitude, latitude } = coords;
        this.setState(
          {
            longitude,
            latitude,
            requestLocationErrorCode: 0,
            requestLocationLoading: false
          },
          () => {
            this.getListGPSStore();

            // this.handleChangeSearch(this.state.searchValue, undefined, loading);
          }
        );
      }
    }
  }, 500);

  handleChangeSearch = debounce(
    (searchValue = '', professionIds, loading = true) => {
      this.searchable = true;
      this.setState({ loading, searchValue });
      this.searchExperts(searchValue, professionIds);
    },
    500
  );

  async getListGPSStore() {
    const { t } = this.props;
    const data = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };
    try {
      this.getListGPSStoreRequest.data = APIHandler.user_list_gps_store_location(
        data
      );
      const response = await this.getListGPSStoreRequest.promise();
      this.setState({
        stores: response.data.stores || []
      });
    } catch (error) {
      console.log('get_gps_store_location', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({ loading: false, refreshing: false });
    }
  }

  searchExperts = async (content, professionIds) => {
    const data = {
      profession_ids:
        this.profession_ids.length !== 0
          ? this.profession_ids
          : professionIds || [],
      content,
      latitude: String(this.state.latitude),
      longitude: String(this.state.longitude)
    };

    const { t } = this.props;
    try {
      const response = await APIHandler.search_experts(data);
      if (!this.unmounted && this.searchable) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            stores: response.data.stores.map(expert => ({
              ...expert,
              active: false
            }))
          });
        } else {
          this.setState({ stores: [] });
        }
      }
    } catch (error) {
      console.log('search stores', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false, refreshing: false });
    }
  };

  get activedItems() {
    return this.state.professions
      ? this.state.professions.filter(item => item.active)
      : [];
  }

  get profession_ids() {
    return this.activedItems.map(item => item.id);
  }

  async callPermission(type, callBack = () => {}) {
    const permissionGranted = await this.handleLocationPermission(type);
    callBack(permissionGranted);
  }

  handleLocationPermission = async type => {
    const permissonLocationRequest = appConfig.device.isAndroid
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    let permissionHandler = null;
    switch (type) {
      case LOCATION_PERMISSIONS_TYPE.CHECK:
        permissionHandler = check;
        break;
      case LOCATION_PERMISSIONS_TYPE.REQUEST:
        permissionHandler = request;
        break;
    }

    try {
      const result = await permissionHandler(permissonLocationRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)'
          );
          return REQUEST_LOCATION_ERROR_TYPE.NOT_AVAILABLE;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable'
          );
          return REQUEST_LOCATION_ERROR_TYPE.NOT_GRANTED;
        case RESULTS.GRANTED:
          console.log('The location permission is granted');
          return 0;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return REQUEST_LOCATION_ERROR_TYPE.NOT_GRANTED;
      }
    } catch (error) {
      console.log(error);
      // Alert.alert('Lỗi yêu cầu quyền truy cập Location');
      return REQUEST_LOCATION_ERROR_TYPE.TIMEOUT;
    }
  };

  handlePressProfession = profession => {
    const professions = [...this.state.professions];
    professions.forEach(item => {
      if (item.name === profession.name) {
        item.active = !profession.active;
      }
    });

    this.setState({ professions }, () => {
      this.handleChangeSearch(this.state.searchValue);
    });
  };

  onStorePress = async location => {
    try {
      const response = await APIHandler.user_choose_store_location(
        location.site_id
      );
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          store.resetCartData();
          Actions.reset(appConfig.routes.sceneWrapper);
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getListGPSStore();
    // this.handleChangeSearch(this.state.searchValue, undefined, false);
  };

  renderStore({ item: store }) {
    return (
      <Row
        image={store.image}
        title={store.name}
        address={store.address}
        distance={store.distance_view}
        onPress={() => this.onStorePress(store)}
      />
    );
  }

  handleLocationError = () => {
    this.closeModal();
    switch (this.state.requestLocationErrorCode) {
      case REQUEST_LOCATION_ERROR_TYPE.NOT_GRANTED:
        appConfig.device.isIOS
          ? this.openSettingIOS('app-settings:')
          : this.openSettingsAndroid(REQUEST_LOCATION_ERROR_TYPE.NOT_GRANTED);
        break;
      case REQUEST_LOCATION_ERROR_TYPE.NOT_AVAILABLE:
        appConfig.device.isIOS
          ? this.openSettingIOS('App-Prefs:root=Privacy&path=LOCATION')
          : this.openSettingsAndroid(REQUEST_LOCATION_ERROR_TYPE.NOT_AVAILABLE);
        break;
      case REQUEST_LOCATION_ERROR_TYPE.TIMEOUT:
        this.setState({ requestLocationLoading: true });
        this.requestLocationPermission();
        break;
    }
  };

  openSettingIOS(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle settings url", url);
          Alert.alert('Không thể truy cập', 'Đường dẫn này không thể mở được.');
        } else {
          Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  }

  openSettingsAndroid(type) {
    switch (type) {
      case REQUEST_LOCATION_ERROR_TYPE.NOT_AVAILABLE:
        AndroidOpenSettings.locationSourceSettings();
        break;
      case REQUEST_LOCATION_ERROR_TYPE.NOT_GRANTED:
        AndroidOpenSettings.appDetailsSettings();
        break;
    }
  }

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const title = 'Không truy cập được Vị trí';
    const content =
      this.state.requestLocationErrorCode ===
      REQUEST_LOCATION_ERROR_TYPE.TIMEOUT
        ? 'Hết thời gian yêu cầu.'
        : 'Bạn vui lòng bật Vị trí và cấp quyền truy cập Vị trí cho ứng dụng để có thể đạt được trải nghiệm sử dụng tốt nhất.';
    const okText =
      this.state.requestLocationErrorCode ===
      REQUEST_LOCATION_ERROR_TYPE.TIMEOUT
        ? 'Thử lại'
        : 'Cài đặt';
    const cancelText = 'Bỏ qua';

    return (
      <>
        {(this.state.loading || this.state.requestLocationLoading) && (
          <Loading center />
        )}
        <Modal
          visible={this.state.modalVisible}
          title={title}
          content={content}
          okText={okText}
          cancelText={cancelText}
          onShow={Keyboard.dismiss}
          onRequestClose={this.closeModal}
          onCancel={this.closeModal}
          onOk={this.handleLocationError}
          contentStyle={{ paddingHorizontal: 15 }}
          titleStyle={{ paddingHorizontal: 15 }}
        />
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          style={styles.safeView}
          contentContainerStyle={[styles.container]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <SafeAreaView style={styles.safeView}>
            <View style={styles.scrollContainer}>
              {!!this.state.stores && (
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  data={this.state.stores}
                  renderItem={this.renderStore.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Không có cửa hàng</Text>
                  }
                />
              )}
            </View>
          </SafeAreaView>
        </ScrollView>
      </>
    );
  }
}

export default withTranslation()(GPSStoreLocation);
