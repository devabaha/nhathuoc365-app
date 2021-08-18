import React, {Component} from 'react';
import {StyleSheet, View, TouchableHighlight} from 'react-native';
import LightBox from 'react-native-lightbox';
import appConfig from 'app-config';
import Header from './Header';
import Image from 'src/components/Image'

class ImageItem extends Component {
  state = {
    isOpenLightBox: false,
  };

  handleOpen = () => {
    this.setState({isOpenLightBox: true});
  };

  handleWillClose = () => {
    this.setState({isOpenLightBox: false});
  };

  renderHeader = (close) => (
    <Header onClose={close} onDelete={this.props.onDelete} />
  );

  render() {
    const extraStyle = {
      marginBottom: this.props.originPadding,
      width: appConfig.device.width * 0.5 - this.props.originPadding / 2,
      height: appConfig.device.width * 0.5 - this.props.originPadding / 2,
    };
    return (
      <View style={[styles.container, extraStyle, this.props.style]}>
        {/* <LightBox
          springConfig={{ overshootClamping: true }}
          onOpen={this.handleOpen}
          willClose={this.handleWillClose}
          renderHeader={this.renderHeader}
        > */}
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.props.onPress}>
          <Image
            resizeMode={this.state.isOpenLightBox ? 'contain' : 'cover'}
            style={{width: '100%', height: '100%'}}
            source={{uri: this.props.img}}
          />
        </TouchableHighlight>
        {/* </LightBox> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});

export default ImageItem;
