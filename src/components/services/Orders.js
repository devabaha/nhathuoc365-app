import React, { PureComponent } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import Loading from '../Loading';
import CardItem from '../../packages/tickid-phone-card/component/CardItem';
import NoResult from '../NoResult';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';

class Orders extends PureComponent {
  state = {
    loading: true,
    serviceOrders: []
  };
  unmounted = false;
  eventTracker = new EventTracker();

  componentDidMount() {
    this.getServiceOrders();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  getServiceOrders = async () => {
    try {
      const response = await APIHandler.service_orders();
      console.log(response);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          this.setState({ serviceOrders: response.data || [] });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || 'Có lỗi xảy ra'
          });
        }
      }
    } catch (err) {
      console.log('get_service_ordesr', err);
      flashShowMessage({
        type: 'danger',
        message: 'Có lỗi xảy ra'
      });
    } finally {
      !this.unmounted && this.setState({ loading: false });
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
      total_selected: serviceOrder.price_label
    };

    Actions.push(appConfig.routes.serviceFeedback, { cart_data });
  }

  renderServiceOrder = ({ item: serviceOrder }) => {
    return (
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
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? (
          <Loading center />
        ) : this.state.serviceOrders.length !== 0 ? (
          <View style={styles.container}>
            <FlatList
              data={this.state.serviceOrders}
              renderItem={this.renderServiceOrder}
              keyExtractor={item => `${item.id}`}
              ListFooterComponent={<View style={styles.bottomList} />}
            />
          </View>
        ) : (
          <NoResult iconName="alert-circle" message="Bạn chưa có đơn dịch vụ" />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomList: {
    height: 15
  }
});

export default Orders;
