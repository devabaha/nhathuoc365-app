import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TO_SHOW,
  TO_HIDE,
  QRCODE_SIZE,
  FLASH_SCAN_END,
  FLASH_SCAN_START,
  QRCODE_SCANING_SIZE,
  SCANING_ANIMATED_DEFINITION,
  QRCODE_TYPE,
  BARCODE_TYPE
} from './constants';

const MaterialIconAnimated = Animated.createAnimatedComponent(
  MaterialCommunityIcons
);

class TabIcon extends Component {
  state = {
    iconSize: new Animated.Value(QRCODE_SIZE),
    iconScanSize: new Animated.Value(QRCODE_SCANING_SIZE),
    iconSizeOpacity: new Animated.Value(TO_SHOW),
    iconScanSizeOpacity: new Animated.Value(TO_HIDE),
    flashScaning: new Animated.Value(FLASH_SCAN_START),
    codeType: QRCODE_TYPE
  };

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation() {
    SCANING_ANIMATED_DEFINITION.forEach(animation => {
      animation.functions.forEach(func => {
        if (
          typeof this[func] === 'function' &&
          typeof animation.delay === 'number'
        ) {
          setTimeout(this[func].bind(this), animation.delay);
        }
      });
    });
  }

  changeCodeType() {
    if (this.state.codeType === BARCODE_TYPE) {
      this.setState({ codeType: QRCODE_TYPE });
    } else {
      this.setState({ codeType: BARCODE_TYPE });
    }
  }

  scaningAnimation() {
    const TIMING = 400;
    this.runAnimation(this.state.flashScaning, FLASH_SCAN_END, TIMING);
    setTimeout(() => {
      this.runAnimation(this.state.flashScaning, FLASH_SCAN_START, TIMING);
    }, TIMING);
  }

  codeFadeIn() {
    const SCALE_TIMING = 250;
    const RESIZE_TIMING = 100;
    this.runAnimation(this.state.iconSize, QRCODE_SIZE + 2, SCALE_TIMING).then(
      () => {
        this.runAnimation(this.state.iconSize, QRCODE_SIZE, RESIZE_TIMING);
      }
    );
    this.runAnimation(this.state.iconSizeOpacity, TO_SHOW, SCALE_TIMING);
  }

  codeFadeOut() {
    const TIMING = 250;
    this.runAnimation(this.state.iconSize, QRCODE_SCANING_SIZE, TIMING);
    this.runAnimation(this.state.iconSizeOpacity, TO_HIDE, TIMING);
  }

  codeScaningFadeIn() {
    const SCALE_TIMING = 250;
    const RESIZE_TIMING = 100;
    this.runAnimation(this.state.iconScanSize, QRCODE_SIZE, SCALE_TIMING).then(
      () => {
        this.runAnimation(
          this.state.iconScanSize,
          QRCODE_SIZE - 2,
          RESIZE_TIMING
        );
      }
    );
    this.runAnimation(this.state.iconScanSizeOpacity, 1, SCALE_TIMING);
  }

  codeScaningFadeOut() {
    const TIMING = 250;
    this.runAnimation(this.state.iconScanSize, QRCODE_SCANING_SIZE, TIMING);
    this.runAnimation(this.state.iconScanSizeOpacity, TO_HIDE, TIMING);
  }

  runAnimation(animation = '', toValue = 0, duration = 0) {
    return new Promise(resolve => {
      Animated.timing(animation, { toValue, duration }).start(resolve);
    });
  }

  renderIcon() {
    return (
      <View
        style={[
          styles.iconWrapper,
          Platform.OS === 'ios' ? { paddingTop: 3 } : null
        ]}
      >
        <Fragment>
          <View style={styles.qrcodeWrapper}>
            <Animated.View
              style={[styles.flashScaning, { top: this.state.flashScaning }]}
            />
            <MaterialIconAnimated
              style={[
                {
                  color: '#fff',
                  fontSize: this.state.iconSize,
                  opacity: this.state.iconSizeOpacity
                }
              ]}
              name={`${this.state.codeType}`}
            />
          </View>
          <View style={styles.qrcodeWrapper}>
            <MaterialIconAnimated
              style={[
                {
                  color: '#fff',
                  fontSize: this.state.iconScanSize,
                  opacity: this.state.iconScanSizeOpacity
                }
              ]}
              name={`${this.state.codeType}-scan`}
              size={this.state.iconScanSize}
            />
          </View>
        </Fragment>
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderIcon()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
    backgroundColor: DEFAULT_COLOR,
    borderRadius: 22,
    overflow: 'hidden'
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    width: 28,
    height: 28
  },
  qrcodeWrapper: {
    width: 44,
    height: 44,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 2
  },
  flashScaning: {
    width: 60,
    height: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    left: -10,
    opacity: 0.7
  }
});

export default TabIcon;
