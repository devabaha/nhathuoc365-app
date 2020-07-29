import React, { Component } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
// librarys
import appConfig from 'app-config';
import TickidChat from '../../../../packages/tickid-chat';
import { default as DetailCard } from '../Card';
import { languages } from '../../../../i18n/constants';

const UPLOAD_URL = APIHandler.url_user_upload_image();

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headerHeight: 0,
      animatedListScroll: new Animated.Value(0),

      messages: null,
      showImageGallery: false,
      editable: false,
      showImageBtn: true,
      showSendBtn: false,
      showBackBtn: false,
      selectedImages: [],
      uploadImages: []
    };
    this.unmounted = false;
    this.refListMessages = null;
    this.refGiftedChat = null;
    this.refTickidChat = null;
    this.giftedChatExtraProps = {};
  }

  get giftedChatProps() {
    this.giftedChatExtraProps.user = { _id: this.props.user._id };
    this.giftedChatExtraProps.locale =
      languages[this.props.i18n.languages].locale;
    this.giftedChatExtraProps.renderAvatar = null;

    return this.giftedChatExtraProps;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.user !== this.props.user ||
      nextProps.headerData !== this.props.headerData ||
      nextProps.loading !== this.props.loading ||
      nextProps.comments !== this.props.comments
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

  handleHeaderLayout = e => {
    if (!this.stopTracking || !this.state.headerHeight) {
      const height = e.nativeEvent.layout.height;
      this.setState({
        headerHeight: height
      });
    }
  };

  handleForceCloseKeyboard = () => {
    if (this.refTickidChat) {
      this.refTickidChat.collapseComposer();
    }
  };

  renderHeader = () => {
    const animatedHeaderStyle = {
      transform: [
        {
          translateY: this.state.animatedListScroll.interpolate({
            inputRange: [0, this.state.headerHeight || 0.1],
            outputRange: [0, -this.state.headerHeight],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    return this.props.headerData ? (
      <DetailCard
        onFinishLayout={this.handleFinishLayout}
        onContainerLayout={this.handleHeaderLayout}
        containerStyle={[styles.header, animatedHeaderStyle]}
        request={this.props.headerData}
        forceCloseKeyboard={this.handleForceCloseKeyboard}
        onPressLayout={() => {
          if (this.refTickidChat) {
            this.refTickidChat.onListViewPress();
          }
        }}
      />
    ) : (
      !this.props.loading && (
        <Text style={styles.emptyText}>Không có thông tin phản ánh</Text>
      )
    );
  };

  render() {
    const { comments } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {comments !== null ? (
          <TickidChat
            // Root props
            renderEmpty={() => null}
            setHeader={this.props.setHeader}
            defaultStatusBarColor={appConfig.colors.primary}
            containerStyle={{ backgroundColor: 'transparent' }}
            placeholder="Nhập nội dung phản hồi..."
            // Refs
            ref={inst => (this.refTickidChat = inst)}
            refGiftedChat={inst => (this.refGiftedChat = inst)}
            refListMessages={inst => (this.refListMessages = inst)}
            // GiftedChat props
            giftedChatProps={this.giftedChatProps}
            useModalGallery
            messages={comments}
            onSendText={this.props.onSendText}
            renderScrollComponent={props => (
              <Animated.ScrollView
                {...props}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          y: this.state.animatedListScroll
                        }
                      }
                    }
                  ],
                  { useNativeDriver: true }
                )}
              />
            )}
            // Gallery props
            galleryVisible={false}
            uploadURL={UPLOAD_URL}
            onSendImage={this.props.onSendTempImage}
            onUploadedImage={response =>
              this.props.onSendImage({ image: response.data.name })
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
    backgroundColor: '#fff'
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    padding: 15,
    paddingBottom: 0
  },
  emptyText: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    padding: 15,
    color: '#666',
    fontStyle: 'italic'
  }
});

export default withTranslation()(observer(Comments));
