import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {RNCamera} from 'react-native-camera';
import {withTranslation} from 'react-i18next';
// types
import {CameraViewProps} from '.';
import {Style} from 'src/Themes/interface';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {
  BaseButton,
  Container,
  IconButton,
  ScreenWrapper,
} from 'src/components/base';
import AnimatedLoading from './AnimatedLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    padding: 20,
    fontSize: 36,
  },
  btnContainer: {
    paddingVertical: appConfig.device.height * 0.05,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  mainArea: {
    position: 'absolute',
    width: appConfig.device.width,
    height: appConfig.device.height,
    borderLeftWidth: appConfig.device.width * 0.05,
    borderRightWidth: appConfig.device.width * 0.05,
    borderTopWidth: appConfig.device.height * 0.15,
    borderBottomWidth: appConfig.device.height * 0.2,
    alignSelf: 'center',
  },

  iconContainer: {
    alignSelf: 'flex-start',
  },
});

class CameraView extends Component<CameraViewProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    prefixImageCapture: 'data:image/jpg;base64,',
    type: RNCamera.Constants.Type.front,
    onCaptured: () => {},
    options: {
      quality: 1,
      base64: true,
      doNotSave: true,
      orientation: 'portrait',
      pauseAfterCapture: true,
    },
  };
  state = {
    loading: false,
    zoom: 0,
  };
  refCamera = null;

  get theme() {
    return getTheme(this);
  }

  async capture() {
    if (this.refCamera) {
      this.setState({loading: true});
      const options = this.props.options;
      try {
        const data = await this.refCamera.takePictureAsync(options);
        this.refCamera.resumePreview();
        if (data.base64) {
          data.base64 = this.props.prefixImageCapture + data.base64;
        }
        this.props.onCaptured(data);
      } catch (err) {
        console.log('%ccapture', 'color: red', err);
        //@ts-ignore
        flashShowMessage({
          type: 'danger',
          message: this.props.t('api.error.message'),
        });
      } finally {
        this.setState({loading: false});
      }
    }
  }

  get btnStyle() {
    return mergeStyles(styles.btn, {
      backgroundColor: this.theme.color.grey300,
    });
  }

  get innerBtnStyle() {
    return mergeStyles(styles.innerBtn, {
      backgroundColor: this.theme.color.onOverlay,
    });
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {
      color: this.theme.color.onOverlay,
    });
  }

  get mainAreaStyle() {
    return mergeStyles(styles.mainArea, {
      borderColor: this.theme.color.overlay30,
    });
  }

  get containerStyle(): Style {
    return {
      backgroundColor: this.theme.color.black,
    };
  }

  render() {
    const iconName = appConfig.device.isIOS
      ? 'ios-arrow-back'
      : 'md-arrow-back';
    const {prefixImageCapture, options, ...cameraProps} = this.props;

    const disabled = this.state.loading;

    return (
      <View style={[styles.container, this.containerStyle]}>
        <RNCamera
          zoom={this.state.zoom}
          autoFocus="on"
          ref={(inst) => (this.refCamera = inst)}
          style={styles.container}
          {...cameraProps}>
          <AnimatedLoading isLoading={this.state.loading} />
          <ScreenWrapper
            safeLayout
            safeTopLayout
            noBackground
            style={styles.container}>
            <View style={styles.container}>
              <View style={this.mainAreaStyle} />

              <IconButton
                shadow
                disabled={disabled}
                bundle={BundleIconSetName.IONICONS}
                name={iconName}
                iconStyle={this.iconStyle}
                style={styles.iconContainer}
                onPress={() => pop()}
              />

              <BaseButton
                disabled={disabled}
                style={styles.btnContainer}
                onPress={this.capture.bind(this)}>
                <Container shadow style={this.btnStyle}>
                  <Container style={this.innerBtnStyle} />
                </Container>
              </BaseButton>
            </View>
          </ScreenWrapper>
        </RNCamera>
      </View>
    );
  }
}

export default withTranslation()(CameraView);
