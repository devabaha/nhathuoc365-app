import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import appConfig from 'app-config';
import ImageBackground from '../../../ImageBg';
import Loading from '../../../Loading';
import {DiscountBadge} from '../../../Badges';
import Themes from 'src/Themes';
import Ribbon from 'src/components/Ribbon/Ribbon';

const homeThemes = Themes.getNameSpace('home');
const productItemStyle = homeThemes('styles.home.listProduct');

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
      <TouchableOpacity
        onPress={this.handlePress}
        activeOpacity={0.8}
        style={[styles.wrapper, this.props.wrapperStyle]}>
        <ImageBackground
          style={[styles.image, this.props.imageStyle]}
          source={{
            uri: this.props.image,
          }}>
          {this.state.loading && (
            <Loading color="#fff" containerStyle={styles.loading} />
          )}
          {this.props.discount_percent > 0 && (
            <View style={styles.discountBadgeContainer}>
              <Ribbon text={saleFormat(this.props.discount_percent)} />
            </View>
          )}
        </ImageBackground>
        <View style={[styles.infoWrapper]}>
          <Text style={styles.name} numberOfLines={2}>
            {this.props.name}
          </Text>

          <View style={styles.priceWrapper}>
            {this.props.discount_percent > 0 && (
              <Text style={styles.discount}>
                <Text style={{textDecorationLine: 'line-through'}}>
                  {this.props.discount_view}
                </Text>
                / {this.props.unit_name}
              </Text>
            )}
            <View style={[styles.priceBox]}>
              <Text style={[styles.price]}>{this.props.price_view}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

let styles = StyleSheet.create({
  wrapper: {
    width: appConfig.device.width / 2 - 40,
    flex: 1,
  },

  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  infoWrapper: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    paddingBottom: 5,
  },
  priceWrapper: {
    width: '100%',
    marginTop: 'auto',
  },
  discount: {
    color: '#404040',
    fontSize: 13,
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

styles = Themes.mergeStyles(styles, productItemStyle);

export default ProductItem;
