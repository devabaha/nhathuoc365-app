import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
// 3-party libs
import ImagePicker from 'react-native-image-picker';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import ProfileContext from 'src/containers/Profile/ProfileContext';
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Typography} from 'src/components/base';
import PremiumIcon from 'src/components/PremiumIcon';
import Loading from 'src/components/Loading';
import NavBarButton from '../NavBar/NavBarButton';
import ImageBackground from 'src/components/ImageBg';
import Image from 'src/components/Image';
import Row from './Row';

class Header extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  onChangeCover = () => {
    const {t} = this.props;

    const options = {
      title: t('coverPicker.title'),
      cancelButtonTitle: t('coverPicker.cancelTitle'),
      takePhotoButtonTitle: t('coverPicker.takePhotoTitle'),
      chooseFromLibraryButtonTitle: t('coverPicker.chooseFromLibraryTitle'),
      rotation: 360,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
      } else {
        // console.log(response);
        if (!response.filename) {
          response.filename = `${new Date().getTime()}`;
        }
        this.props.uploadTempCover(response);
      }
    });
  };

  get imageBackgroundWrapperStyle() {
    return mergeStyles(styles.wrapper, {
      backgroundColor: this.theme.color.contentBackground,
    });
  }

  get coverLoadingBtnContainerStyle() {
    return mergeStyles(
      [styles.cameraIconContainer, styles.coverCameraIconContainer],
      {
        backgroundColor: this.theme.color.overlay60,
      },
    );
  }

  get coverLoadingBtnIconStyle() {
    return mergeStyles(styles.cameraIcon, {
      color: this.theme.color.iconInactive,
    });
  }

  get avatarLoadingBtnContainerStyle() {
    return mergeStyles(
      [styles.avatarCorner, styles.avatarCameraIconContainer],
      {
        backgroundColor: this.theme.color.overlay60,
      },
    );
  }

  get avatarLoadingBtnIconStyle() {
    return mergeStyles(styles.avatarCameraIcon, {
      color: this.theme.color.iconInactive,
    });
  }

  get coverBottomSpaceStyle() {
    return mergeStyles(styles.coverBottomSpace, {
      borderTopColor: this.theme.color.border,
    });
  }

  get avatarWrapperStyle() {
    return mergeStyles(styles.avatarWrapper, {
      borderColor: this.theme.color.border,
      backgroundColor: this.theme.color.contentBackground,
    });
  }

  get avatarLoadingWrapperStyle() {
    return {
      backgroundColor: this.theme.color.overlay60,
    };
  }

  get distanceTitleStyle() {
    return mergeStyles(
      styles.iconDistance,
      this.theme.typography[TypographyType.DESCRIPTION_MEDIUM],
    );
  }

  render() {
    const hasHeaderInfo =
      !!this.props.quote ||
      !!this.props.address ||
      !!this.props.tel ||
      !!this.props.distance;

    return (
      <Container style={styles.container}>
        <ImageBackground
          imageProps={{canTouch: true}}
          source={{uri: this.props.cover}}
          style={this.imageBackgroundWrapperStyle}
          imageStyle={styles.imageWrapper}>
          {!!this.props.coverLoading && (
            <Loading
              wrapperStyle={[
                this.avatarLoadingWrapperStyle,
                {zIndex: 0, bottom: AVATAR_BORDER_RADIUS},
              ]}
              center
              size="small"
            />
          )}
          <ProfileContext.Consumer>
            {({isMainUser}) =>
              isMainUser && (
                <NavBarButton
                  disabled={this.props.coverLoading}
                  containerStyle={this.coverLoadingBtnContainerStyle}
                  iconStyle={this.coverLoadingBtnIconStyle}
                  iconName="camerao"
                  onPress={this.onChangeCover}
                />
              )
            }
          </ProfileContext.Consumer>
          <Container style={this.coverBottomSpaceStyle} />
          <View style={styles.avatarContainer}>
            <Container
              onPress={this.props.onPressAvatar}
              style={this.avatarWrapperStyle}>
              <View style={styles.avatar}>
                <Image
                  canTouch
                  source={{uri: this.props.avatar}}
                  style={styles.avatar}
                />
                {!!this.props.avatarLoading && (
                  <Loading
                    wrapperStyle={this.avatarLoadingWrapperStyle}
                    center
                    size="small"
                  />
                )}
              </View>
            </Container>
            <ProfileContext.Consumer>
              {({isMainUser}) =>
                isMainUser && (
                  <NavBarButton
                    disabled={this.props.avatarLoading}
                    containerStyle={this.avatarLoadingBtnContainerStyle}
                    iconStyle={this.avatarLoadingBtnIconStyle}
                    iconName="camerao"
                    onPress={this.props.onPressAvatar}
                  />
                )
              }
            </ProfileContext.Consumer>
          </View>
        </ImageBackground>

        <Container center style={styles.titleContainer}>
          <View>
            {!!this.props.premium && (
              <PremiumIcon
                premium={this.props.premium}
                style={styles.premium}
              />
            )}
            <Typography
              type={TypographyType.TITLE_HUGE}
              style={[styles.title, !hasHeaderInfo && styles.noHeaderInfo]}>
              {this.props.name}
            </Typography>
          </View>
        </Container>

        {!!this.props.quote && (
          <Typography
            type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
            style={styles.subTitle}>
            {this.props.quote}
          </Typography>
        )}
        {!!this.props.address && (
          <Row iconName="map-marker" content={this.props.address} />
        )}
        {!!this.props.tel && <Row iconName="phone" content={this.props.tel} />}
        {!!this.props.distance && (
          <Row
            iconStyle={this.distanceTitleStyle}
            titleStyle={this.distanceTitleStyle}
            style={styles.distance}
            iconName="safari"
            content={this.props.distance}
          />
        )}
      </Container>
    );
  }
}

