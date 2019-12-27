import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Text,
  ViewPropTypes,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import FastImage from 'react-native-fast-image';

const isAndroid = Platform.OS === 'android';
const defaultListener = () => {};

class ImageItem extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    onOpenLightBox: PropTypes.func,
    onCloseLightBox: PropTypes.func,
    source: PropTypes.any.isRequired,
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    isSelected: PropTypes.bool,
    onToggleItem: PropTypes.func,
    selectedMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };
  static defaultProps = {
    resizeMode: 'cover',
    containerStyle: {},
    onOpenLightBox: defaultListener,
    onCloseLightBox: defaultListener,
    onToggleItem: defaultListener,
    isSelected: false,
    selectedMessage: ''
  };
  state = {};

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

  render() {
    const {
      containerStyle,
      onOpenLightBox,
      onCloseLightBox,
      resizeMode,
      source,
      isSelected,
      selectedMessage
    } = this.props;

    return (
      <View style={[styles.imageItemContainer, { ...containerStyle }]}>
        <Lightbox
          springConfig={{ overshootClamping: true }}
          style={[styles.lightboxContainer]}
          onOpen={onOpenLightBox}
          onClose={onCloseLightBox}
          activeProps={{ resizeMode: 'contain' }}
        >
          {isAndroid ? (
            <FastImage
              source={source}
              style={[styles.fastImage]}
              resizeMode={resizeMode}
            />
          ) : (
            <Image
              source={source}
              style={[styles.fastImage]}
              resizeMode={resizeMode}
            />
          )}
        </Lightbox>
        {isSelected && (
          <View pointerEvents="none" style={[styles.selectedMask]}></View>
        )}
        <TouchableOpacity
          style={[styles.imageTouchable, styles.outerStyle]}
          onPress={this.onSelectItem.bind(this)}
        >
          {isSelected && (
            <Text style={[styles.selectedMessage]}>{selectedMessage}</Text>
          )}
          <View
            style={[
              styles.selectTouchable,
              {
                backgroundColor: isSelected ? 'blue' : 'rgba(0,0,0,.1)'
              }
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageItemContainer: {
    flex: 1,
    position: 'relative'
  },
  lightboxContainer: {
    width: '100%'
    // height: '100%'
  },
  fastImage: {
    width: '100%',
    height: '100%'
  },
  selectedMask: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.6)',
    position: 'absolute',
    top: 0,
    left: 0
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
    shadowColor: 'black',
    backgroundColor: 'rgba(0,0,0,0)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    elevation: 1,
    overflow: 'hidden'
  },
  selectedMessage: {
    position: 'absolute',
    color: 'white',
    fontWeight: '600',
    zIndex: 1
  },
  selectTouchable: {
    width: '100%',
    height: '100%'
  },
  outerStyle: {
    borderWidth: 2,
    borderColor: 'white'
  }
});

export default ImageItem;
