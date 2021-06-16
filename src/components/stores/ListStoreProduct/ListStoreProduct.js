import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Items from '../Items';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20,
    paddingBottom: 5,
  },
});

const ListStoreProduct = ({products, onPressItem, containerStyle, onPressLoadMore = () => {}}) => {
  const handlePressItem = (product) => {
    if (!!onPressItem) {
      onPressItem(product);
    } else {
      Actions.item({
        title: product.name,
        item: product,
      });
    }
  };

  const renderProduct = () => {
    return products.map((product, index) => (
      <Items
        key={product.id}
        item={product}
        index={index}
        onPress={
          product.type != 'loadMore'
            ? () => handlePressItem(product)
            : onPressLoadMore
        }
      />
    ));
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {!!products?.length ? renderProduct() : null}
    </View>
  );
};

export default React.memo(ListStoreProduct);
