import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CachedImageBackground} from 'react-native-img-cache';
import ImagePicker from 'react-native-image-picker';
import ProfileContext from '../ProfileContext';
import PremiumIcon from 'src/components/PremiumIcon';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Loading from 'src/components/Loading';
import NavBarButton from '../NavBar/NavBarButton';

class Header extends Component {
  static contextType = ProfileContext;
  state = {};

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

  render() {
    const {isMainUser} = this.context;
    return (
      <View style={styles.container}>
        <CachedImageBackground
          mutable
          source={{uri: this.props.cover}}
          style={[styles.wrapper]}>
          <View style={styles.defaultCover}>
            {isMainUser && (
              <NavBarButton
                containerStyle={styles.cameraIconContainer}
                iconStyle={styles.cameraIcon}
                iconName="camerao"
                onPress={this.onChangeCover}
              />
            )}
          </View>
          <View style={styles.avatarContainer}>
            <TouchableHighlight
              disabled={this.props.avatarLoading}
              underlayColor="rgba(0,0,0,.3)"
              onPress={this.props.onPressAvatar}
              style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <CachedImage
                  mutable
                  source={{uri: this.props.avatar}}
                  style={styles.avatar}
                />
                {!!this.props.avatarLoading && (
                  <Loading
                    wrapperStyle={styles.avatarLoadingWrapper}
                    center
                    size="small"
                  />
                )}
              </View>
            </TouchableHighlight>
            {!!this.props.premium && (
              <PremiumIcon
                premium={this.props.premium}
                style={styles.premium}
              />
            )}
          </View>
        </CachedImageBackground>

        <Text style={styles.title}>{this.props.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  wrapper: {
    width: appConfig.device.width,
    height: appConfig.device.width / 2,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: AVATAR_BORDER_RADIUS,
    borderBottomWidth: 3,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: AVATAR_DIMENSIONS,
    height: AVATAR_DIMENSIONS,
    borderRadius: AVATAR_BORDER_RADIUS,
    bottom: -AVATAR_BORDER_RADIUS,
    backgroundColor: '#eee',
  },
  avatarWrapper: {
    alignItems: 'center',
    borderRadius: AVATAR_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#eee',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarLoadingWrapper: {
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  premium: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#fafafa',
    padding: 4,
    borderRadius: 15,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
    paddingHorizontal: 15,
  },
  subTitle: {
    textAlign: 'center',
    color: '#333',
    marginTop: 3,
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
  defaultCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  cameraIcon: {
    color: '#ddd',
    fontSize: 20
  }
});

export default withTranslation('editProfile')(Header);

const Row = (props) => (
  <View style={[styles.row, props.style]}>
    <Icon name={props.iconName} style={[styles.icon, props.iconStyle]} />
    <Text style={[styles.rowTitle, props.titleStyle]}>{props.content}</Text>
  </View>
);
