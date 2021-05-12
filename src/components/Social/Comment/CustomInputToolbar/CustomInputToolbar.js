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
import store from 'app-store';
import appConfig from 'app-config';
import {
  PREVIEW_IMAGES_BAR_HEIGHT,
  PREVIEW_IMAGE_HEIGHT,
  REPLYING_BAR_HEIGHT,
  PADDING_IMAGE_HEIGHT,
} from 'src/constants/social/comments';
import {reaction} from 'mobx';

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
    backgroundColor: '#fff',
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
    borderBottomWidth: .5,
    borderColor: '#eee'
  },
  previewImageContainer: {
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
    // backgroundColor: hexToRgbA(appConfig.colors.primary, 0.28),
    borderRadius: 4,
    marginLeft: 7,
    marginRight: -5,
  },
  mention: {
    // color: '#fff',
    color: appConfig.colors.primary,
    fontWeight: '500'
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
    store.setReplyingComment();
    store.setPreviewImages();
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
    store.setReplyingComment();
  };

  renderPreviewImages(images) {
    return (
      <Container row style={styles.previewImagesContainer}>
        {images.map((image, index) => {
          return (
            <Container row style={styles.previewImageContainer} key={index}>
              <Image
                source={{uri: image.uri}}
                style={[
                  styles.previewImage,
                  {
                    height: PREVIEW_IMAGE_HEIGHT,
                    width: PREVIEW_IMAGE_HEIGHT * (image.width / image.height),
                  },
                ]}
              />
              <TouchableOpacity
                style={[styles.closeImageContainer]}
                onPress={() => this.props.onCancelPreviewImage(image)}>
                <AntDesignIcon name="close" style={styles.closeIcon} />
              </TouchableOpacity>
            </Container>
          );
        })}
      </Container>
    );
  }

  renderMention(replyingMention) {
    return (
      !!replyingMention && (
        <View style={styles.mentionContainer}>
          <Text style={styles.mention}>{replyingMention}</Text>
        </View>
      )
    );
  }

  render() {
    const {t} = this.props;
    const replyingName = store.isReplyingYourSelf
      ? t('yourself')
      : store.replyingComment?.user?.name;
    const replyingMention =
      !store.isReplyingYourSelf && store.replyingMention?.name;
    const previewImages = !!store.previewImages?.length && store.previewImages;
    const hasReplyingContent = replyingName || previewImages;
    const top =
      (!!replyingName ? -39 : 0) -
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
                    style={[styles.replyWrapper, {top}]}
                    centerVertical={false}>
                    <View style={styles.separator} />
                    <View style={styles.mainContentContainer}>
                      {!!replyingName && (
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
                            <TouchableOpacity
                              hitSlop={HIT_SLOP}
                              style={styles.closeIconContainer}
                              onPress={this.handleCancelReplying}>
                              <AntDesignIcon
                                name="close"
                                style={styles.closeIcon}
                              />
                            </TouchableOpacity>
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
                  {this.renderMention(replyingMention)}
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
