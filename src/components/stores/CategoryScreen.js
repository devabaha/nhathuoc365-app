import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, RefreshControl, Text} from 'react-native';
import Swiper from 'react-native-swiper';
import Animated from 'react-native-reanimated';
import Items from './Items';
import ListHeader from './ListHeader';
import store from 'app-store';
import {Actions} from 'react-native-router-flux';
import NoResult from '../NoResult';
import ListStoreProductSkeleton from './ListStoreProductSkeleton';
import FilterProduct from './FilterProduct';
import {APIRequest} from 'src/network/Entity';
import APIHandler from 'src/network/APIHandler';
import {isEmpty, isEqual} from 'lodash';
import mobx from 'mobx';

const AUTO_LOAD_NEXT_CATE = 'AutoLoadNextCate';
const STORE_CATEGORY_KEY = 'KeyStoreCategory';
const CATE_AUTO_LOAD = 'CateAutoLoad';

const dataSort = [
  {id: 1, name: 'Phổ biến', value: 'ordering', isSelected: false},
  {id: 2, name: 'Bán chạy', value: 'sales', isSelected: false},
  {id: 3, name: 'Mới nhất', value: 'created', isSelected: false},
  {id: 4, name: 'Giá từ thấp đến cao', value: 'price', isSelected: false},
];
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
      paramsFilter: {},
      valueSort: {},
    };

    this.unmounted = false;
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
      Object.keys(this.props).some(
        (key) => nextProps[key] != this.props[key],
      ) &&
      !nextState.loading
    ) {
      this.start_time = time();
      // get list products by category_id
      this._getItemByCateId(item.id);
    }
    return true;
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   var {item, index, cate_index} = nextProps;

  //   if (
  //     index == cate_index &&
  //     this.state.items_data == null &&
  //     Object.keys(this.props).some(key=> nextProps[key] != this.props[key]) &&
  //     !this.state.loading
  //   ) {
  //     this.start_time = time();
  //     console.log(nextProps, this.props !== nextProps)
  //     // get list products by category_id
  //     this._getItemByCateId(item.id);
  //   }
  // }

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
              if (this.props.index == 0) {
                layoutAnimation();
              }

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

  async _getItemByCateIdFromServer(category_id, delay, loadmore) {
    const {paramsFilter} = this.state;
    var store_category_key =
      STORE_CATEGORY_KEY + store.store_id + category_id + store.user_info.id;
    const site_id = this.props.site_id || store.store_id;
    if (loadmore) {
      this.state.page += 1;
    } else {
      this.state.page = 0;
    }
    let response = {};
    try {
      if (!isEmpty(paramsFilter)) {
        console.log({paramsFilter});
        response = await APIHandler.filter_category_product(
          site_id,
          category_id,
          this.state.page,
          paramsFilter,
        );
        console.log({dataFilter: response});
      } else {
        response = await APIHandler.site_category_product(
          site_id,
          category_id,
          this.state.page,
        );
      }
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          // delay append data
          setTimeout(() => {
            if (this.props.index == 0) {
              layoutAnimation();
            }

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
            items_data: !isEmpty(paramsFilter) ? [] : this.state.items_data_bak,
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

  _loadMore = () => {
    this._getItemByCateIdFromServer(this.props.item.id, 0, true);
  };

  handleValue = async (value) => {
    await this.setState((prev) => ({
      valueSort: value,
      paramsFilter: {
        ...prev.paramsFilter,
        sort_by: value.value,
      },
    }));
    this._getItemByCateIdFromServer(this.props.item.id, 0, false);
    // if (type === 'tag') {
    //   if (this.props.startLoad) {
    //     console.log('loadd value');
    //     let min_price = '';
    //     let max_price = '';
    //     if (!!value['price']) {
    //       min_price = value['price'].min_price;
    //       max_price = value['price'].max_price;
    //     }
    //     const tag_id = Object.values(value)
    //       .map((i) => i?.id)
    //       .filter(Boolean)
    //       .join(',');
    //     const params = {
    //       min_price,
    //       max_price,
    //       tag: tag_id,
    //       order: 'asc',
    //       sort_by: this.state.valueSort.value,
    //     };

    //     await this.setState({paramsFilter: params});
    //     if (isEmpty(value)) {
    //       this._getItemByCateIdFromServer(this.props.item.id, 0, false);
    //       return;
    //     }
    //     this._getItemByCateIdFromServer(this.props.item.id, 0, false);
    //   }
    // } else {
    //   await this.setState((prev) => ({
    //     valueSort: value,
    //     paramsFilter: {
    //       ...prev.paramsFilter,
    //       sort_by: value.value,
    //     },
    //   }));
    //   this._getItemByCateIdFromServer(this.props.item.id, 0, false);
    // }
  };

  render() {
    const {t} = this.props;
    const {items_data, header_title, fetched, loading} = this.state;
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
            <FilterProduct
              selectedFilter={store.selectedFilter}
              dataSort={dataSort}
              onValueSort={this.handleValue}
            />

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingTop: 7,
              }}>
              {items_data != null
                ? items_data.map((item, index) => (
                    <Items
                      key={index}
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
            {items_data == null || isEmpty(items_data) ? (
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
