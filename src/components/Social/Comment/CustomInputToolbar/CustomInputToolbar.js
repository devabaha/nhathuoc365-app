import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
// 3-party libs
import {InputToolbar} from 'react-native-gifted-chat';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  PREVIEW_IMAGES_BAR_HEIGHT,
  PREVIEW_IMAGE_HEIGHT,
  REPLYING_BAR_HEIGHT,
  PADDING_IMAGE_HEIGHT,
} from 'src/constants/social/comments';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, IconButton, Typography} from 'src/components/base';
import Image from 'src/components/Image';

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
    top: -1,
    position: 'absolute',
    width: '100%',
    height: 2,
    zIndex: -1,
  },
  mainContentContainer: {
    zIndex: 1,
    paddingHorizontal: 15,
  },
  replyingContainer: {
    height: REPLYING_BAR_HEIGHT,
  },
  replyingPrefix: {
    flex: 1,
    fontStyle: 'italic',
  },
  replyingName: {
    fontWeight: '500',
  },
  closeIconContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: -15,
  },
  closeIcon: {
    fontSize: 14,
  },
  replyingSeparator: {
    width: '100%',
    height: 0.5,
    bottom: 5,
  },

  previewImagesContainer: {
    paddingVertical: PADDING_IMAGE_HEIGHT,
  },
  previewImageContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  previewImage: {
    flex: 1,
  },
  closeIconContainer: {
    padding: 5,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  mentionContainer: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 7,
    marginRight: -5,
  },
  mention: {
    fontWeight: '500',
  },
});

class CustomInputToolbar extends Component {
  static contextType = ThemeContext;

  state = {
    toolbarHeight: 44,
    isKeyboardShowing: false,
  };
  unmounted = false;

  get theme() {
    return getTheme(this);
  }

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
      <Container row style={this.previewImagesContainerStyle}>
        {images.map((image, index) => {
          const aspectRatio = (image.width || 1) / (image.height || 1);
          return (
            <Container row style={styles.previewImageContainer} key={index}>
              <Image
                source={{uri: image.uri}}
                style={[
                  this.previewImageStyle,
                  {
                    aspectRatio,
                    maxHeight: PREVIEW_IMAGE_HEIGHT,
                    maxWidth: PREVIEW_IMAGE_HEIGHT * aspectRatio,
                  },
                ]}
              />
              <IconButton
                useGestureHandler
                neutral
                style={this.closeImageContainerStyle}
                onPress={() => this.props.onCancelPreviewImage(image)}
                name="close"
                iconStyle={styles.closeIcon}
              />
            </Container>
          );
        })}
      </Container>
    );
  }

  renderMention(replyingMentionName) {
    return (
      !!replyingMentionName && (
        <View style={this.mentionContainerStyle}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_PRIMARY}
            style={styles.mention}>
            {replyingMentionName}
          </Typography>
        </View>
      )
    );
  }

  get previewImagesContainerStyle() {
    return mergeStyles(styles.previewImagesContainer, {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  get previewImageStyle() {
    return mergeStyles(styles.previewImage, {
      borderRadius: this.theme.layout.borderRadiusMedium,
    });
  }

  get closeImageContainerStyle() {
    return mergeStyles(styles.closeIconContainer, {
      borderRadius: this.theme.layout.borderRadiusHuge,
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    });
  }

  get replyingSeparatorStyle() {
    return mergeStyles(styles.replyingSeparator, {
      backgroundColor: this.theme.color.border,
    });
  }

  get mentionContainerStyle() {
    return mergeStyles(styles.mentionContainer, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
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
                    style={[styles.replyWrapper, {top}]}>
                    <Container shadow style={styles.separator} />
                    <Container style={styles.mainContentContainer}>
                      {!!replyingUserId && (
                        <>
                          <Container row style={styles.replyingContainer}>
                            <Typography
                              numberOfLines={1}
                              type={TypographyType.LABEL_SMALL_TERTIARY}
                              style={styles.replyingPrefix}>
                              {t('replying')}{' '}
                              <Typography
                                style={styles.replyingName}
                                type={TypographyType.LABEL_MEDIUM}>
                                {replyingName}
                              </Typography>
                            </Typography>
                            <IconButton
                              useGestureHandler
                              neutral
                              hitSlop={HIT_SLOP}
                              style={styles.closeIconContainer}
                              bundle={BundleIconSetName.IONICONS}
                              name="close"
                              iconStyle={styles.closeIcon}
                              onPress={this.handleCancelReplying}
                            />
                          </Container>
                          <View style={this.replyingSeparatorStyle} />
                        </>
                      )}
                      {!!previewImages &&
                        this.renderPreviewImages(previewImages)}
                    </Container>
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
