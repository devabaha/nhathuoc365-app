import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// custom components
import Image from 'src/components/Image';
import {BaseButton} from 'src/components/base';

class ImageItem extends Component {
  state = {
    isOpenLightBox: false,
  };

  render() {
    const extraStyle = {
      marginBottom: this.props.originPadding,
      width: appConfig.device.width * 0.5 - this.props.originPadding / 2,
      height: appConfig.device.width * 0.5 - this.props.originPadding / 2,
    };

    return (
      <View style={[styles.container, extraStyle, this.props.style]}>
        <BaseButton useTouchableHighlight onPress={this.props.onPress}>
          <Image
            resizeMode={this.state.isOpenLightBox ? 'contain' : 'cover'}
            style={{width: '100%', height: '100%'}}
            source={{uri: this.props.img}}
          />
        </BaseButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});

export default ImageItem;
