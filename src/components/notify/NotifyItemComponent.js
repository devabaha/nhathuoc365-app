/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
// helpers
import {getRelativeTime} from 'app-helper/social';
import {getTheme} from 'src/Themes/Theme.context';
import {hexToRgba} from 'app-helper/';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {TypographyType} from 'src/components/base';
// custom components
import Loading from 'src/components/Loading';
import {BaseButton, Typography, Container} from 'src/components/base';
import Image from 'src/components/Image';

const IMAGE_DIMENSIONS = 70;

class NotifyItemComponent extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    onPress: () => {},
  };

  state = {
    isRead: this.props.isRead,
    loading: false,
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.image !== this.props.image ||
      nextProps.title !== this.props.title ||
      nextProps.shopName !== this.props.shopName ||
      nextProps.created !== this.props.created ||
      nextProps.content !== this.props.content
    ) {
      return true;
    }

    return false;
  }

  handlePressNotify = () => {
    const service = {
      callback: () => this.setState({loading: true}),
    };

    this.props.onPress(service, () => {
      this.setState({loading: false});
    });

    setTimeout(() => this.setState({isRead: true}), 1000);
  };

  get loadingWrapperStyle() {
    return mergeStyles(styles.loadingWrapper, {
      backgroundColor: this.theme.color.overlay30,
    });
  }

  get isNotReadNotifyStyle() {
    return mergeStyles(styles.isNotReadNotify, {
      backgroundColor: hexToRgba(this.theme.color.primaryHighlight, 0.2),
    });
  }

  get itemImageStyle() {
    return mergeStyles(styles.store_result_item_image_box, {
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidthSmall,
    });
  }

  get subTitleStyle() {
    return {
      color: this.theme.color.textInactive,
    };
  }

  render() {
    return (
      <Container>
        {this.state.loading && (
          <Loading
            center
            size="small"
            wrapperStyle={this.loadingWrapperStyle}
          />
        )}
        <BaseButton
          disabled={this.state.loading}
          useTouchableHighlight
          onPress={this.handlePressNotify}>
          <>
            <Animated.View style={[styles.store_result_item]}>
              {this.state.isRead == 0 && (
                <Animated.View style={this.isNotReadNotifyStyle} />
              )}
              <View style={this.itemImageStyle}>
                <Image
                  style={styles.store_result_item_image}
                  source={{uri: this.props.image}}
                />
              </View>

              <View style={styles.store_result_item_content}>
                <View style={styles.store_result_item_content_box}>
                  {!!this.props.title && (
                    <Typography
                      type={TypographyType.TITLE_MEDIUM}
                      numberOfLines={2}
                      style={styles.store_result_item_title}>
                      {this.props.title}
                    </Typography>
                  )}

                  {!!this.props.content && (
                    <Typography
                      type={TypographyType.LABEL_MEDIUM}
                      style={styles.store_result_item_desc}>
                      {this.props.content}
                    </Typography>
                  )}
                  <Container noBackground row style={styles.subTitleContainer}>
                    <Typography
                      type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                      numberOfLines={1}
                      style={this.subTitleStyle}>
                      {getRelativeTime(this.props.created)}
                    </Typography>
                  </Container>
                </View>
              </View>
            </Animated.View>
          </>
        </BaseButton>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loadingWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
  },

  store_result_item: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  isNotReadNotify: {
    ...StyleSheet.absoluteFillObject,
  },

  store_result_item_image_box: {
    width: IMAGE_DIMENSIONS,
    height: IMAGE_DIMENSIONS,
    borderRadius: IMAGE_DIMENSIONS / 2,
    overflow: 'hidden',
    marginRight: 15,
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  store_result_item_content: {
    flex: 1,
    alignSelf: 'center',
  },
  store_result_item_content_box: {
    // flex: 1,
  },
  store_result_item_title: {
    fontWeight: '600',
  },
  store_result_item_desc: {
    fontWeight: '500',
  },

  subTitleContainer: {
    flexWrap: 'wrap',
    marginTop: 10,
  },
});

export default NotifyItemComponent;
