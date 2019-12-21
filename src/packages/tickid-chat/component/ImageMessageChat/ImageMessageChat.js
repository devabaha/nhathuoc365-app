import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';
// import ProgressPie from 'react-native-progress/Pie';
import Lightbox from 'react-native-lightbox';
// import { createImageProgress } from 'react-native-image-progress';
// import FastImage from 'react-native-fast-image';

// const Image = createImageProgress(FastImage);
class ImageMessageChat extends Component {
  static propTypes = {
    lowQualityUri: PropTypes.string.isRequired,
    highQualityUri: PropTypes.string
  };
  static defaultProps = {
    highQualityUri: ''
  };
  state = {
    isOpenLightBox: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.lowQualityUri !== this.props.lowQualityUri ||
      nextProps.highQualityUri !== this.props.highQualityUri
    ) {
      return true;
    }

    return false;
  }

  handleOpen() {
    this.setState({ isOpenLightBox: true });
  }

  handleWillClose() {
    this.setState({ isOpenLightBox: false });
  }

  render() {
    const lowQualityUri = this.props.lowQualityUri;
    const highQualityUri =
      this.props.highQualityUri || this.props.lowQualityUri;
    return (
      <View style={styles.image}>
        <Lightbox
          springConfig={{ overshootClamping: true }}
          onOpen={this.handleOpen.bind(this)}
          willClose={this.handleWillClose.bind(this)}
        >
          <Image
            resizeMode={this.state.isOpenLightBox ? 'contain' : 'cover'}
            source={{
              uri: this.state.isOpenLightBox ? highQualityUri : lowQualityUri
            }}
            // indicator={ProgressPie}
            // indicatorProps={{
            //   size: 30,
            //   borderWidth: 0,
            //   color: 'rgba(150, 150, 150, 1)',
            //   unfilledColor: 'rgba(200, 200, 200, 0.2)'
            // }}
            style={{ width: '100%', height: '100%' }}
          />
        </Lightbox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    overflow: 'hidden'
  },
  imageActive: {
    flex: 1
  }
});

export default ImageMessageChat;
