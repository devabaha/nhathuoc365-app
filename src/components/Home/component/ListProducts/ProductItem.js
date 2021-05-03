import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet} from 'react-native';
import appConfig from 'app-config';
import ImageBackground from '../../../ImageBg';
import Loading from '../../../Loading';
import {DiscountBadge} from '../../../Badges';
import Themes from 'src/Themes';
import Ribbon from 'src/components/Ribbon/Ribbon';

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
    const shadowWrapperStyle = this.homeThemes(
      'styles.home.list_product_item_container_shadow',
    );
    const infoWrapperStyle = this.homeThemes(
      'styles.home.list_product_item_info_wrapper',
    );
    const priceBoxStyle = this.homeThemes(
      'styles.home.list_product_item_price_box',
    );
    const salePriceTextStyle = this.homeThemes(
      'styles.home.list_product_item_salePrice',
    );

    return (
      <Button
        onPress={this.handlePress}
        containerStyle={[styles.wrapper, this.props.wrapperStyle]}>
        <View
          style={[
            styles.container,
            shadowWrapperStyle,
            this.props.containerStyle,
          ]}>
          <ImageBackground
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.image}}>
            {this.state.loading && (
              <Loading color="#fff" containerStyle={styles.loading} />
            )}
            {this.props.discount_percent > 0 && (
              <View style={styles.discountBadgeContainer}>
                <Ribbon text={saleFormat(this.props.discount_percent)} />
              </View>
            )}
          </ImageBackground>
          <View style={[styles.infoWrapper, infoWrapperStyle]}>
            <Text style={styles.name} numberOfLines={2}>
              {this.props.name}
            </Text>

            <View style={styles.priceWrapper}>
              {this.props.discount_percent > 0 && (
                <Text style={styles.discount}>{this.props.discount_view}</Text>
              )}
              <View style={[styles.priceBox, priceBoxStyle]}>
                <Text style={[styles.price, salePriceTextStyle]}>
                  {this.props.price_view}
                </Text>
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
    width: appConfig.device.width / 2 - 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
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
    marginTop: 10,
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
    top: 10,
    left: 0,
    position: 'absolute',
    backgroundColor: '#fff',
    width: undefined,
    ...elevationShadowStyle(1),
  },
});

export default ProductItem;
