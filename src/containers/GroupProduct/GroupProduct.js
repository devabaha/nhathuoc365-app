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

import appConfig from 'app-config';

const styles = StyleSheet.create({
  listContentContainer: {
    paddingTop: 8,
    paddingBottom: appConfig.device.bottomSpace
  },
});

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const STORE_CATEGORY_KEY = 'KeyStoreCategory';

let page = 0

const GroupProduct = ({
  siteId = store?.store_data?.id,
  title,
  groupId,
  ...props
}) => {
  const [products, setProducts] = useState([]);
  const [productsOrigin, setProductsOrigin] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const getProductsRequest = new APIRequest();

  const startTime = 0

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

  const delayTime = () => {
    const delay = 400 - Math.abs(time() - startTime)
    return delay
  }

  const getProducts = async (
    categoryId,
    delay = 0,
    loadMore = false,
    forceUpdate = false,
  ) => {
    const storeCategoryKey = STORE_CATEGORY_KEY + store.store_id + categoryId + store.user_info.id
    
    if(loadMore && !forceUpdate ){
      page++
    } else {
      page = 0
    }
    try {
      getProductsRequest.data = APIHandler.site_group_product(siteId, groupId, page);
      const response = await getProductsRequest.promise();
      
      if (response.length > 0) {
        setTimeout(() => {
          layoutAnimation()

          const productsOriginal = loadMore 
            ? [...productsOrigin, ...response]
            : response
          setProducts(
            response.length >= (page === 0 ? FIRST_PAGE_STORES_LOAD_MORE : STORES_LOAD_MORE)
            ? [...productsOriginal, {id: -1, type: 'loadMore'}]
            : productsOriginal
          )
          setProductsOrigin(productsOriginal)
          setLoading(false)
          setRefreshing(false)
          
          action(() => {
            store.setStoresFinish(true);
          })();

          if(response.length > 0 && !loadMore) {
            storage.save({
              key: storeCategoryKey,
              data: productsOriginal,
              expires: STORE_CATEGORY_CACHE,
            });
          }
          
        }, delay || delayTime())
      } else {
        setLoading(false)
        setRefreshing(false)
        setProducts((prevState) => {
          forceUpdate ? null : prevState.productsOrigin
        })
        setProductsOrigin((prevState) => {
          forceUpdate ? null : prevState.productsOrigin
        })
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
    getProducts(siteId, 0, true)
  }

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
