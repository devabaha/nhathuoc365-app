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
    ...appConfig.styles.shadow
  },
  container: {
    marginTop: 10,
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
    paddingHorizontal: 5,
    paddingLeft: 8,
    paddingVertical: 15,
  },
  title: {
    fontSize: 15,
  },
  specialSubTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#00b140',
  },
  subTitle: {
    fontSize: 14,
    marginTop: 5,
    color: '#444',
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
