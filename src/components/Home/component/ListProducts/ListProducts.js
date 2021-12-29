import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
import {HOME_CARD_TYPE} from '../../constants';
// custom components
import ProductItem from './ProductItem';
import {Typography, TextButton, FlatList} from 'src/components/base';
// skeleton
import ListProductSkeleton from './ListProductSkeleton';

class ListProducts extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    type: PropTypes.oneOf(Object.values(HOME_CARD_TYPE)),
  };

  static defaultProps = {
    data: [],
    title: '',
    type: HOME_CARD_TYPE.HORIZONTAL,
    itemsPerRow: 3,
    onShowAll: null,
  };

  get theme() {
    return getTheme(this);
  }

  get hasProducts() {
    return Array.isArray(this.props.data) && this.props.data.length !== 0;
  }

  renderListVertical() {
    const extraProps = {
      wrapperStyle: styles.itemVerticalContainer,
      imageStyle: styles.itemVerticalImage,
      containerStyle: {flex: 1},
    };
    return (
      <View style={styles.listVertical}>
        {this.props.data.map((product, index) => {
          return (
            <View style={[styles.itemVerticalWrapper]} key={index}>
              <ProductItem
                selfRequest={(callBack) =>
                  this.props.onPressProduct(product, callBack)
                }
                name={product.name}
                image={product.image}
                discount_view={product.discount_view}
                discount_percent={product.discount_percent}
                price_view={product.price_view}
                unit_name={product.unit_name}
                onPress={() => this.props.onPressProduct(product)}
                item={product}
                {...extraProps}
              />
            </View>
          );
        })}
      </View>
    );
  }

  renderListHorizontal() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        keyExtractor={(item, index) => `product_item_${item.id}`}
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItemHorizontal}
        contentContainerStyle={styles.listHorizontal}
        style={{overflow: 'visible'}}
        directionalLockEnabled
        nestedScrollEnabled
      />
    );
  }

  renderItemHorizontal = ({item: product, index}) => {
    const extraProps = {
      last: this.props.data.length - 1 === index,
      horizontal: true,
    };
    return this.renderProduct(product, extraProps);
  };

  renderProduct(product, extraProps) {
    return (
      <ProductItem
        selfRequest={(callBack) => this.props.onPressProduct(product, callBack)}
        name={product.name}
        image={product.image}
        discount_view={product.discount_view}
        discount_percent={product.discount_percent}
        price_view={product.price_view}
        unit_name={product.unit_name}
        onPress={() => this.props.onPressProduct(product)}
        item={product}
        {...extraProps}
      />
    );
  }

  renderFlatList() {
    switch (this.props.type) {
      case HOME_CARD_TYPE.VERTICAL:
        return this.renderListVertical();
      default:
        return this.renderListHorizontal();
    }
  }

  get showAllTitleStyle() {
    return {color: this.theme.color.accent2};
  }

  render() {
    return this.hasProducts ? (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={styles.headingWrapper}>
          <Typography
            type={TypographyType.TITLE_LARGE}
            numberOfLines={2}
            style={styles.heading}>
            {this.props.title}
          </Typography>
          {!!this.props.onShowAll && (
            <TextButton
              titleStyle={this.showAllTitleStyle}
              onPress={this.props.onShowAll}>
              {this.props.t('viewAll')}
            </TextButton>
          )}
        </View>
        {this.renderFlatList()}
      </View>
    ) : !store.isHomeLoaded ? (
      <ListProductSkeleton />
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  headingWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    flex: 1,
    marginRight: 20,
  },
  listHorizontal: {
    paddingHorizontal: 7.5,
    paddingBottom: appConfig.device.isAndroid ? 15 : 0,
    marginBottom: appConfig.device.isAndroid ? -15 : 0,
  },
  contentHorizontal: {},
  listVertical: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 7.5,
  },
  itemVerticalWrapper: {
    // width: appConfig.device.width / 2 - 10,
  },
  itemVerticalContainer: {
    width: undefined,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
  },
  itemVerticalImage: {
    height: (appConfig.device.width / 2) * 0.75,
  },
  viewAll: {},
});

export default withTranslation('home')(observer(ListProducts));
