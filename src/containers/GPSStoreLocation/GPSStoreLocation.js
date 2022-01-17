import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Linking,
  AppState,
  Keyboard,
} from 'react-native';
// 3-party libs
import {debounce} from 'lodash';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {getPreciseDistance} from 'geolib';
import AndroidOpenSettings from 'react-native-android-open-settings';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'src/helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push, reset} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Loading from 'src/components/Loading';
import Modal from 'src/components/account/Transfer/Payment/Modal';
import Button from 'src/components/Button';
import StoreItem from 'src/containers/GPSListStore/StoreItem';
import NoResult from 'src/components/NoResult';
import {
  BaseButton,
  Container,
  FlatList,
  Input,
  RefreshControl,
  Typography,
} from 'src/components/base';

const styles = StyleSheet.create({
  searchInput: {
    padding: 15,
    margin: 15,
  },
  welcomeMessageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 30,
  },
  modalText: {
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  deceptionModal: {
    borderTopWidth: 3,
    padding: 15,
  },
  modalTextUserStyle: {
    fontWeight: 'bold',
  },
  createAppBtn: {
    marginTop: 15,
  },
});

const LOCATION_PERMISSIONS_TYPE = {
  CHECK: 'check-camera-permission',
  REQUEST: 'request-camera-permission',
};

const REQUEST_LOCATION_ERROR_TYPE = {
  NOT_GRANTED: 1,
  NOT_AVAILABLE: 2,
  TIMEOUT: 3,
};

const MAX_SELF_TRY_REQUEST_LOCATION_TIME = 2;

