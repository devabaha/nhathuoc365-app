import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ORDER_TYPES} from 'src/constants';
import {CART_TYPES} from 'src/constants/cart';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
import CTAProduct from 'src/components/item/CTAProduct';
// custom components
import {ProductItem} from 'src/components/Home/component/ListProducts';
import {Container, TextButton, Typography, Icon} from 'src/components/base';

class Items extends Component {
  static contextType = ThemeContext;

  state = {
    loadMore: false,
  };
  CTAProduct = new CTAProduct(this);
  unmounted = false;

  get theme() {
    return getTheme(this);
  }

  isServiceProduct(product = {}) {
    return product.order_type === ORDER_TYPES.BOOKING;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.index !== this.props.index && nextState.loadMore) {
      this.setState({loadMore: false});
    }

    return true;
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.setState({loadMore: false});
  }

  handlePressActionBtnProduct = (product, quantity = 1, model = '') => {
    this.CTAProduct.handlePressMainActionBtnProduct({
      product,
      cartType: CART_TYPES.NORMAL,
    });
  };

  getItemExtraStyle(index) {
    return (
      index % 2 !== 0 && {
        marginHorizontal: 0,
        // marginLeft: index % 2 == 0 ? 15 : 0,
      }
    );
  }

  render() {
    let {item, index, onPress, t} = this.props;
    let renderLoadMore = null;
    // button load more
    if (item.type == 'loadMore') {
      renderLoadMore = () => {
        return (
          <TextButton
            onPress={() => {
              if (onPress) {
                onPress();
              }

              this.setState({
                loadMore: true,
              });
            }}
            style={styles.buttonContainer}>
            {this.state.loadMore ? (
              <Indicator size="small" />
            ) : (
              <Container style={styles.container}>
                <Icon
                  style={styles.iconLoadMore}
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="th"
                />
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.textLoadMore}>
                  {t('item.more')}
                </Typography>
              </Container>
            )}
          </TextButton>
        );
      };
    }

    return (
      <ProductItem
        containerStyle={[styles.wrapper, this.getItemExtraStyle(index)]}
        name={item.name}
        image={item.image}
        discount_view={item.discount_view}
        discount_percent={item.discount_percent}
        price_view={item.price_view}
        unit_name={item.unit_name}
        onPress={onPress}
        item={item}
        renderContent={renderLoadMore}
      />
    );
  }
}

Items.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const ITEM_SPACING = 15;
const ITEM_WIDTH = (appConfig.device.width - ITEM_SPACING * 3) / 2;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
    marginBottom: 15,
    marginHorizontal: 15,
    width: ITEM_WIDTH,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textLoadMore: {
    marginTop: 8,
  },
  iconLoadMore: {
    fontSize: 24,
  },
});

export default withTranslation(['stores', 'product', 'common'])(
  observer(Items),
);