const MAX_AVATAR_DIMENSIONS = 150;
const AVATAR_DIMENSIONS =
  appConfig.device.width / 3 > MAX_AVATAR_DIMENSIONS
    ? MAX_AVATAR_DIMENSIONS
    : appConfig.device.width / 3;
const AVATAR_BORDER_RADIUS = AVATAR_DIMENSIONS / 2;
const PREMIUM_DIMENSIONS = 22;
const AVATAR_CAMERA_ICON_DIMENSIONS = 24;
const DISTANCE_FROM_ROUND_EDGE_TO_SQUARE_CONNER_OF_AVATAR_CONTAINER =
  (AVATAR_DIMENSIONS * (Math.sqrt(2) - 1)) / 2 -
  AVATAR_CAMERA_ICON_DIMENSIONS -
  3;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  wrapper: {
    width: appConfig.device.width,
    height: appConfig.device.width / 2 + AVATAR_BORDER_RADIUS,
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    position: undefined,
  },
  coverBottomSpace: {
    width: appConfig.device.width,
    height: AVATAR_BORDER_RADIUS,
    bottom: 0,
    position: 'absolute',
    borderTopWidth: 3.5,
  },
  avatarContainer: {
    position: 'absolute',
    width: AVATAR_DIMENSIONS,
    height: AVATAR_DIMENSIONS,
    borderRadius: AVATAR_BORDER_RADIUS,
    bottom: 0,
  },
  avatarWrapper: {
    alignItems: 'center',
    borderRadius: AVATAR_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },

  avatarCorner: {
    position: 'absolute',
    right:
      DISTANCE_FROM_ROUND_EDGE_TO_SQUARE_CONNER_OF_AVATAR_CONTAINER *
      Math.sin(45),
    bottom:
      DISTANCE_FROM_ROUND_EDGE_TO_SQUARE_CONNER_OF_AVATAR_CONTAINER *
      Math.cos(45),
  },
  avatarCameraIconContainer: {
    width: AVATAR_CAMERA_ICON_DIMENSIONS,
    height: AVATAR_CAMERA_ICON_DIMENSIONS,
  },
  premium: {
    width: PREMIUM_DIMENSIONS,
    height: PREMIUM_DIMENSIONS,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: PREMIUM_DIMENSIONS / 2,
    position: 'absolute',
    left: -PREMIUM_DIMENSIONS * 1.2,
    top: 0,
  },
  titleContainer: {
    marginTop: 10,
    paddingHorizontal: appConfig.device.width * 0.15,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  noHeaderInfo: {
    marginBottom: 15,
  },
  subTitle: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '300',
    fontStyle: 'italic',
    paddingHorizontal: 15,
  },

  iconDistance: {
    fontSize: 14,
    flex: 0,
  },
  distance: {
    position: 'absolute',
    bottom: 15,
    right: 0,
  },
  cameraIconContainer: {
    width: 34,
    height: 34,
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
  coverCameraIconContainer: {
    bottom: AVATAR_BORDER_RADIUS,
  },
  cameraIcon: {
    fontSize: 18,
  },
  avatarCameraIcon: {
    fontSize: 14,
  },
});

export default withTranslation('editProfile')(Header);
