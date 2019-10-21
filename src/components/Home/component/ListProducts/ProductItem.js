import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { View, Text, Image, StyleSheet } from 'react-native';

class ProductItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.string,
    price_view: PropTypes.string,
    onPress: PropTypes.func,
    last: PropTypes.bool
  };

  static defaultProps = {
    name: '',
    image: '',
    price_view: '',
    onPress: () => {},
    last: false
  };

  render() {
    return (
      <Button
        onPress={this.props.onPress}
        containerStyle={{
          marginRight: this.props.last ? 16 : 0
        }}
      >
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: this.props.image }} />
          <View style={styles.infoWrapper}>
            <Text style={styles.name}>{this.props.name}</Text>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>{this.props.price_view}</Text>
            </View>
          </View>
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    marginLeft: 16
  },
  image: {
    height: 116,
    resizeMode: 'cover',
    borderRadius: 8
  },
  infoWrapper: {
    marginTop: 8,
    alignItems: 'flex-start'
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500'
  },
  priceWrapper: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(85, 185, 71, 1)'
  },
  price: {
    color: '#fff'
  }
});

export default ProductItem;
