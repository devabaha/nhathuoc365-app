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
      page: 0,
      promotions,
      isAll: item.id == 0,
      fetched: false,
      filter_data: [],
      filter_data_bak: [],
    };

    this.unmounted = false;
    this.paramsFilter = {};
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
    if (index == 0 || index == 1) {
      this._getItemByCateId(item.id);
    } else {
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

    // this.getListFilterTag();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {item, index, cate_index} = nextProps;
    if (
      (index == cate_index || nextProps.isAutoLoad) &&
      this.state.items_data == null &&
      !nextState.loading &&
      isEmpty(nextProps.paramsFilter)
    ) {
      this.start_time = time();
      // get list products by category_id
      this._getItemByCateId(item.id);
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const {item, index, cate_index, isAutoLoad} = this.props;
      if (
      (index === cate_index || isAutoLoad) &&
      !isEmpty(this.props.paramsFilter) &&
      !this.state.loading &&
      (!isEqual(this.paramsFilter, this.props.paramsFilter) ||
        isEmpty(this.state.items_data))
    ) {

      this.setState({loading: true})
      this._getItemByCateIdFromServer(item.id);
      this.paramsFilter = this.props.paramsFilter;
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  // tới màn hình chi tiết item
  _goItem(item) {
    Actions.item({
      title: item.name,
      item,
    });
  }

  _onRefresh() {
    this.setState(
      {
        refreshing: true,
        page: 0,
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

              this.setState({
                items_data:
                  data.length > STORES_LOAD_MORE
                    ? [...data, {id: -1, type: 'loadmore'}]
                    : data,
                items_data_bak: data,
                loading: false,
                fetched: true,
                refreshing: false,
                page: 1,
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

  async _getItemByCateIdFromServer(category_id, delay = 0, loadmore = false) {
    var store_category_key =
      STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;
    const site_id = this.props.site_id || store.store_id;
    if (loadmore) {
      this.state.page += 1;
    } else {
      this.state.page = 0;
    }
    try {
      const response = await APIHandler.site_category_product_by_filter(
        site_id,
        category_id,
        this.state.page,
        !isEmpty(this.props.paramsFilter) ? this.props.paramsFilter : undefined
      );
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          // delay append data
          setTimeout(() => {
            layoutAnimation();

            var items_data = loadmore
              ? [...this.state.items_data_bak, ...response.data]
              : response.data;
            this.setState({
              items_data:
                response.data.length >= STORES_LOAD_MORE
                  ? [...items_data, {id: -1, type: 'loadmore'}]
                  : items_data,
              items_data_bak: items_data,
              loading: false,
              fetched: true,
              refreshing: false,
              page: this.state.page,
            });

            action(() => {
              store.setStoresFinish(true);
            })();

            // load next category
            this._loadNextCate();

            // cache in five minutes
            if (response.data && !loadmore) {
              storage.save({
                key: store_category_key,
                data: items_data,
                expires: STORE_CATEGORY_CACHE,
              });
            }
          }, delay || this._delay());
        } else {
          this.setState({
            loading: false,
            fetched: true,
            refreshing: false,
            items_data: this.state.items_data_bak,
          });

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
    const {t, paramsFilter} = this.props;
    const {items_data, header_title, fetched, loading} = this.state;
    // const dataProducts = !isEmpty(paramsFilter)
    //   ? this.state.filter_data
    //   : this.state.items_data;
      const dataProducts = items_data;
    return (
      <>
        <View style={styles.containerScreen}>
          <Animated.ScrollView
            contentContainerStyle={{flexGrow: 1}}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            onScrollBeginDrag={Animated.event(
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
            )}
            onScroll={Animated.event(
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
            )}>
            {this.state.isAll &&
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
              )}

            {/* <ListHeader title={header_title} /> */}

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingTop: 7,
              }}>
              {dataProducts !== null
                ? dataProducts.map((item, index) => (
                    <Items
                      key={item.id}
                      item={item}
                      index={index}
                      onPress={
                        item.type != 'loadmore'
                          ? this._goItem.bind(this, item)
                          : this._loadMore
                      }
                    />
                  ))
                : null}
            </View>
            {items_data == null || isEmpty(dataProducts) ? (
              <View style={[styles.containerScreen]}>
                {fetched && (
                  <NoResult
                    iconName="cart-off"
                    message={`${t('noProduct')} :(`}
                  />
                )}
              </View>
            ) : null}
          </Animated.ScrollView>
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
