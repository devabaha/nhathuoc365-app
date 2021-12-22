import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Animated, {useValue} from 'react-native-reanimated';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// network
import APIHandler from 'src/network/APIHandler';
// routing
import {push, refresh} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Items from 'src/components/stores/Items';
import CartFooter from 'src/components/cart/CartFooter';
import ListStoreProductSkeleton from 'src/components/stores/ListStoreProductSkeleton';
import RightButtonChat from 'src/components/RightButtonChat';
import NoResult from 'src/components/NoResult';
import {ScreenWrapper, FlatList, RefreshControl} from 'src/components/base';

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
  navigation,
  ...props
}) => {
  const {theme} = useTheme();

  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const productsOriginal = useRef([]);
  const pageIndex = useRef(0);

  const getProductsRequest = new APIRequest();

  const animatedScrollY = useValue(0);
  const animatedContentOffsetY = useValue(0);

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    handleDidMount();
    return () => {
      getProductsRequest.cancel();
    };
  }, []);

  const handleDidMount = () => {
    getProducts();
    refresh({
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
    push(
      appConfig.routes.item,
      {
        title: product.name,
        item: product,
      },
      theme,
    );
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
    <ScreenWrapper>
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

      {!isLoading && (
        <CartFooter
          prefix="stores"
          // confirmRemove={this._confirmRemoveCartItem.bind(this)}
          animatedScrollY={animatedScrollY}
          animatedContentOffsetY={animatedContentOffsetY}
          animating
        />
      )}
      <ListStoreProductSkeleton loading={isLoading} />
    </ScreenWrapper>
  );
};

export default withTranslation(['common', 'stores'])(GroupProduct);
