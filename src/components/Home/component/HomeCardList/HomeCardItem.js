import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import Loading from '../../../Loading';
import Themes from 'src/Themes';

class HomeCardItem extends Component {
  state = {
    loading: false,
  };
  unmounted = false;
  homeThemes = Themes.getNameSpace('home');
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
    const shadowStyle = this.homeThemes('styles.home.shadow_wrapper');
    return (
      <Button
        disabled={this.state.loading}
        onPress={this.handlePress}
        containerStyle={[
          styles.containerBtn,
          {
            marginRight: props.last ? 16 : 0,
          },
        ]}>
        <View style={[styles.container, shadowStyle, props.containerStyle]}>
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
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 7.5,
  },
  container: {
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 120,
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
    fontWeight: 'bold',
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
