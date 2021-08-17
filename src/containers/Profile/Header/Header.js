import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import SVGLandscape from 'src/images/landscape.svg';
import {CachedImageBackground} from 'react-native-img-cache';
import ImagePicker from 'react-native-image-picker';
import ProfileContext from '../ProfileContext';
import PremiumIcon from 'src/components/PremiumIcon';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Loading from 'src/components/Loading';

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
        {/* {isMainUser && (
          <NavBar onEdit={this.props.onEdit} onLogout={this.props.onLogout} />
        )} */}
        <CachedImageBackground
          mutable
          source={{uri: this.props.cover}}
          style={[styles.wrapper]}>
          <View style={styles.defaultCover}>
            {!!!this.props.cover && (
              <SVGLandscape
                fill={appConfig.colors.primary}
                height={'100%'}
                width={'100%'}
                style={{position: 'absolute'}}
              />
            )}

            {isMainUser && (
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={this.onChangeCover}>
                <AntIcon name="camerao" style={styles.cameraIcon} />
              </TouchableOpacity>
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
        <Text style={styles.subTitle}>{this.props.quote}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    paddingBottom: 15,
  },
  wrapper: {
    width: appConfig.device.width,
    height: appConfig.device.width / 2,
    backgroundColor: '#b5b5b5',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 33,
    borderBottomWidth: 3,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    bottom: -33,
    backgroundColor: '#eee',
    borderRadius: 50,
  },
  avatarWrapper: {
    alignItems: 'center',
    borderRadius: 50,
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
    fontWeight: '500',
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
    color: '#444',
  },
  rowTitle: {
    color: '#444',
    fontSize: 13,
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
    // alignItems: 'flex-end',
    // flex: 1
  },
  defaultCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    ...elevationShadowStyle(7),
    position: 'absolute',
    right: 10,
    top: appConfig.isIOS ? 60 : 75,
  },
  cameraIcon: {
    fontSize: 26,
    color: '#fff',
  },
});

export default withTranslation('editProfile')(Header);

const Row = (props) => (
  <View style={[styles.row, props.style]}>
    <Icon name={props.iconName} style={[styles.icon, props.iconStyle]} />
    <Text style={[styles.rowTitle, props.titleStyle]}>{props.content}</Text>
  </View>
);
