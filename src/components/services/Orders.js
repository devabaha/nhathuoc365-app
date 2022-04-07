import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import EventTracker from 'app-helper/EventTracker';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import Loading from 'src/components/Loading';
import CardItem from 'src/packages/tickid-phone-card/component/CardItem';
import NoResult from 'src/components/NoResult';
import {FlatList, ScreenWrapper} from 'src/components/base';

class Orders extends PureComponent {
  static contextType = ThemeContext;

  state = {
    loading: true,
    serviceOrders: [],
  };
  unmounted = false;
  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getServiceOrders();
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

  getServiceOrders = async () => {
    try {
      const response = await APIHandler.service_orders();
      console.log(response);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          this.setState({
            serviceOrders: response.data || [],
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || this.props.t('common:error.message'),
          });
        }
      }
    } catch (err) {
      console.log('get_service_ordesr', err);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  goToFeedbackService(serviceOrder) {
    const cart_data = {
      site_id: serviceOrder.site_id,
      cart_code: serviceOrder.id,
      shop_logo_url: serviceOrder.image,
      shop_name: serviceOrder.name,
      status: serviceOrder.status,
      status_view: serviceOrder.status_view,
      orders_time: serviceOrder.created,
      total_selected: serviceOrder.price_label,
    };
    push(appConfig.routes.rating, {cart_data}, this.theme);
  }

  renderServiceOrder = ({item: serviceOrder, index}) => {
    return (
      <View
        style={
          index === this.state.serviceOrders?.length - 1 && styles.lastItem
        }>
        <CardItem
          onPressService={() => this.goToFeedbackService(serviceOrder)}
          image={serviceOrder.image}
          cardId={serviceOrder.id}
          networkType={serviceOrder.type}
          networkName={serviceOrder.name}
          code={serviceOrder.code}
          price={serviceOrder.price_label}
          isPay={!!serviceOrder.is_pay}
          isUsed={!!serviceOrder.is_used}
          buyTime={serviceOrder.created}
          statusView={serviceOrder.status_view}
          syntaxPrepaid={serviceOrder.syntax_prepaid}
          syntaxPostpaid={serviceOrder.syntax_postpaid}
          cardCode={serviceOrder.data && serviceOrder.data.code}
          cardSeri={serviceOrder.data && serviceOrder.data.serial}
        />
      </View>
    );
  };

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading ? (
          <Loading center />
        ) : this.state.serviceOrders.length !== 0 ? (
          <View style={styles.container}>
            <FlatList
              safeLayout
              data={this.state.serviceOrders}
              renderItem={this.renderServiceOrder}
              keyExtractor={(item) => `${item.id}`}
            />
          </View>
        ) : (
          <NoResult
            iconName="alert-circle"
            message={this.props.t('noServiceOrder')}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lastItem: {
    marginBottom: 15,
  },
});

export default withTranslation('orders')(Orders);
