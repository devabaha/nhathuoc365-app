import React, { Component } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
// librarys
import appConfig from 'app-config';
import TickidChat from '../../../../packages/tickid-chat';
import { default as DetailCard } from '../Card';

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

  componentDidMount() {
    setTimeout(() => (this.stopTracking = true), 800);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleHeaderLayout = e => {
    if (!this.stopTracking) {
      const height = e.nativeEvent.layout.height;
      this.setState({
        headerHeight: height
      });
    }
  };

  renderHeader = () => {
    const animatedHeaderStyle = this.state.headerHeight && {
      transform: [
        {
          translateY: this.state.animatedListScroll.interpolate({
            inputRange: [0, this.state.headerHeight],
            outputRange: [0, -this.state.headerHeight],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    return this.props.headerData ? (
      <DetailCard
        onContainerLayout={this.handleHeaderLayout}
        containerStyle={[styles.header, animatedHeaderStyle]}
        request={this.props.headerData}
        onPressLayout={() => {
          if (this.refTickidChat) {
            this.refTickidChat.onListViewPress();
          }
        }}
      />
    ) : (
      !this.props.loading && (
        <Text styles={styles.emptyText}>Không có thông tin phản ánh</Text>
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
            onSendImage={this.handleSendImage}
            onUploadedImage={
              response => {}
              //   this._onSend({ image: response.data.name })
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
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    padding: 15,
    paddingBottom: 0
  }
});

export default withTranslation()(observer(Comments));
