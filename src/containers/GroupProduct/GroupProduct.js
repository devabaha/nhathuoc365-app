import React, {useEffect, useState} from 'react';
import {StyleSheet, RefreshControl, FlatList} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Items from '../../components/stores/Items';
import APIHandler from '../../network/APIHandler';
import {APIRequest} from '../../network/Entity';
import store from 'app-store';
import Animated, {useValue} from 'react-native-reanimated';
import CartFooter from '../../components/cart/CartFooter';
import ListStoreProductSkeleton from '../../components/stores/ListStoreProductSkeleton';
import RightButtonChat from '../../components/RightButtonChat';

const styles = StyleSheet.create({
  listContentContainer: {
    paddingTop: 8,
    marginLeft: 5,
  },
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const GroupProduct = ({
  siteId = store?.store_data?.id,
  title,
  groupId,
  ...props
}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const getProductsRequest = new APIRequest();

  const animatedScrollY = useValue(0);
  const animatedContentOffsetY = useValue(0);

  useEffect(() => {
    handleDidMount();
    return () => {
      getProductsRequest.cancel();
    };
  }, []);

  const handleDidMount = () => {
    getProducts();
    Actions.refresh({
      title: title || props.t('screen.groupProduct.mainTitle'),
      right: renderRightNavBar,
    });
  };

  const renderRightNavBar = () => {
    return <RightButtonChat />;
  };

  const getProducts = async () => {
    try {
      getProductsRequest.data = APIHandler.site_group_product(siteId, groupId);
      const response = await getProductsRequest.promise();
      setProducts(response);
    } catch (error) {
      console.log('%cget_group_product', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message || this.props.t('api.error.message'),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getProducts();
  };

  const onPressProduct = (product) => {
    Actions.item({
      title: product.name,
      item: product,
    });
  };

  const renderProduct = ({item: product, index}) => {
    return (
      <Items
        item={product}
        index={index}
        onPress={() => onPressProduct(product)}
      />
    );
  };
  return (
    <>
      <AnimatedFlatList
        data={products}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        onScrollBeginDrag={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: animatedContentOffsetY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: animatedScrollY,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        keyExtractor={(item) => String(item.id)}
      />

      <CartFooter
        prefix="stores"
        // confirmRemove={this._confirmRemoveCartItem.bind(this)}
        animatedScrollY={animatedScrollY}
        animatedContentOffsetY={animatedContentOffsetY}
        animating
      />
      <ListStoreProductSkeleton loading={isLoading} />
    </>
  );
};

export default withTranslation()(GroupProduct);
