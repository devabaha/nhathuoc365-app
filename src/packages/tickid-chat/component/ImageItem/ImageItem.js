import React, {Component} from 'react';
import {View, ViewPropTypes, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getColorTheme} from 'app-packages/tickid-chat/helper';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {isIos} from '../../constants';
import {TypographyType} from 'src/components/base';
// custom components
import Image from 'src/components/Image';
import {BaseButton, Typography} from 'src/components/base';

const defaultListener = () => {};

class ImageItem extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    onOpenLightBox: PropTypes.func,
    onCloseLightBox: PropTypes.func,
    source: PropTypes.any.isRequired,
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    isSelected: PropTypes.bool,
    onToggleItem: PropTypes.func,
    selectedMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };
  static defaultProps = {
    resizeMode: 'cover',
    containerStyle: {},
    onOpenLightBox: defaultListener,
    onCloseLightBox: defaultListener,
    onToggleItem: defaultListener,
    isSelected: false,
    selectedMessage: '',
  };
  state = {};

  lightBoxProps = {
    springConfig: {overshootClamping: true},
    style: styles.lightboxContainer,
    onOpen: this.props.onOpenLightBox,
    onClose: this.props.onCloseLightBox,
    activeProps: {resizeMode: 'contain'},
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (
      nextProps.resizeMode !== this.props.resizeMode ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.selectedMessage !== this.props.selectedMessage ||
      nextProps.source !== this.props.source
    ) {
      return true;
    }

    return false;
  }

  onSelectItem() {
    this.props.onToggleItem();
  }

  get selectedMaskStyle() {
    return mergeStyles(styles.selectedMask, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get selectedMessageStyle() {
    return {color: this.theme.color.white};
  }

  get shadowStyle() {
    return {backgroundColor: this.theme.color.overlay30};
  }

  get outerStyle() {
    return {borderColor: this.theme.color.white};
  }

  render() {
    const {
      containerStyle,
      resizeMode,
      source,
      isSelected,
      selectedMessage,
    } = this.props;

    return (
      <View style={[styles.imageItemContainer, containerStyle]}>
        <Image
          useNative={isIos}
          canTouch
          source={source}
          resizeMode={resizeMode}
          lightBoxProps={this.lightBoxProps}
        />
        {isSelected && (
          <View pointerEvents="none" style={this.selectedMaskStyle}></View>
        )}
        <BaseButton
          style={styles.imageTouchable}
          onPress={this.onSelectItem.bind(this)}>
          {isSelected && (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={[styles.selectedMessage, this.selectedMessageStyle]}>
              {selectedMessage}
            </Typography>
          )}
          <View
            style={[
              styles.selectTouchable,
              styles.outerStyle,
              this.outerStyle,
              {
                backgroundColor: isSelected
                  ? getColorTheme(this.theme).focusColor
                  : 'transparent',
              },
            ]}
          />

          <View
            pointerEvents="none"
            style={[styles.shadow, this.shadowStyle]}
          />
        </BaseButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageItemContainer: {
    flex: 1,
  },
  lightboxContainer: {
    width: '100%',
  },
  fastImage: {
    width: '100%',
    height: '100%',
  },
  selectedMask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imageTouchable: {
    borderRadius: 50,
    width: 30,
    height: 30,
    top: 12,
    right: 12,
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMessage: {
    position: 'absolute',
    fontWeight: '600',
    zIndex: 2,
  },
  shadow: {
    borderRadius: 50,
    width: '110%',
    height: '110%',
    position: 'absolute',
  },
  selectTouchable: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
  outerStyle: {
    zIndex: 1,
    borderWidth: 2,
  },
});

export default ImageItem;
