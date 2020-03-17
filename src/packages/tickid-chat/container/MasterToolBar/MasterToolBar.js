import React, { Component } from 'react';
import { Animated } from 'react-native';

import GestureWrapper from '../../component/GestureWrapper';
import {
  COMPONENT_TYPE,
  BOTTOM_OFFSET_GALLERY,
  DURATION_SHOW_GALLERY,
  HAS_NOTCH,
  ANDROID_STATUS_BAR_HEIGHT
} from '../../constants';
import ImageGallery from '../ImageGallery';
import PropTypes from 'prop-types';
import PinList from '../PinList';

const defaultListener = () => {};
const ITEMS_PER_ROW = 4;

class MasterToolBar extends Component {
  static propTypes = {
    selectedType: PropTypes.object,
    visible: PropTypes.bool,
    baseViewHeight: PropTypes.number,
    durationShowGallery: PropTypes.number,
    galleryProps: PropTypes.exact({
      defaultStatusBarColor: PropTypes.string,
      setHeader: PropTypes.func,
      onExpandedBodyContent: PropTypes.func,
      onCollapsingBodyContent: PropTypes.func,
      onCollapsedBodyContent: PropTypes.func,
      onSendImage: PropTypes.func,
      onToggleImage: PropTypes.func
    }),
    pinListProps: PropTypes.exact({
      pinList: PropTypes.array,
      itemsPerRow: PropTypes.number,
      onPinPress: PropTypes.func,
      pinListNotify: PropTypes.object
    }),
    extraData: PropTypes.any,
    extraHeight: PropTypes.number
  };
  static defaultProps = {
    selectedType: COMPONENT_TYPE._NONE,
    visible: false,
    baseViewHeight: BOTTOM_OFFSET_GALLERY,
    durationShowGallery: DURATION_SHOW_GALLERY,
    galleryProps: {
      defaultStatusBarColor: '#000',
      setHeader: defaultListener,
      onExpandedBodyContent: defaultListener,
      onCollapsingBodyContent: defaultListener,
      onCollapsedBodyContent: defaultListener,
      onSendImage: defaultListener,
      onToggleImage: defaultListener
    },
    pinListProps: {
      pinList: [],
      itemsPerRow: ITEMS_PER_ROW,
      onPinPress: defaultListener,
      pinListNotify: {}
    },
    extraData: null
  };

  state = {
    isActivePanResponder: false,
    expandContent: false,
    selectedType: this.props.selectedType,
    galleryChangingEffect: new Animated.Value(0),
    pinChangingEffect: new Animated.Value(0)
  };
  unmounted = false;

  refImageGallery = React.createRef();
  refPin = React.createRef();
  refGestureWrapper = React.createRef();
  animatedValue = 0;

  getAnimatedEffectValue = type => {
    animatedValue = this.getAnimatedComponentValue(type);
    return animatedValue;
  };

