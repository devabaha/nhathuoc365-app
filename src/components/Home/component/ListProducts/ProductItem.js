import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { View, Text, Image, StyleSheet } from 'react-native';

class ProductItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.string,
    discount_view: PropTypes.string,
    discount_percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_view: PropTypes.string,
    onPress: PropTypes.func,
    last: PropTypes.bool
  };

  static defaultProps = {
    name: '',
    image: '',
    discount_view: '',
    discount_percent: 0,
    price_view: '',
    onPress: () => {},
    last: false
  };

  render() {
    return (
      <Button
        onPress={this.props.onPress}
        containerStyle={[
          {
            marginRight: this.props.last ? 16 : 0
          },
          this.props.wrapperStyle
        ]}
      >
        <View style={[styles.container, this.props.containerStyle]}>
          <Image
            style={[styles.image, this.props.imageStyle]}
            source={{ uri: this.props.image }}
          />
          <View style={styles.infoWrapper}>
            <Text style={styles.name} numberOfLines={2}>
              {this.props.name}
            </Text>

            <View style={styles.priceWrapper}>
              {this.props.discount_percent > 0 && (
                <Text style={styles.discount}>{this.props.discount_view}</Text>
              )}
              <View style={styles.priceBox}>
                <Text style={styles.price}>{this.props.price_view}</Text>
              </View>
            </View>
          </View>
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    flex: 1,
    marginLeft: 16
  },
  image: {
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8
  },
  infoWrapper: {
    flex: 1,
    marginTop: 8,
    alignItems: 'flex-start'
  },
  name: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500'
  },
  priceWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 4
  },
  discount: {
    color: '#404040',
    fontSize: 13,
    textDecorationLine: 'line-through'
  },
  priceBox: {
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
