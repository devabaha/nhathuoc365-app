import React, {Component, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
} from 'react-native';
import {InputToolbar} from 'react-native-gifted-chat';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from 'src/components/Layout/Container';
import appConfig from 'app-config';
import {
  PREVIEW_IMAGES_BAR_HEIGHT,
  PREVIEW_IMAGE_HEIGHT,
  REPLYING_BAR_HEIGHT,
  PADDING_IMAGE_HEIGHT,
} from 'src/constants/social/comments';
import {TouchableOpacity as GestureTouchableOpacity} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  replyWrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  separator: {
    ...elevationShadowStyle(3),
    top: -1,
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#fff',
    zIndex: -1,
  },
  mainContentContainer: {
    zIndex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  replyingContainer: {
    height: REPLYING_BAR_HEIGHT,
  },
  replyingPrefix: {
    flex: 1,
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  replyingName: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  closeIconContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: -15,
  },
  closeIcon: {
    color: '#666',
    fontSize: 14,
  },
  replyingSeparator: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#eee',
    bottom: 5,
  },

  previewImagesContainer: {
    paddingVertical: PADDING_IMAGE_HEIGHT,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  previewImageContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  previewImage: {
    borderRadius: 8,
  },
  closeImageContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#666',
    padding: 5,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  mentionContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    // backgroundColor: hexToRgba(appConfig.colors.primary, 0.28),
    borderRadius: 4,
    marginLeft: 7,
    marginRight: -5,
  },
  mention: {
    // color: '#fff',
    color: appConfig.colors.primary,
    fontWeight: '500',
  },
});

class CustomInputToolbar extends Component {
  state = {
    toolbarHeight: 44,
    isKeyboardShowing: false,
  };
  unmounted = false;

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.unmounted = true;
    Keyboard.removeListener(this.handleKeyboardDidShow);
    Keyboard.removeListener(this.handleKeyboardDidHide);
  }

  handleKeyboardDidShow = (e) => {
    !this.unmounted && this.setState({isKeyboardShowing: true});
  };

  handleKeyboardDidHide = (e) => {
    !this.unmounted && this.setState({isKeyboardShowing: false});
  };

  handleLayout = (e) => {
    if (this.state.isKeyboardShowing && !this.unmounted) {
      this.setState({toolbarHeight: e.nativeEvent.layout.height});
    }
  };

  handleCancelReplying = () => {
    this.props.onCancelReplying();
  };

  renderPreviewImages(images) {
    return (
      <Container row style={styles.previewImagesContainer}>
        {images.map((image, index) => {
          const aspectRatio = (image.width || 1) / (image.height || 1);
          return (
            <Container row style={styles.previewImageContainer} key={index}>
              <Image
                source={{uri: image.uri}}
                style={[
                  styles.previewImage,
                  {
                    flex: 1,
                    aspectRatio,
                    maxHeight: PREVIEW_IMAGE_HEIGHT,
                    maxWidth: PREVIEW_IMAGE_HEIGHT * aspectRatio,
                  },
                ]}
              />
              <GestureTouchableOpacity
                style={[styles.closeImageContainer]}
                onPress={() => this.props.onCancelPreviewImage(image)}>
                <AntDesignIcon name="close" style={styles.closeIcon} />
              </GestureTouchableOpacity>
            </Container>
          );
        })}
      </Container>
    );
  }

  renderMention(replyingMentionName) {
    return (
      !!replyingMentionName && (
        <View style={styles.mentionContainer}>
          <Text style={styles.mention}>{replyingMentionName}</Text>
        </View>
      )
    );
  }

  render() {
    const {t} = this.props;
    const replyingName = this.props.replyingName;
    const replyingUserId = this.props.replyingUserId;
    const replyingMentionName = this.props.replyingMentionName;
    const previewImages =
      !!this.props.previewImages?.length && this.props.previewImages;
    const hasReplyingContent = replyingUserId || previewImages;
    const top =
      (!!replyingUserId ? -39 : 0) -
      (!!previewImages ? PREVIEW_IMAGES_BAR_HEIGHT : 0);

    return (
      <>
        <InputToolbar
          {...this.props}
          renderActions={() => {
            return (
              <>
                {!!hasReplyingContent && (
                  <Container
                    onStartShouldSetResponder={() => false}
                    onStartShouldSetResponderCapture={() => true}
                    style={[styles.replyWrapper, {top}]}
                    centerVertical={false}>
                    <View style={styles.separator} />
                    <View style={styles.mainContentContainer}>
                      {!!replyingUserId && (
                        <>
                          <Container row style={styles.replyingContainer}>
                            <Text
                              numberOfLines={1}
                              style={styles.replyingPrefix}>
                              {t('replying')}{' '}
                              <Text style={styles.replyingName}>
                                {replyingName}
                              </Text>
                            </Text>
                            <GestureTouchableOpacity
                              hitSlop={HIT_SLOP}
                              style={styles.closeIconContainer}
                              onPress={this.handleCancelReplying}>
                              <AntDesignIcon
                                name="close"
                                style={styles.closeIcon}
                              />
                            </GestureTouchableOpacity>
                          </Container>
                          <View style={styles.replyingSeparator} />
                        </>
                      )}
                      {!!previewImages &&
                        this.renderPreviewImages(previewImages)}
                    </View>
                  </Container>
                )}
                <Container row>
                  {this.props.renderActions()}
                  {/* {this.renderMention(replyingMentionName)} */}
                </Container>
              </>
            );
          }}
        />
      </>
    );
  }
}

export default withTranslation(['social', 'account'])(
  observer(CustomInputToolbar),
);
