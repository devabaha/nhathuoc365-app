import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  BackHandler,
} from 'react-native';
// helpers
import {
  CameraPermission,
  PhotoLibraryPermission,
} from 'app-helper/permissionHelper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  Typography,
  TextButton,
  IconButton,
} from 'src/components/base';

class ModalGalleryOptionAndroid extends Component {
  static contextType = ThemeContext;

  state = {};

  optionTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      } else {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
      }
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleOpenCamera = async () => {
    const granted = await CameraPermission.request();
    if (granted) {
      this.props.onPressCamera();
    } else {
      this.handleBackPress();
      setTimeout(() => {
        CameraPermission.openPermissionAskingModal();
      }, 500);
    }
  };

  handleOpenLibrary = async () => {
    const granted = await PhotoLibraryPermission.request();
    if (granted) {
      this.props.onPressLibrary();
    } else {
      this.handleBackPress();
      setTimeout(() => {
        PhotoLibraryPermission.openPermissionAskingModal();
      }, 500);
    }
  };

  handleBackPress = () => {
    this.props.onClose();
    return false;
  };

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get titleContainerStyle() {
    return mergeStyles(styles.titleContainer, {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {
      color: this.theme.color.textSecondary,
    });
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View style={this.containerStyle}>
            <Container safeLayout style={styles.content}>
              <Container noBackground row style={this.titleContainerStyle}>
                <Typography
                  type={TypographyType.TITLE_LARGE_TERTIARY}
                  style={styles.title}>
                  {this.props.t('selectPhotoLabel')}
                </Typography>
                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="close"
                  iconStyle={this.iconStyle}
                  onPress={this.props.onClose}
                />
              </Container>
              <TextButton
                onPress={this.handleOpenCamera}
                titleStyle={styles.option}
                typoProps={this.optionTypoProps}>
                {this.props.t('cameraLabel')}
              </TextButton>
              <TextButton
                onPress={this.handleOpenLibrary}
                titleStyle={styles.option}
                typoProps={this.optionTypoProps}>
                {this.props.t('photoLibraryLabel')}
              </TextButton>
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 15,
  },
  titleContainer: {},
  title: {
    paddingVertical: 15,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  option: {
    width: '100%',
    paddingVertical: 10,
  },
  icon: {
    fontSize: 26,
  },
});

export default withTranslation()(ModalGalleryOptionAndroid);
