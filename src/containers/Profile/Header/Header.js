import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import ProfileContext from '../ProfileContext';
import PremiumIcon from 'src/components/PremiumIcon';
import Loading from 'src/components/Loading';
import NavBarButton from '../NavBar/NavBarButton';
import ImageBackground from 'src/components/ImageBg';
import Image from 'src/components/Image';
import {Container} from 'src/components/Layout';

class Header extends Component {
  static contextType = ProfileContext;
  state = {
    coverLoading: false,
  };

  onChangeCover = () => {
    this.setState({coverLoading: true});
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

      this.setState({coverLoading: false});
    });
  };

  render() {
    const {isMainUser} = this.context;

    const hasHeaderInfo =
      !!this.props.quote ||
      !!this.props.address ||
      !!this.props.tel ||
      !!this.props.distance;

    return (
      <View style={styles.container}>
        <ImageBackground
          imageProps={{canTouch: true}}
          source={{uri: this.props.cover}}
          style={[styles.wrapper]}
          imageStyle={styles.imageWrapper}>

          {isMainUser && (
            <NavBarButton
              disabled={this.state.coverLoading}
              containerStyle={[styles.cameraIconContainer, styles.coverCameraIconContainer]}
              iconStyle={styles.cameraIcon}
              iconName="camerao"
              onPress={this.onChangeCover}
            />
          )}
          <View style={styles.coverBottomSpace}/>
          <View style={styles.avatarContainer}>
            <View
              onPress={this.props.onPressAvatar}
              style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Image
                  canTouch
                  source={{uri: this.props.avatar}}
                  style={styles.avatar}
                  loadingColor="#ccc"
                  errorColor="#ccc"
                />
                {!!this.props.avatarLoading && (
                  <Loading
                    wrapperStyle={styles.avatarLoadingWrapper}
                    center
                    size="small"
                  />
                )}
              </View>
            </View>
            {isMainUser && (
              <NavBarButton
                disabled={this.props.avatarLoading}
                containerStyle={[
                  styles.cameraIconContainer,
                  styles.avatarCameraIconContainer,
                  styles.avatarCorner,
                ]}
                iconStyle={[styles.cameraIcon, styles.avatarCameraIcon]}
                iconName="camerao"
                onPress={this.props.onPressAvatar}
              />
            )}
          </View>
        </ImageBackground>

        <Container row center style={styles.titleContainer}>
          <View>
            {!!this.props.premium && (
              <PremiumIcon
                premium={this.props.premium}
                style={styles.premium}
              />
            )}
            <Text style={[styles.title, !hasHeaderInfo && styles.noHeaderInfo]}>
              {this.props.name}
            </Text>
          </View>
        </Container>
        {!!this.props.quote && (
          <Text style={styles.subTitle}>{this.props.quote}</Text>
        )}
        {!!this.props.address && (
          <Row iconName="map-marker" content={this.props.address} />
        )}
        {!!this.props.tel && <Row iconName="phone" content={this.props.tel} />}
        {!!this.props.distance && (
          <Row
            iconStyle={styles.iconDistance}
            titleStyle={styles.iconDistance}
            style={styles.distance}
            iconName="safari"
            content={this.props.distance}
          />
        )}
      </View>
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
  2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  wrapper: {
    backgroundColor: '#eee',
    width: appConfig.device.width,
    height: appConfig.device.width / 2 + AVATAR_BORDER_RADIUS,
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    position: undefined,
    height: appConfig.device.width / 2,
  },
  coverBottomSpace: {
    backgroundColor: '#fff',
    width: appConfig.device.width,
    height: AVATAR_BORDER_RADIUS,
    bottom: 0,
    position: 'absolute',
    borderTopWidth: 3.5,
    borderTopColor: '#eee',
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
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarLoadingWrapper: {
    backgroundColor: 'rgba(0,0,0,.6)',
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
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  premium: {
    // backgroundColor: '#eee',
    width: PREMIUM_DIMENSIONS,
    height: PREMIUM_DIMENSIONS,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    right: '100%',
  },
  titleContainer: {
    marginTop: 10,
    paddingHorizontal: appConfig.device.width * 0.15,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
    fontSize: 18,
    letterSpacing: 1,
    marginHorizontal: 10,
  },
  noHeaderInfo: {
    marginBottom: 15,
  },
  subTitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 13,
    paddingHorizontal: 15,
  },
  infoBlock: {
    flexDirection: 'row',
    marginTop: 10,
    borderTopColor: '#eee',
    borderTopWidth: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  icon: {
    width: 20,
    fontSize: 16,
    marginRight: 0,
    color: '#333',
  },
  rowTitle: {
    color: '#333',
    lineHeight: 18,
    flex: 1,
  },
  iconDistance: {
    color: '#888',
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
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  coverCameraIconContainer: {
    bottom: 5 + AVATAR_BORDER_RADIUS
  },
  cameraIcon: {
    color: '#eee',
    fontSize: 18,
  },
  avatarCameraIcon: {
    fontSize: 14,
  },
});

export default withTranslation('editProfile')(Header);

const Row = (props) => (
  <View style={[styles.row, props.style]}>
    <Icon name={props.iconName} style={[styles.icon, props.iconStyle]} />
    <Text style={[styles.rowTitle, props.titleStyle]}>{props.content}</Text>
  </View>
);
