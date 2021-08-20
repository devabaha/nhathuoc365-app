import React, {useEffect, useState, useRef} from 'react';
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

import appConfig from 'app-config';
import NoResult from 'src/components/NoResult';

const styles = StyleSheet.create({
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: appConfig.device.bottomSpace,
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
  const productsOriginal = useRef([]);
  const pageIndex = useRef(0);

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

  const getProducts = async (loadMore = false) => {
    if (loadMore) {
      pageIndex.current++;
    } else {
      pageIndex.current = 0;
    }
    try {
      getProductsRequest.data = APIHandler.site_group_product(
        siteId,
        groupId,
        pageIndex.current,
      );
      let responseData = (await getProductsRequest.promise()) || [];

      if (responseData.length > 0) {
        layoutAnimation();

        productsOriginal.current = loadMore
          ? [...productsOriginal.current, ...responseData]
          : responseData;

        setProducts(
          responseData.length >=
            (pageIndex.current === 0
              ? FIRST_PAGE_STORES_LOAD_MORE
              : STORES_LOAD_MORE)
            ? [...productsOriginal.current, {id: -1, type: 'loadMore'}]
            : productsOriginal.current,
        );
      }
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

  const onPressLoadMore = () => {
    getProducts(true);
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
        onPress={
          product.type != 'loadMore'
            ? () => onPressProduct(product)
            : onPressLoadMore
        }
      />
    );
  };

  const renderEmpty = () => {
    return (
      !isLoading && (
        <NoResult
          iconName="cart-off"
          message={`${props.t('stores:noProduct')} :(`}
        />
      )
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
        ListEmptyComponent={renderEmpty}
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

export default withTranslation(['common', 'stores'])(GroupProduct);
