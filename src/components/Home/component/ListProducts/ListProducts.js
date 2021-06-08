import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import ListProductSkeleton from './ListProductSkeleton';
import store from 'app-store';
import {HOME_CARD_TYPE} from '../../constants';
import appConfig from 'app-config';
import ProductItem from './ProductItem';
import Button from 'react-native-button';

class ListProducts extends Component {
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
      />
    );
  }

  renderItemHorizontal = ({item: product, index}) => {
    const extraProps = {
      last: this.props.data.length - 1 === index,
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

  render() {
    return this.hasProducts ? (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Text style={styles.heading}>{this.props.title}</Text>
          {!!this.props.onShowAll && (
            <Button underlayColor="transparent" onPress={this.props.onShowAll}>
              <Text style={styles.viewAll}>{this.props.t('viewAll')}</Text>
            </Button>
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
    marginVertical: 15,
  },
  headingWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 5
  },
  heading: {
    color: '#333',
    fontSize: 20,
    flex: 1,
    marginRight: 20,
  },
  listHorizontal: {
    paddingHorizontal: 5,
  },
  contentHorizontal: {},
  listVertical: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10
  },
  itemVerticalWrapper: {
    width: appConfig.device.width / 2 - 10,
  },
  itemVerticalContainer: {
    width: undefined,
    marginLeft: 0,
    marginRight: 0,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flex: 1,
  },
  itemVerticalImage: {
    height: (appConfig.device.width / 2) * 0.75,
  },
  viewAll: {
    color: '#0084ff',
    fontSize: 14,
  },
});

export default withTranslation('home')(observer(ListProducts));