class GPSStoreLocation extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    back: true,
    searchable: true,
    appCreatable: false,
  };
  state = {
    loading: true,
    refreshing: false,
    modalVisible: false,
    requestLocationLoading: true,
    permissionLocationGranted: null,
    stores: null,
    latitude: null,
    longitude: null,
    searchValue: '',
    requestLocationErrorCode: 0,
    isConnectGPS: false,
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

  searchPlaceholder = this.props.t('searchStorePlaceholder');
  welcomeMessage = this.props.t('welcomeMessage');
  appCreatingMessage = this.props.t('appCreatingMessage');

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.requestLocationPermission();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    AppState.removeEventListener('change', this.handleAppStateChange);
    // Geolocation.stopObserving();
    Geolocation.clearWatch(this.watchID);

    this.updateNavBarDisposer();
  }

  handleChangeSearch = debounce((searchValue = '', loading = true) => {
    if (this.unmounted) return;

    this.setState({loading, searchValue});
    this.getListGPSStore(searchValue);
  }, 500);

  requestLocationPermission = () => {
    this.androidLocationPermissionRequesting = true;
    this.callPermission(LOCATION_PERMISSIONS_TYPE.REQUEST, (type) => {
      this.androidLocationPermissionRequesting = false;
      if (type === 0) {
        this.updateLocation();
      } else {
        this.handleErrorLocationPermission({code: type});
      }
    });
  };

  updateLocation = (timeout = 5000, loading = false) => {
    if (this.unmounted) return;

    const config = {
      timeout,
      enableHighAccuracy: appConfig.device.isIOS,
    };
    Geolocation.clearWatch(this.watchID);
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('geolocation', this.watchID, position);
        if (this.unmounted) return;

        this.watchID = Geolocation.watchPosition(
          (position) => this.handleSaveLocation(position),
          (err) => {
            if (this.unmounted) return;

            this.requestLocationRetryable = true;
            this.selfTryRequestLocation(err, this.requestLocationPermission);
            this.setState({isConnectGPS: false});
            console.log('watch_position', this.watchID, err);
          },
          {...config},
        );
        this.handleSaveLocation(position, true);
      },
      (error) => {
        console.log('update_location', error);
        if (this.unmounted) return;

        this.requestLocationRetryable = true;
        this.selfTryRequestLocation(error, this.requestLocationPermission);
      },
      config,
    );
  };

  handleErrorLocationPermission(error) {
    if (this.unmounted) return;

    Geolocation.clearWatch(this.watchID);
    this.setState({
      modalVisible: this.appState === 'active',
      requestLocationErrorCode: error.code,
      requestLocationLoading: false,
    });
    this.getListGPSStore();
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

  handleAppStateChange = (nextAppState) => {
    if (
      !!this.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !this.state.loading &&
      !this.state.modalVisible &&
      (appConfig.device.isAndroid
        ? !this.androidLocationPermissionRequesting
        : true)
    ) {
      this.requestLocationRetryable = true;
      this.selfTryRequestLocationTime = 1;
      this.setState({requestLocationLoading: true}, () => {
        this.updateLocation();
      });
    }
    this.appState = nextAppState;
  };

  handleSaveLocation = debounce((position, loading = false) => {
    if (this.unmounted) return;

    const {coords} = position;
    if (coords) {
      const {longitude, latitude} = coords;
      this.setState(
        {
          longitude,
          latitude,
          requestLocationErrorCode: 0,
          requestLocationLoading: false,
          isConnectGPS: true,
        },
        () => {
          this.getListGPSStore();

          // this.handleChangeSearch(this.state.searchValue, undefined, loading);
        },
      );
    }
  }, 500);

  async getListGPSStore(content = '') {
    const {t} = this.props;
    const data = {
      content,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    try {
      this.getListGPSStoreRequest.data = APIHandler.user_list_gps_store_location(
        data,
      );
      const response = await this.getListGPSStoreRequest.promise();
      if (this.unmounted) return;

      this.setState({
        stores: response.data.stores || [],
      });
    } catch (error) {
      console.log('get_gps_store_location', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      if (this.unmounted) return;

      this.setState({loading: false, refreshing: false});
    }
  }

  async callPermission(type, callBack = () => {}) {
    const permissionGranted = await this.handleLocationPermission(type);
    callBack(permissionGranted);
  }

  handleLocationPermission = async (type) => {
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
            'This feature is not available (on this device / in this context)',
          );
          return REQUEST_LOCATION_ERROR_TYPE.NOT_AVAILABLE;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
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

  onStorePress = async (location) => {
    this.setState({loading: true});
    try {
      const response = await APIHandler.user_choose_store_location(
        location.site_id,
      );
      console.log('re', response);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          store.resetCartData();
          reset(appConfig.routes.sceneWrapper);
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getListGPSStore();
  };

  onPressRegisterStore() {
    push(appConfig.routes.registerStore);
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
        this.setState({requestLocationLoading: true});
        this.requestLocationPermission();
        break;
    }
  };

  openSettingIOS(url) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle settings url", url);
          Alert.alert(
            this.props.t('accessDenyMessage'),
            this.props.t('cantOpenLinkMessage'),
          );
        } else {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
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
    this.setState({modalVisible: false});
  };

  calculateDiffDistance = (lng, lat) => {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    if (latitude && longitude) {
      return (
        <Typography
          style={this.distanceStyle}
          type={TypographyType.LABEL_EXTRA_SMALL}>
          {getPreciseDistance(
            {latitude, longitude},
            {latitude: Number(lat), longitude: Number(lng)},
            100,
          ) / 1000}
          <Typography
            style={this.distanceStyle}
            type={TypographyType.LABEL_EXTRA_SMALL}>
            km
          </Typography>
        </Typography>
      );
    }
    return '-';
  };

  renderStore = ({item: store}) => {
    const disabledDistanceStyle =
      (!this.state.isConnectGPS || this.state.requestLocationErrorCode !== 0) &&
      this.disabledDistanceStyle;

    return (
      <BaseButton activeOpacity={0.5} onPress={() => this.onStorePress(store)}>
        <StoreItem
          name={store.name}
          image={store.image}
          address={store.address}
          phone={store.phone}
          lat={store.lat}
          lng={store.lng}
          enableDistance
          requestLocationLoading={this.state.requestLocationLoading}
          distance={this.calculateDiffDistance(store.lng, store.lat)}
          disabledDistanceStyle={disabledDistanceStyle}
        />
      </BaseButton>
    );
  };

  renderFooter = () => {
    return (
      !!this.props.appCreatable && (
        <View style={[styles.deceptionModal, this.deceptionModalStyle]}>
          <View style={styles.welcomeMessageContainer}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.modalText}>
              {this.welcomeMessage}
            </Typography>
            <Typography
              type={TypographyType.LABEL_HUGE_PRIMARY}
              style={!!store.user_info.name && styles.modalTextUserStyle}>
              {!!store.user_info.name ? ' ' + store.user_info.name : ''}!
            </Typography>
          </View>

          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
            style={styles.modalText}>
            {this.appCreatingMessage}
          </Typography>
          <View style={styles.createAppBtn}>
            <Button
              title={this.props.t('createApp')}
              onPress={this.onPressRegisterStore.bind(this)}
            />
          </View>
        </View>
      )
    );
  };

  get deceptionModalStyle() {
    return {
      borderColor: this.theme.color.primary5,
    };
  }

  get searchInputStyle() {
    return [
      styles.searchInput,
      {
        borderWidth: this.theme.layout.borderWidth,
        borderColor: this.theme.color.border,
        borderRadius: this.theme.layout.borderRadiusMedium,
      },
    ];
  }

  get distanceStyle() {
    return {
      color: this.theme.color.primary,
    };
  }

  get disabledDistanceStyle() {
    return {
      backgroundColor: this.theme.color.contentBackground,
      color: this.theme.color.iconInactive,
    };
  }

  render() {
    const {t} = this.props;

    const title = t('locationPermissionNotGranted');
    const content =
      this.state.requestLocationErrorCode ===
      REQUEST_LOCATION_ERROR_TYPE.TIMEOUT
        ? t('requestTimeoutMessage')
        : t('requiredPermissionMessage');
    const okText =
      this.state.requestLocationErrorCode ===
      REQUEST_LOCATION_ERROR_TYPE.TIMEOUT
        ? t('common:tryAgain')
        : t('common:settings');
    const cancelText = t('common:skip');

    return (
      <Container flex>
        {this.state.loading && <Loading center />}
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
          contentStyle={{paddingHorizontal: 15}}
          titleStyle={{paddingHorizontal: 15}}
        />

        {!!this.props.searchable && (
          <Input
            onChangeText={this.handleChangeSearch}
            style={this.searchInputStyle}
            placeholder={this.searchPlaceholder}
          />
        )}
        {!!this.state.stores && (
          <FlatList
            safeLayout={!this.props.appCreatable}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={this.state.stores}
            renderItem={this.renderStore}
            ListFooterComponent={this.renderFooter}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <NoResult
                icon={<View />}
                message={this.props.t('address:address.noStore')}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        )}
      </Container>
    );
  }
}

export default withTranslation('gpsStore')(GPSStoreLocation);
