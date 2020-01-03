import React, { Component } from 'react';
import { View } from 'react-native';
import GestureWrapper from '../../component/GestureWrapper';

const COMPONENT_TYPE = {
  _NONE: {
    id: -1,
    name: 'none'
  },
  GALLERY: {
    id: 0,
    name: 'gallery'
  },
  STUNNING_FUNCS: {
    id: 1,
    name: 'stunning'
  }
};
const DURATION_SHOW_GALLERY = 300;
const BOTTOM_OFFFSET_GALLERY = HEIGHT - HEIGHT / 1.5;
const defaultListener = () => {};

class MasterToolBar extends Component {
  static propTypes = {};
  static defaultProps = {
    galleryProps: {
      setHeader: defaultListener,
      handleExpandedGallery: defaultListener,
      collapsedGallery: defaultListener,
      handleSendImage: defaultListener,
      handleToggleImage: defaultListener
    }
  };

  state = {
    selectedType: COMPONENT_TYPE._NONE
  };

  refImageGallery = React.createRef();
  refStunningFunctions = React.createRef();
  refGestureWrapper = React.createRef();

  getRef(typeId) {
    switch (typeId) {
      case COMPONENT_TYPE.GALLERY.id:
        return {
          refGallery: this.refImageGallery,
          refGesture: this.refGestureWrapper
        };
      case COMPONENT_TYPE.STUNNING_FUNCS.id:
        return this.refStunningFunctions;
    }
  }

  handleCollapseGesturer = () => {
    this.setState({});
  };

  render() {
    const { galleryProps } = this.props;
    return (
      <GestureWrapper
        ref={inst => {
          this.refGestureWrapper.current = inst;
          this.props.refGestureWrapper(inst);
        }}
        visible={this.props.visible}
        expandContent={this.state.expandContent}
        isActivePanResponder={
          !this.state.openLightBox &&
          this.state.photos.length !== 0 &&
          (!this.state.scrollable || !this.state.expandContent)
        }
        onExpandedBodyContent={this.handleExpandedGallery}
        onCollapsedBodyContent={this.handleCollapsedGallery}
        onExpandingBodyContent={this.handleExpandingGallery}
        // onCollapsingBodyContent={this.handleCollapsingGallery}
        collapsedBodyHeight={this.props.baseViewHeight}
        defaultStatusBarColor={this.props.defaultStatusBarColor}
        // extraDatas={extraDatas}
        renderBefore={
          <HeaderContent
            translateY={translateY}
            albums={this.state.albums}
            onSelectAlbum={this.onSelectAlbum}
            iconSelectedAlbum={this.props.iconSelectedAlbum}
            chosenAlbumTitle={this.state.chosenAlbumTitle}
          />
        }
      >
        <ImageGallery
          ref={this.refImageGallery}
          // refGestureWrapper={this.refGestureWrapper}
          visible={this.state.selectedType.id === COMPONENT_TYPE.GALLERY.id}
          onCollapsingBodyContent={this.handleCollapseGesturer}
          //---function
          setHeader={galleryProps.setHeader}
          defaultStatusBarColor={galleryProps.defaultStatusBarColor}
          onExpandedBodyContent={galleryProps.handleExpandedGallery}
          onCollapsedBodyContent={galleryProps.collapsedGallery}
          onSendImage={galleryProps.handleSendImage}
          onToggleImage={galleryProps.handleToggleImage}
          //--const_primative
          baseViewHeight={BOTTOM_OFFFSET_GALLERY}
          durattionShowGallery={DURATION_SHOW_GALLERY}
        />
      </GestureWrapper>
    );
  }
}

export default MasterToolBar;
