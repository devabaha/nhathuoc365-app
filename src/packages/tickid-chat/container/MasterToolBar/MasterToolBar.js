import React, { Component } from 'react';
import { Animated } from 'react-native';

import GestureWrapper from '../../component/GestureWrapper';
import {
  COMPONENT_TYPE,
  BOTTOM_OFFSET_GALLERY,
  DURATION_SHOW_GALLERY
} from '../../constants';
import ImageGallery from '../ImageGallery';
import PropTypes from 'prop-types';
import PinList from '../PinList';
import { setStater } from '../../helper';

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
      itemsPerRow: PropTypes.number
    }),
    extraData: PropTypes.any
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
      itemsPerRow: ITEMS_PER_ROW
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
  animatedStyle = {};

  containerStyle = type => {
    const animatedValue = this.getAnimatedComponentValue(type);
    const animatedStyle = {
      transform: [{ translateY: animatedValue }]
    };
    return animatedStyle;
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
        toValue: nextProps.baseViewHeight,
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

    if (nextProps.visible !== this.props.visible) {
      const animatePrevValue = this.getAnimatedComponentValue(
        this.props.selectedType
      );
      this.setState(
        {
          selectedType: nextProps.selectedType
        },
        () => {
          animatePrevValue.setValue(0);
        }
      );
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
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
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

  render() {
    const { galleryProps, pinListProps } = this.props;
    console.log('* render master', this.state.expandContent);
    return (
      <GestureWrapper
        ref={this.refGestureWrapper}
        visible={this.props.visible}
        extraData={this.state.selectedType}
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
          containerStyle={this.containerStyle(COMPONENT_TYPE.GALLERY)}
        />
        <PinList
          baseViewHeight={this.props.baseViewHeight}
          visible={this.state.selectedType.id === COMPONENT_TYPE.PIN.id}
          pinList={pinListProps.pinList}
          itemsPerRow={pinListProps.itemsPerRow}
          containerStyle={this.containerStyle(COMPONENT_TYPE.PIN)}
        />
      </GestureWrapper>
    );
  }
}

export default MasterToolBar;
