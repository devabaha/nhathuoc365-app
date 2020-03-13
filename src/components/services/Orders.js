import React, { PureComponent } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import Loading from '../Loading';
import CardItem from '../../packages/tickid-phone-card/component/CardItem';

class Orders extends PureComponent {
  state = {
    loading: true,
    serviceOrders: []
  };
  unmounted = false;

  componentDidMount() {
    this.getServiceOrders();
  }

  componentWillUnmount() {
    this.unmounted = true;
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

  renderServiceOrder = ({ item: serviceOrder }) => {
    return (
      <CardItem
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
        ) : (
          <View style={styles.container}>
            <FlatList
              data={this.state.serviceOrders}
              renderItem={this.renderServiceOrder}
              keyExtractor={item => `${item.id}`}
              ListFooterComponent={<View style={styles.bottomList} />}
            />
          </View>
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
