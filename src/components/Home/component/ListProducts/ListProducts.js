import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ListProductSkeleton from './ListProductSkeleton';
import store from 'app-store';
import { HOME_CARD_TYPE } from '../../constants';
import appConfig from 'app-config';
import ProductItem from './ProductItem';

class ListProducts extends Component {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    type: PropTypes.oneOf(Object.values(HOME_CARD_TYPE))
  };

  static defaultProps = {
    data: [],
    title: '',
    type: HOME_CARD_TYPE.HORIZONTAL,
    itemsPerRow: 3
  };

  get hasProducts() {
    return Array.isArray(this.props.data) && this.props.data.length !== 0;
  }

  renderListVertical() {
    return (
      <View style={styles.listVertical}>
        {this.props.data.map((product, index) => {
          const extraStyle = {
            borderRightWidth: index % 2 === 0 ? 0.5 : 0
          };
          return (
            <View style={[styles.itemVerticalWrapper, extraStyle]} key={index}>
              <ProductItem
                containerStyle={styles.itemVerticalContainer}
                imageStyle={styles.itemVerticalImage}
                name={product.name}
                image={product.image}
                discount_view={product.discount_view}
                discount_percent={product.discount_percent}
                price_view={product.price_view}
                onPress={() => this.props.onPressProduct(product)}
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
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItemHorizontal.bind(this)}
      />
    );
  }

  renderItemHorizontal({ item: product, index }) {
    return (
      <ProductItem
        name={product.name}
        image={product.image}
        discount_view={product.discount_view}
        discount_percent={product.discount_percent}
        price_view={product.price_view}
        onPress={() => this.props.onPressProduct(product)}
        last={this.props.data.length - 1 === index}
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
    backgroundColor: '#fff',
    marginTop: 10,
    paddingBottom: 20
  },
  headingWrapper: {
    marginTop: 16,
    marginBottom: 12
  },
  heading: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginLeft: 16
  },
  listVertical: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 0.5,
    borderColor: '#eee'
  },
  itemVerticalWrapper: {
    width: appConfig.device.width / 2,
    paddingVertical: 15,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#eee'
  },
  itemVerticalContainer: {
    width: undefined,
    marginLeft: 0,
    paddingHorizontal: 15
  },
  itemVerticalImage: {
    height: (appConfig.device.width / 2) * 0.618,
    marginBottom: 7,
    borderRadius: 0
  }
});

export default observer(ListProducts);