  getAnimatedComponentValue = type => {
    switch (type) {
      case COMPONENT_TYPE.GALLERY:
        return this.state.galleryChangingEffect;
      case COMPONENT_TYPE.PIN:
        return this.state.pinChangingEffect;
      default:
        return this.state.galleryChangingEffect;
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selectedType !== this.props.selectedType &&
      nextProps.selectedType !== COMPONENT_TYPE._NONE
    ) {
      const animatePrevValue = this.getAnimatedComponentValue(
        this.props.selectedType
      );
      const animateNextValue = this.getAnimatedComponentValue(
        nextProps.selectedType
      );

      Animated.spring(animatePrevValue, {
        toValue: nextProps.baseViewHeight + nextProps.extraHeight,
        // (HAS_NOTCH ? ANDROID_STATUS_BAR_HEIGHT : 0),
        overshootClamping: true,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        animatePrevValue.setValue(0);
        this.setState({
          selectedType: nextProps.selectedType
        });
      });
      animateNextValue.setValue(0);
    }

    if (
      nextState.isActivePanResponder !== this.state.isActivePanResponder ||
      nextState.expandContent !== this.state.expandContent ||
      nextState.selectedType !== this.state.selectedType
    ) {
      return true;
    }

    if (
      nextProps.visible !== this.props.visible ||
      nextProps.selectedType !== this.props.selectedType ||
      nextProps.pinListProps.pinListNotify !==
        this.props.pinListProps.pinListNotify ||
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
      nextProps.extraHeight !== this.props.extraHeight ||
      nextProps.extraData !== this.props.extraData ||
      nextProps.durationShowGallery !== this.props.durationShowGallery
    ) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getComponentRef(typeId) {
    switch (typeId) {
      case COMPONENT_TYPE.GALLERY.id:
        return {
          refGallery: this.refImageGallery,
          refGesture: this.refGestureWrapper
        };
      case COMPONENT_TYPE.PIN.id:
        return this.refPin;
    }
  }

  handleChangePanResponderStatus = isActivePanResponder => {
    this.setState({ isActivePanResponder });
  };

  handleVisibleAnimation = visible => {
    if (!visible) this.props.galleryProps.onCollapsedBodyContent();
  };

  handleCollapsingGesture = () => {
    this.setState({ expandContent: false });
    this.props.galleryProps.onCollapsingBodyContent();
  };

  handleExpandingGallery = () => {
    this.setState({ expandContent: true });
  };

  handleSendImage = images => {
    this.handleCollapsingGesture();
    this.props.galleryProps.onSendImage(images);
  };

  handlePinPress = pin => {
    this.props.pinListProps.onPinPress(pin);
  };

  render() {
    console.log('* render master');
    const { galleryProps, pinListProps } = this.props;
    const extraData =
      this.state.selectedType.id +
      '|' +
      JSON.stringify(this.props.pinListProps.pinListNotify);
    return (
      <GestureWrapper
        ref={this.refGestureWrapper}
        visible={this.props.visible}
        extraData={extraData}
        extraHeight={this.props.extraHeight}
        expandContent={this.state.expandContent}
        isActivePanResponder={
          this.state.isActivePanResponder &&
          this.props.selectedType === COMPONENT_TYPE.GALLERY
        }
        collapsedBodyHeight={this.props.baseViewHeight}
        defaultStatusBarColor={this.props.defaultStatusBarColor}
        onExpandedBodyContent={galleryProps.onExpandedBodyContent}
        onExpandingBodyContent={this.handleExpandingGallery}
        onFinishVisibleAnimation={this.handleVisibleAnimation}
      >
        <ImageGallery
          ref={this.refImageGallery}
          refGestureWrapper={this.refGestureWrapper}
          visible={this.state.selectedType.id === COMPONENT_TYPE.GALLERY.id}
          expandContent={this.state.expandContent}
          //---outsideProps-function
          setHeader={galleryProps.setHeader}
          defaultStatusBarColor={galleryProps.defaultStatusBarColor}
          onSendImage={this.handleSendImage}
          onToggleImage={galleryProps.onToggleImage}
          onCollapsingBodyContent={this.handleCollapsingGesture}
          //---insideProps-function
          onChangePanActivationStatus={this.handleChangePanResponderStatus}
          //--const_primative
          baseViewHeight={this.props.baseViewHeight}
          durationShowGallery={this.props.durationShowGallery}
          animatedEffectValue={this.getAnimatedEffectValue(
            COMPONENT_TYPE.GALLERY
          )}
        />
        <PinList
          baseViewHeight={this.props.baseViewHeight}
          extraHeight={this.props.extraHeight}
          visible={this.state.selectedType.id === COMPONENT_TYPE.PIN.id}
          pinList={pinListProps.pinList}
          itemsPerRow={pinListProps.itemsPerRow}
          animatedEffectValue={this.getAnimatedEffectValue(COMPONENT_TYPE.PIN)}
          onPinPress={this.handlePinPress}
          pinListNotify={pinListProps.pinListNotify}
        />
      </GestureWrapper>
    );
  }
}

export default MasterToolBar;
