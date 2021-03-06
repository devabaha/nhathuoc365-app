import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import Reanimated, {Easing} from 'react-native-reanimated';
// configs
import appConfig from 'app-config';
// constants
import {languages} from 'src/i18n/constants';
import {TypographyType} from 'src/components/base';
// custom components
import TickidChat from 'app-packages/tickid-chat';
import {default as DetailCard} from '../Card';
import {Typography} from 'src/components/base';

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 0,
      animatedListScroll: new Reanimated.Value(0),

      messages: null,
      showImageGallery: false,
      editable: false,
      showImageBtn: true,
      showSendBtn: false,
      showBackBtn: false,
      selectedImages: [],
      uploadImages: [],
    };
    this.animatedTop = new Reanimated.Value(0);
    this.unmounted = false;
    this.refListMessages = null;
    this.refGiftedChat = null;
    this.refTickidChat = null;
    this.giftedChatExtraProps = {};
  }

  get giftedChatProps() {
    this.giftedChatExtraProps.user = {...this.props.user};
    this.giftedChatExtraProps.locale =
      languages[this.props.i18n.language].locale;
    this.giftedChatExtraProps.showUserAvatar = true;

    return this.giftedChatExtraProps;
  }

  get uploadURL() {
    return APIHandler.url_user_upload_image(store.store_id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.user !== this.props.user ||
      nextProps.request !== this.props.request ||
      nextProps.loading !== this.props.loading ||
      nextProps.comments !== this.props.comments ||
      nextProps.forceUpdate !== this.props.forceUpdate
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleFinishLayout = () => {
    this.stopTracking = true;
  };

  handleHeaderLayout = (e) => {
    if (!this.stopTracking || !this.state.headerHeight) {
      const height = e.nativeEvent.layout.height;
      this.setState({
        headerHeight: height,
      });
    }
  };

  handleForceCloseKeyboard = () => {
    if (this.refTickidChat) {
      this.refTickidChat.collapseComposer();
    }
  };

  handleInputState = (isFocus) => {
    Reanimated.timing(this.animatedTop, {
      toValue: isFocus ? -this.state.headerHeight / 5 : 0,
      duration: 300,
      easing: Easing.quad,
      // useNativeDriver: false,
    }).start();
  };

  renderHeader = () => {
    const animatedHeaderStyle = {
      top: this.animatedTop,
      transform: [
        {
          translateY: this.state.animatedListScroll.interpolate({
            // inputRange: [0, this.state.headerHeight || 0.1],
            inputRange: [0, 100],
            outputRange: [0, -this.state.headerHeight],
            extrapolate: 'clamp',
          }),
        },
      ],
    };

    return this.props.request ? (
      <DetailCard
        onFinishLayout={this.handleFinishLayout}
        onContainerLayout={this.handleHeaderLayout}
        containerStyle={[styles.header, animatedHeaderStyle]}
        request={this.props.request}
        forceCloseKeyboard={this.handleForceCloseKeyboard}
        onPressLayout={() => {
          if (this.refTickidChat) {
            this.refTickidChat.onListViewPress();
          }
        }}
        forceUpdate={this.props.forceUpdate}
      />
    ) : (
      !this.props.loading && (
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={styles.emptyText}>
          {this.props.t('noRequestInformation')}
        </Typography>
      )
    );
  };

  render() {
    const {comments} = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {comments !== null ? (
          <TickidChat
            // Root props
            showAllUserName
            renderEmpty={<View />}
            setHeader={this.props.setHeader}
            defaultStatusBarColor={appConfig.colors.primary}
            containerStyle={{backgroundColor: 'transparent'}}
            placeholder={this.props.t('request:enterMessage')}
            // Refs
            ref={(inst) => (this.refTickidChat = inst)}
            refGiftedChat={(inst) => (this.refGiftedChat = inst)}
            refListMessages={(inst) => (this.refListMessages = inst)}
            // GiftedChat props
            giftedChatProps={this.giftedChatProps}
            onComposerInputFocus={() => this.handleInputState(true)}
            onComposerInputBlur={() => this.handleInputState(false)}
            useModalGallery
            messages={comments}
            onSendText={this.props.onSendText}
            renderScrollComponent={(props) => (
              <Reanimated.ScrollView
                {...props}
                scrollEventThrottle={16}
                onScroll={Reanimated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          y: this.state.animatedListScroll,
                        },
                      },
                    },
                  ],
                  // {useNativeDriver: true},
                )}
              />
            )}
            // Gallery props
            galleryVisible={false}
            uploadURL={this.uploadURL}
            onSendImage={this.props.onSendTempImage}
            onUploadedImage={(response) =>
              this.props.onSendImage({image: response.data.name})
            }
            // Pin props
            pinListVisible={false}
          />
        ) : (
          <View style={styles.container}>
            <Indicator size="small" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    padding: 15,
    paddingBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    padding: 15,
    fontStyle: 'italic',
  },
});

export default withTranslation(['common', 'request'])(observer(Comments));
