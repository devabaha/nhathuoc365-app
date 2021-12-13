import React, {Component} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {setStater} from 'app-packages/tickid-chat/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push, pop, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, ButtonRoundedType} from 'src/components/base';
// custom components
import {FlatList, ScreenWrapper, AppFilledButton} from 'src/components/base';
import OrdersItemComponent from './OrdersItemComponent';
import RightButtonChat from '../RightButtonChat';
import RightButtonCall from '../RightButtonCall';
import NoResult from 'src/components/NoResult';

class StoreOrders extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      store_id: props.store_id || store.store_id,
      store_data: store.store_data,
      tel: props.tel || store.store_data.tel,
      title: props.title || store.store_data.name,
    };

    this._getData = this._getData.bind(this);
    this.unmounted = false;
    this.eventTracker = new EventTracker();

    this.updateNavBarDisposer = () => {};
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() =>
      refresh({
        title: this.state.title,
        right: this._renderRightButton.bind(this),
        onBack: () => {
          this._unMount();
          pop();
        },
      }),
    );

    this.start_time = time();

    // get data on this screen
    this._getData();

    // callback when unmount this sreen
    store.setStoreUnMount('StoreOrders', this._unMount);

    // Listenner
    Events.on(RELOAD_STORE_ORDERS, RELOAD_STORE_ORDERS + 'ID', this._getData);
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  _unMount() {
    Events.removeAll(RELOAD_STORE_ORDERS);
  }

  async _getData(delay) {
    try {
      const response = await APIHandler.site_cart_index(this.state.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        setStater(this, this.unmounted, {
          data: response.data,
        });
      } else {
        setStater(this, this.unmounted);
      }
    } catch (e) {
      console.log(e + ' site_cart_index');
      // store.addApiQueue('site_cart_index', this._getData.bind(this, delay));
    } finally {
      setStater(this, this.unmounted, {
        loading: false,
        refreshing: false,
      });
    }
  }
  _goStores(item, category_id) {
    action(() => {
      store.setStoreData(item);
    })();

    // hide tutorial go store
    if (this.props.that) {
      this.props.that.setState({
        show_go_store: false,
      });
    }

    if (store.no_refresh_home_change) {
      //Dang trong store khac, ko chay tai store
      pop();
    } else {
      //Ở Store chinh
      push(
        appConfig.routes.store,
        {
          title: item.name,
          goCategory: category_id,
        },
        this.theme,
      );
    }
  }
  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  _renderRightButton() {
    return (
      <View style={styles.right_btn_box}>
        <RightButtonCall tel={this.state.tel} />

        <RightButtonChat
          title={this.state.title || undefined}
          store_id={this.state.store_id || undefined}
          tel={this.state.tel}
        />
      </View>
    );
  }

  renderFooterEmptyComponent = () => {
    return (
      <AppFilledButton
        rounded={ButtonRoundedType.EXTRA_SMALL}
        onPress={this._goStores.bind(this, this.state.store_data)}
        style={styles.empty_box_btn}>
        {this.props.t('goStore')}
      </AppFilledButton>
    );
  };

  render() {
    var {loading, data, store_data} = this.state;

    if (loading) {
      return <Indicator />;
    }

    return (
      <ScreenWrapper style={styles.container}>
        {data != null ? (
          <FlatList
            safeLayout
            style={styles.items_box}
            data={this.state.data}
            extraData={this.state}
            renderItem={({item, index}) => {
              return (
                <OrdersItemComponent
                  // confirmCancelCart={this.confirmCancelCart.bind(this)}
                  // confirmCoppyCart={this.confirmCoppyCart.bind(this)}
                  // confirmEditCart={this.confirmEditCart.bind(this)}
                  hideContinue={this.props.hideContinue}
                  item={item}
                  from_page="store_orders"
                  goStore={this.props.goStore}
                  index={index}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        ) : (
          <NoResult
            iconBundle={BundleIconSetName.FONT_AWESOME}
            iconName="shopping-basket"
            message={this.props.t('emptyMessage')}
            renderFooterComponent={this.renderFooterEmptyComponent}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
  },
  right_btn_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  empty_box: {
    flex: 1,
    alignItems: 'center',
    marginTop: '50%',
  },
  empty_box_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  empty_box_btn_title: {},
});

export default withTranslation(['orders', 'common'])(observer(StoreOrders));
