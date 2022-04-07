import React from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {FlatList} from 'src/components/base';
import Items from '../Items';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20,
    paddingBottom: 5,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 5,
  },
});

const ListStoreProduct = ({
  products,
  onPressItem,
  containerStyle,
  contentContainerStyle,
  useList,
  listProps = {},
  onPressLoadMore = () => {},
}) => {
  const {theme} = useTheme();

  const handlePressItem = (product) => {
    if (!!onPressItem) {
      onPressItem(product);
    } else {
      push(
        appConfig.routes.item,
        {
          title: product.name,
          item: product,
        },
        theme,
      );
    }
  };

  const renderProducts = () => {
    return products.map((product, index) =>
      renderProduct({item: product, index}),
    );
  };

  const renderProduct = ({item: product, index}) => {
    return (
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
    );
  };

  return useList ? (
    <FlatList
      reanimated
      data={products}
      renderItem={renderProduct}
      keyExtractor={(product) => product.id}
      {...listProps}
      style={[listProps.style, containerStyle]}
      contentContainerStyle={[
        styles.contentContainer,
        listProps.contentContainerStyle,
        contentContainerStyle,
      ]}
    />
  ) : (
    <View style={[styles.container, containerStyle]}>
      {!!products?.length ? renderProducts() : null}
    </View>
  );
};

export default React.memo(ListStoreProduct);
