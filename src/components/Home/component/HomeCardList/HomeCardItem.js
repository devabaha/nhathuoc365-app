import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Loading from '../../../Loading';

import appConfig from 'app-config';

class HomeCardItem extends Component {
  state = {
    loading: false,
  };
  unmounted = false;
  handlePress = () => {
    if (!!this.props.selfRequest) {
      this.setState({
        loading: true,
      });
      this.handleSelfRequest();
    } else {
      this.props.onPress();
    }
  };

  handleSelfRequest = () => {
    this.props.selfRequest(() => {
      !this.unmounted && this.setState({loading: false});
    });
  };

  render() {
    const props = this.props;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          disabled={this.state.loading}
          onPress={this.handlePress}
          style={[styles.containerBtn]}>
          <ImageBackground
            style={[styles.image, props.imageStyle]}
            source={{uri: props.imageUrl}}>
            {this.state.loading && (
              <Loading color="#fff" containerStyle={styles.loading} />
            )}
          </ImageBackground>
          <View style={[styles.titleWrapper, props.textWrapperStyle]}>
            <Text numberOfLines={2} style={styles.title}>
              {props.title}
            </Text>
            {!!props.subTitle && (
              <Text style={styles.subTitle}>
                {this.props.iconSubTitle}
                {!!this.props.iconSubTitle && ` `}
                <Text style={styles.specialSubTitle}>
                  {props.specialSubTitle}
                </Text>
                {props.subTitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'column',
    flex: 1,
    ...appConfig.styles.shadow,
  },
  container: {
    marginHorizontal: 7.5,
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 280 / 1.91,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    padding: 15,
    // paddingVertical: 15,
  },
  title: {
    ...appConfig.styles.typography.heading3,
  },
  specialSubTitle: {
    ...appConfig.styles.typography.heading1,
    color: appConfig.colors.highlight[1],
  },
  subTitle: {
    marginTop: 5,
    ...appConfig.styles.typography.text,
  },
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});

HomeCardItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  last: PropTypes.bool,
};

HomeCardItem.defaultProps = {
  title: '',
  imageUrl: '',
  last: false,
};

export default HomeCardItem;
