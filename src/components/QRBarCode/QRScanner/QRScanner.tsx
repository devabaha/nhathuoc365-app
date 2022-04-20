import React, {Component} from 'react';
import {StyleSheet, Dimensions, View, Alert} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  TypographyType,
  BundleIconSetName,
  AppFilledButton,
} from 'src/components/base';
// custom components
import {Typography, Icon, TextButton} from 'src/components/base';
import {QRScannerProps} from '.';
import QRBackground from '../QRBackground';
import QRFrame from '../QRFrame';

const styles = StyleSheet.create({
  topContent: {
    paddingVertical: 16,
    paddingTop: '50%',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginLeft: 8,
    paddingHorizontal: 15,
  },

  permissionNotGrantedBtn: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  qrMarkerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  qrFrameContainer: {
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 26,
  },
});

const DEFAULT_CAMERA_RATIO = 4 / 3;
const CONTAINER_QR_WIDTH = Dimensions.get('window').width;
const CONTAINER_QR_HEIGHT = Dimensions.get('window').height;
const DEFAULT_CAMERA_WIDTH = CONTAINER_QR_HEIGHT / DEFAULT_CAMERA_RATIO;

const BOTTOM_HEIGHT =
  CONTAINER_QR_HEIGHT * 0.1 > 100 ? 100 : CONTAINER_QR_HEIGHT * 0.1;

const SCAN_AREA_WIDTH = CONTAINER_QR_WIDTH * 0.6;
const SCAN_AREA_HEIGHT = CONTAINER_QR_WIDTH * 0.6;

const SCAN_AREA_TOP_PERCENT =
  (CONTAINER_QR_HEIGHT - SCAN_AREA_HEIGHT - BOTTOM_HEIGHT * 2) /
  CONTAINER_QR_HEIGHT /
  2;
const SCAN_AREA_TOP = CONTAINER_QR_HEIGHT * SCAN_AREA_TOP_PERCENT;
const SCAN_AREA_LEFT = CONTAINER_QR_WIDTH * 0.2;
const SCAN_AREA_LEFT_PERCENT =
  ((DEFAULT_CAMERA_WIDTH - CONTAINER_QR_WIDTH) / 2 + SCAN_AREA_LEFT) /
  DEFAULT_CAMERA_WIDTH;

const QR_SCAN_AREA = {
  x: SCAN_AREA_TOP_PERCENT,
  y: SCAN_AREA_LEFT_PERCENT,
  width: SCAN_AREA_HEIGHT / CONTAINER_QR_HEIGHT,
  height: 1 - SCAN_AREA_LEFT_PERCENT * 2,
};

const CAMERA_PROPS = {
  ratio: '4:3',
  rectOfInterest: QR_SCAN_AREA,
  cameraViewDimensions: {
    height: CONTAINER_QR_HEIGHT,
    width: DEFAULT_CAMERA_WIDTH,
  },
};

const CAMERA_STYLE = {
  height: CONTAINER_QR_HEIGHT,
  width: CONTAINER_QR_WIDTH,
};

class QRScanner extends Component<QRScannerProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    refQRScanner: null,
    onRead: () => {},
    onChangePermission: () => {},
  };

  state = {
    permissionCameraGranted: undefined,
  };
  unmounted = false;

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.checkPermissions();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkPermissions();
  }

  async checkPermissions() {
    const permissionCameraGranted = await this.checkCameraPermission();

    if (
      permissionCameraGranted !== this.state.permissionCameraGranted &&
      !this.unmounted
    ) {
      this.setState({permissionCameraGranted});
      this.props.onChangePermission(permissionCameraGranted);
    }
  }

  checkCameraPermission = async () => {
    const {t} = this.props;
    if (!appConfig.device.isAndroid && !appConfig.device.isIOS) {
      Alert.alert(t('common:system.camera.error.notSupport'));
      return false;
    }

    const permissonCameraRequest = appConfig.device.isAndroid
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

    try {
      const result = await check(permissonCameraRequest);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(t('common:system.camera.error.unavailable'));
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          return false;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          return false;
        case RESULTS.GRANTED:
          console.log('The library permission is granted');
          return true;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return false;
      }
    } catch (error) {
      console.log(error);
      Alert.alert(t('common:system.camera.error.accessProblem'));
      return false;
    }
  };

  onPressSetting = () => {
    const {t} = this.props;
    openSettings().catch(() =>
      Alert.alert(t('common:system.settings.error.accessProblem')),
    );
  };

  renderCustomMarker() {
    return (
      this.props.customMarker || (
        <View style={styles.qrMarkerContainer}>
          <QRBackground
            containerWidth={CONTAINER_QR_WIDTH}
            containerHeight={CONTAINER_QR_HEIGHT}
            scanAreaHeight={SCAN_AREA_HEIGHT}
            scanAreaWidth={SCAN_AREA_WIDTH}
            scanAreaLeft={SCAN_AREA_LEFT}
            scanAreaTop={SCAN_AREA_TOP}
          />
          <View
            style={[
              this.qrFrameContainerStyle,
              {
                top: SCAN_AREA_TOP,
                left: SCAN_AREA_LEFT,
              },
            ]}>
            <QRFrame width={SCAN_AREA_WIDTH} height={SCAN_AREA_HEIGHT} />
          </View>
        </View>
      )
    );
  }

  renderIconBefore(titleStyle) {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        style={[titleStyle, styles.icon]}
        name="camera-party-mode"
      />
    );
  }

  renderAuthorizedView() {
    const {t} = this.props;
    const settingLabel: string = t('settingLabel');
    return (
      this.props.notAuthorizedView ||
      (this.state.permissionCameraGranted === false ? (
        <View style={[styles.topContent]}>
          <Typography
            renderIconBefore={this.renderIconBefore}
            type={TypographyType.LABEL_LARGE}
            style={styles.centerText}>
            {' ' + t('common:system.camera.access.request')}
          </Typography>
          <AppFilledButton
            style={styles.permissionNotGrantedBtn}
            onPress={this.onPressSetting}>
            {settingLabel}
          </AppFilledButton>
        </View>
      ) : (
        <View style={styles.topContent}>
          <Typography
            renderIconBefore={this.renderIconBefore}
            type={TypographyType.LABEL_LARGE}
            style={styles.centerText}>
            {' ' + t('qrGuideMessage')}
          </Typography>
        </View>
      ))
    );
  }

  get qrFrameContainerStyle() {
    return mergeStyles(styles.qrFrameContainer, {
      borderColor: this.theme.color.border,
    });
  }

  render() {
    return (
      <QRCodeScanner
        ref={this.props.refQRScanner}
        cameraProps={CAMERA_PROPS}
        cameraStyle={CAMERA_STYLE}
        reactivate
        reactivateTimeout={2000}
        fadeIn={false}
        showMarker
        checkAndroid6Permissions
        permissionDialogTitle=""
        permissionDialogMessage={this.props.t(
          'common:system.camera.access.request',
        )}
        onRead={this.props.onRead}
        customMarker={this.renderCustomMarker()}
        notAuthorizedView={this.renderAuthorizedView()}
        bottomContent={this.props.bottomContent}
        topContent={this.props.topContent}
      />
    );
  }
}

export default withTranslation(['qrBarCode', 'common'])(QRScanner);
