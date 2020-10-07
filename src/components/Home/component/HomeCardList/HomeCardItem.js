import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Loading from '../../../Loading';

class HomeCardItem extends Component {
  state = {
    loading: false
  };
  unmounted = false;

  handlePress = () => {
    if (this.props.selfRequest) {
      this.setState({
        loading: true
      });
      this.handleSelfRequest();
    } else {
      this.props.onPress();
    }
  };

  handleSelfRequest = () => {
    this.props.selfRequest(() => {
      !this.unmounted && this.setState({ loading: false });
    });
  };

  render() {
    const props = this.props;
    return (
      <Button
        disabled={this.state.loading}
        onPress={this.handlePress}
        containerStyle={[
          styles.containerBtn,
          {
            marginRight: props.last ? 16 : 0
          }
        ]}
      >
        <View style={[styles.container, props.containerStyle]}>
          <ImageBackground
            style={[styles.image, props.imageStyle]}
            source={{ uri: props.imageUrl }}
          >
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
    marginLeft: 16
  },
  container: {
    width: 210
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleWrapper: {
    marginTop: 10
  },
  title: {
    fontSize: 14,
    fontWeight: '500'
  },
  specialSubTitle: {
    fontWeight: '600',
    color: '#00b140'
  },
  subTitle: {
    fontSize: 12,
    marginTop: 3,
    color: '#444'
  },
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.5)'
  }
});

HomeCardItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  last: PropTypes.bool
};

HomeCardItem.defaultProps = {
  title: '',
  imageUrl: '',
  last: false
};

export default HomeCardItem;
