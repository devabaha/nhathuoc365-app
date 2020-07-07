import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';
import { CachedImage, CustomCachedImage } from 'react-native-img-cache';
import Icon from 'react-native-vector-icons/AntDesign';
import PropTypes from 'prop-types';
import appConfig from 'app-config';
import Loading from '../Loading';

const AnimatedImageBackground = Animated.createAnimatedComponent(
  CustomCachedImage
);
const UNDERLAYCOLOR = 'rgba(0,0,0,.6)';
const defaultListener = () => {};

class HeaderStore extends Component {
  static propTypes = {
    active: PropTypes.bool,
    hideChat: PropTypes.bool,
    containerStyle: PropTypes.object,
    imageBgStyle: PropTypes.object,
    infoContainerStyle: PropTypes.object,
    bannerUrl: PropTypes.string,
    avatarUrl: PropTypes.string,
    onFollowPress: PropTypes.func,
    onChatPress: PropTypes.func,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    description: PropTypes.string
  };
  static defaultProps = {
    active: false,
    hideChat: false,
    containerStyle: {},
    imageBgStyle: {},
    infoContainerStyle: {},
    bannerUrl: '',
    avatarUrl: '',
    title: '',
    subTitle: '',
    description: '',
    onFollowPress: defaultListener,
    onChatPress: defaultListener
  };

  state = {
    animatedActive: new Animated.Value(0)
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.active !== this.props.active) {
      this.state.animatedActive.setValue(nextProps.active ? 0 : 1);
      Animated.timing(this.state.animatedActive, {
        toValue: nextProps.active ? 1 : 0,
        useNativeDriver: true,
        easing: Easing.in,
        duration: 200
      }).start();
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.imageBgStyle !== this.props.imageBgStyle ||
      nextProps.infoContainerStyle !== this.props.infoContainerStyle ||
      nextProps.bannerUrl !== this.props.bannerUrl ||
      nextProsp.avatarUrl !== this.props.avatarUrl ||
      nextProps.title !== this.props.title ||
      nextProps.subTitle !== this.props.subTitle ||
      nextProps.description !== this.props.description ||
      nextProps.active !== this.props.active
    ) {
      return true;
    }

    return false;
  }

  render() {
    const { t } = this.props;
    const inputProps = {
      // numberOfLines: 2
    };
    const followMess = this.props.active
      ? t('header.following')
      : t('header.follow');
    const activeStyle = {
      backgroundColor: appConfig.colors.primary,
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: this.state.animatedActive
    };
    return (
      <Animated.View style={[styles.container, this.props.containerStyle]}>
        <TouchableWithoutFeedback
          onPress={!this.props.bannerDisabled && this.props.onPressBanner}
        >
          <View style={this.props.wrapperStyle}>
            <AnimatedImageBackground
              component={ImageBackground}
              style={[styles.cachedImg, this.props.imageBgStyle]}
              source={{ uri: this.props.bannerUrl }}
              resizeMode="cover"
            >
              {!!this.props.bannerLoading && (
                <Loading
                  style={{ height: '100%', backgroundColor: 'rgba(0,0,0,.3)' }}
                />
              )}
              <View style={styles.overlay} />
              <Animated.View
                style={[styles.maskOverlay, this.props.maskStyle]}
              />
            </AnimatedImageBackground>

            <Animated.View
              style={[styles.headerInfo, this.props.infoContainerStyle]}
            >
              <View style={styles.headerInfoWrapper}>
                <View style={styles.left}>
                  <TouchableWithoutFeedback
                    onPress={
                      !this.props.avatarDisabled && this.props.onPressAvatar
                    }
                  >
                    <View style={styles.avatarContainer}>
                      {!!this.props.avatarLoading && (
                        <Loading
                          style={{
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,.3)'
                          }}
                        />
                      )}
                      <CachedImage
                        style={styles.avatar}
                        source={{ uri: this.props.avatarUrl }}
                        mutable
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.info}>
                    <Text numberOfLines={2} style={styles.title}>
                      {this.props.title}
                    </Text>
                    <Text {...inputProps} style={styles.subTitle}>
                      {this.props.subTitle}
                    </Text>
                    {!!this.props.description && (
                      <Text {...inputProps} style={styles.description}>
                        {this.props.description}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.right}>
                  {this.props.active !== null && (
                    <TouchableHighlight
                      underlayColor={UNDERLAYCOLOR}
                      onPress={this.props.onPressFollow}
                      style={[
                        styles.btn,
                        styles.topBtn,
                        this.props.active && {
                          backgroundColor: appConfig.colors.primary,
                          borderColor: appConfig.colors.primary
                        }
                      ]}
                    >
                      <>
                        <Animated.View style={activeStyle} />
                        <View style={[styles.btnInfo]}>
                          <Icon
                            name={this.props.active ? 'minus' : 'plus'}
                            style={styles.icon}
                          />
                          <Text numberOfLines={1} style={styles.btnText}>
                            {followMess}
                          </Text>
                        </View>
                      </>
                    </TouchableHighlight>
                  )}

                  {!this.props.hideChat && (
                    <View style={[styles.btn, styles.bottomBtn]}>
                      <TouchableHighlight
                        underlayColor={UNDERLAYCOLOR}
                        onPress={this.props.onPressChat}
                        style={[styles.btn]}
                      >
                        <View style={[styles.btnInfo]}>
                          <Icon name="message1" style={styles.icon} />
                          <Text style={styles.btnText}>{t('header.chat')}</Text>
                        </View>
                      </TouchableHighlight>
                      {!!this.props.unreadChat && (
                        <View style={[styles.badge]}>
                          <Text style={styles.notiMess}>
                            {this.props.unreadChat}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        {this.props.extraComponent}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff'
  },
  overlay: {
    backgroundColor: 'rgba(59,52,70, .65)',
    position: 'absolute',
    flex: 1,
    zIndex: 0,
    width: '100%',
    height: '100%'
  },
  maskOverlay: {
    backgroundColor: appConfig.colors.primary,
    position: 'absolute',
    flex: 1,
    zIndex: 0,
    width: '100%',
    height: '100%',
    opacity: 0
  },
  cachedImg: {
    width: '100%',
    height: '100%'
  },
  headerInfo: {
    width: '100%',
    height: '100%',
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 50
  },
  headerInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  right: {
    paddingHorizontal: 15
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 0.5,
    overflow: 'hidden',
    borderColor: '#f1f1f1',
    backgroundColor: '#f1f1f1',
    marginRight: 10
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  info: {
    flex: 1
  },
  title: {
    fontWeight: '500',
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  subTitle: {
    fontWeight: '300',
    color: '#eaeaea',
    fontSize: 13,
    marginBottom: 3
  },
  description: {
    fontWeight: '400',
    color: '#fff',
    fontSize: 13
  },
  btn: {
    borderRadius: 4,
    borderColor: '#fff',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    height: 30,
    width: 100
  },
  btnInfo: {
    maxWidth: 150,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10
  },
  topBtn: {},
  bottomBtn: {
    marginTop: 10,
    overflow: 'visible',
    borderWidth: 0,
    height: null
  },
  btnText: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 13,
    maxWidth: 60,
    textAlign: 'center'
  },
  icon: {
    color: '#fff',
    fontSize: 12,
    marginRight: 5
  },
  badge: {
    borderRadius: 13,
    maxWidth: 30,
    height: 19,
    right: -8,
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 7,
    position: 'absolute',
    zIndex: 1
  },
  notiMess: {
    color: 'white',
    fontSize: 10
  }
});

export default withTranslation('stores')(HeaderStore);
