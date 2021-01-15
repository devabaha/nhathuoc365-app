import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet} from 'react-native';

import ImageBackground from '../../../ImageBg';
import Loading from '../../../Loading';
import {DiscountBadge} from '../../../Badges';

class ProductItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    image: PropTypes.string,
    discount_view: PropTypes.string,
    discount_percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_view: PropTypes.string,
    onPress: PropTypes.func,
    last: PropTypes.bool,
  };

  static defaultProps = {
    name: '',
    image: '',
    discount_view: '',
    discount_percent: 0,
    price_view: '',
    onPress: () => {},
    last: false,
  };

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
    return (
      <Button
        onPress={this.handlePress}
        containerStyle={[styles.wrapper, this.props.wrapperStyle]}>
        <View style={[styles.container, this.props.containerStyle]}>
          <ImageBackground
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.image}}>
            {this.state.loading && (
              <Loading color="#fff" containerStyle={styles.loading} />
            )}
            {this.props.discount_percent > 0 && (
              <DiscountBadge
                containerStyle={styles.discountBadgeContainer}
                label={saleFormat(this.props.discount_percent)}
              />
            )}
          </ImageBackground>
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
  wrapper: {
    width: 150,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  image: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoWrapper: {
    flex: 1,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  priceWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  discount: {
    color: '#404040',
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  priceBox: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(85, 185, 71, 1)',
  },
  price: {
    color: '#fff',
  },
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.12)',
  },
  discountBadgeContainer: {
    top: 0,
    height: 18,
    position: 'absolute',
    backgroundColor: '#fff',
    width: undefined,
    ...elevationShadowStyle(1),
  },
});

export default ProductItem;
