import React, {Component} from 'react';
import {StyleSheet, View, RefreshControl} from 'react-native';
import Swiper from 'react-native-swiper';
import Animated from 'react-native-reanimated';
import Items from './Items';
import store from 'app-store';
import {Actions} from 'react-native-router-flux';
import NoResult from '../NoResult';
import ListStoreProductSkeleton from './ListStoreProductSkeleton';
import APIHandler from 'src/network/APIHandler';
import {isEmpty, isEqual} from 'lodash';
import {APIRequest} from 'src/network/Entity';

import appConfig from 'app-config';
import ListStoreProduct from './ListStoreProduct';

const AUTO_LOAD_NEXT_CATE = 'AutoLoadNextCate';
const STORE_CATEGORY_KEY = 'KeyStoreCategory';
const CATE_AUTO_LOAD = 'CateAutoLoad';

class CategoryScreen extends Component {
  static defaultProps = {
    animatedScrollY: new Animated.Value(0),
  };
  constructor(props) {
    super(props);

    const {item, promotions} = props;
    let header_title;

    if (item.id == 0) {
      header_title = `— ${props.t('tabs.screen.mainTitle')} —`;
    } else {
      header_title = `— ${props.t('tabs.screen.categoryTitle', {
        productName: item.name,
      })} —`;
    }

    this.state = {
      loading: props.index === 0,
      refreshing: false,
      header_title,
      items_data: null,
      items_data_bak: null,
      promotions,
      isAll: item.id == 0,
      fetched: false,
      filter_data: [],
      filter_data_bak: [],
    };

    this.unmounted = false;
    this.paramsFilter = {};
    this.getProductsRequest = new APIRequest();
    this.requests = [this.getProductsRequest];
    this.page = 0;
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  componentDidMount() {
    var {item, index} = this.props;
    this.start_time = 0;
    var keyAutoLoad = AUTO_LOAD_NEXT_CATE + index;
    if (index == 0) {
      this._getItemByCateId(item.id);
    } else {
      if (index == 1) {
        this._getItemByCateIdFromServer(item.id);
      }
      Events.on(keyAutoLoad, keyAutoLoad, () => {
        // setTimeout(() => {
        //   console.log(
        //     this.props.index,
        //     this.props.cate_index,
        //     this.props.isAutoLoad(),
        //   );
        //   if (this.props.isAutoLoad()) {
        //     this._getItemByCateId(item.id);
        //   }
        // }, 500);
      });
    }

    Events.on(CATE_AUTO_LOAD, CATE_AUTO_LOAD + index, () => {
      Events.removeAll(keyAutoLoad);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {item, index, cate_index, isAutoLoad} = nextProps;

    const isUpdateParamsFilter = !isEqual(
      this.paramsFilter,
      nextProps.paramsFilter,
    );

    if (
      (index == cate_index || isAutoLoad) &&
      (this.state.items_data == null || isUpdateParamsFilter) &&
      Object.keys(this.props).some(
        (key) => nextProps[key] != this.props[key],
      ) &&
      !nextState.loading
    ) {
      this.start_time = time();
      // get list products by category_id
      if (isUpdateParamsFilter) {
        this.paramsFilter = nextProps.paramsFilter;
      }

      this.setState({loading: true});
      this._getItemByCateIdFromServer(
        item.id,
        300,
        false,
        isUpdateParamsFilter,
        nextProps.paramsFilter,
      );
    }
    return true;
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.paramsFilter = {};
    cancelRequests(this.requests);
  }

  // tới màn hình chi tiết item
  _goItem(item) {
    Actions.item({
      title: item.name,
      item,
    });
  }

  _onRefresh() {
    this.page = 0;
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this._getItemByCateIdFromServer(this.props.item.id, 1000);
      },
    );
  }

  // lấy d/s sản phẩm theo category_id
  _getItemByCateId(category_id) {
    var store_category_key =
      STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;
    this.setState(
      {
        loading: this.state.items_data ? false : true,
      },
      () => {
        // load
        storage
          .load({
            key: store_category_key,
            autoSync: true,
            syncInBackground: true,
            syncParams: {
              extraFetchOptions: {},
              someFlag: true,
            },
          })
          .then((data) => {
            // delay append data
            setTimeout(() => {
              layoutAnimation();
              this.page = 1;
              this.setState({
                items_data:
                  data.length > STORES_LOAD_MORE
                    ? [...data, {id: -1, type: 'loadMore'}]
                    : data,
                items_data_bak: data,
                loading: false,
                fetched: true,
                refreshing: false,
              });

              action(() => {
                store.setStoresFinish(true);
              })();

              // load next category
              this._loadNextCate();
            }, this._delay());
          })
          .catch((err) => {
            console.log('get_item_by_cate_id_local', err);
            this._getItemByCateIdFromServer(category_id);
          });
      },
    );
  }

  async _getItemByCateIdFromServer(
    category_id,
    delay = 0,
    loadMore = false,
    forceUpdate = false,
    paramsFilter = this.props.paramsFilter,
  ) {
    var store_category_key =
      STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;
    const site_id = this.props.site_id || store.store_id;
    if (loadMore && !forceUpdate) {
      this.page++;
    } else {
      this.page = 0;
    }
    let params = !isEmpty(paramsFilter) ? paramsFilter : {};
    if (this.props.type) {
      params = {...params, type: this.props.type};
    }

    try {
      this.getProductsRequest.data = APIHandler.site_category_product_by_filter(
        site_id,
        category_id,
        this.page,
        params,
      );
      const response = await this.getProductsRequest.promise();
      if (this.unmounted) return;

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          // delay append data
          setTimeout(() => {
            layoutAnimation();

            var items_data = loadMore
              ? [...this.state.items_data_bak, ...response.data]
              : response.data;
            this.setState({
              items_data:
                response.data.length >=
                (this.page == 0
                  ? FIRST_PAGE_STORES_LOAD_MORE
                  : STORES_LOAD_MORE)
                  ? [...items_data, {id: -1, type: 'loadMore'}]
                  : items_data,
              items_data_bak: items_data,
              loading: false,
              fetched: true,
              refreshing: false,
            });

            action(() => {
              store.setStoresFinish(true);
            })();

            // load next category
            this._loadNextCate();

            // cache in five minutes
            if (response.data && !loadMore && isEmpty(paramsFilter)) {
              storage.save({
                key: store_category_key,
                data: items_data,
                expires: STORE_CATEGORY_CACHE,
              });
            }
          }, delay || this._delay());
        } else {
          this.setState((prevState) => ({
            loading: false,
            fetched: true,
            refreshing: false,
            items_data: forceUpdate ? null : prevState.items_data_bak,
            items_data_bak: forceUpdate ? null : prevState.items_data_bak,
          }));

          // load next category
          this._loadNextCate();
        }
      }
    } catch (e) {
      console.log(e + ' site_category_product');
    }
  }

  _loadNextCate() {
    // auto load next category
    var keyAutoLoad = AUTO_LOAD_NEXT_CATE + (this.props.index + 1);
    Events.trigger(keyAutoLoad);
    Events.removeAll(keyAutoLoad);
  }

  _loadMore = async () => {
    this.setState({isLoadMore: true});
    this._getItemByCateIdFromServer(this.props.item.id, 0, true);
  };

  render() {
    const {t} = this.props;
    const {items_data, header_title, fetched, loading} = this.state;

    return (
      <>
        <View style={styles.containerScreen}>
          <ListStoreProduct
            useList
            products={items_data}
            onPressLoadMore={this._loadMore}
            listProps={{
              numColumns: 2,
              ListHeaderComponent: this.state.isAll &&
                this.state.promotions &&
                this.state.promotions.length > 0 && (
                  <Swiper
                    style={{
                      marginVertical: 8,
                    }}
                    width={Util.size.width}
                    height={Util.size.width * 0.96 * (50 / 320) + 16}
                    autoplayTimeout={3}
                    showsPagination={false}
                    horizontal
                    autoplay>
                    {this.state.promotions.map((banner, i) => {
                      return (
                        <View
                          key={i}
                          style={{
                            width: Util.size.width,
                            alignItems: 'center',
                          }}>
                          <CachedImage
                            source={{uri: banner.banner}}
                            style={{
                              width: Util.size.width * 0.96,
                              height: Util.size.width * 0.96 * (50 / 320),
                            }}
                          />
                        </View>
                      );
                    })}
                  </Swiper>
                ),

              ListEmptyComponent: (
                <View style={[styles.containerScreen]}>
                  {fetched && (
                    <NoResult
                      iconName="cart-off"
                      message={`${t('noProduct')} :(`}
                    />
                  )}
                </View>
              ),

              contentContainerStyle: {
                flexGrow: 1,
                // paddingTop: 15,
                paddingBottom: store.cart_data
                  ? 5
                  : appConfig.device.bottomSpace,
              },
              scrollEventThrottle: 16,
              refreshControl: (
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              ),
              onScrollBeginDrag: Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.props.animatedContentOffsetY,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                },
              ),
              onScroll: Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: this.props.animatedScrollY,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                },
              ),
            }}
          />
        </View>
        <ListStoreProductSkeleton loading={this.state.loading} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerScreen: {
    width: Util.size.width,
    flex: 1,
  },
});

export default withTranslation('stores')(observer(CategoryScreen));
