import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// custom components
import CameraPicker from '../CameraPicker';
import {ImageItem} from 'app-packages/tickid-chat/component';
import {BaseButton} from 'src/components/base';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ImageItemContainer extends Component<any> {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selectedPhotos.length !== this.props.selectedPhotos.length ||
      nextProps.photo !== this.props.photo ||
      nextProps.wrapperItemStyle !== this.props.wrapperItemStyle ||
      nextProps.iconCameraPicker !== this.props.iconCameraPicker ||
      nextProps.iconCameraOff !== this.props.iconCameraOff ||
      nextProps.permissionCameraGranted !== this.props.permissionCameraGranted
    ) {
      return true;
    }

    return false;
  }

  render() {
    const {photo, selectedPhotos} = this.props;
    const selectedIndex = selectedPhotos.findIndex((p) => p.id === photo.id);
    return (
      <BaseButton
        style={[styles.center, this.props.wrapperItemStyle]}
        onPress={() => {
          photo.path === 'camera' && this.props.captureImage();
        }}>
        <View style={{flex: 1, width: '100%', height: '100%'}}>
          {photo.path === 'camera' ? (
            <CameraPicker
              iconCameraPicker={this.props.iconCameraPicker}
              iconCameraOff={this.props.iconCameraOff}
              permissionGranted={this.props.permissionCameraGranted}
            />
          ) : (
            <ImageItem
              onOpenLightBox={this.props.onOpenLightBox}
              onCloseLightBox={this.props.onCloseLightBox}
              source={{
                uri: photo.path,
              }}
              onToggleItem={() =>
                this.props.onTogglePhoto(photo, selectedIndex)
              }
              isSelected={selectedIndex !== -1}
              selectedMessage={selectedIndex !== -1 ? selectedIndex + 1 : 0}
            />
          )}
        </View>
      </BaseButton>
    );
  }
}

export default ImageItemContainer;
