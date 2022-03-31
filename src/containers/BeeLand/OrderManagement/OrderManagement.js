import React, { Component } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Loading from '../../../components/Loading';
import NoResult from '../../../components/NoResult';
import { APIRequest } from '../../../network/Entity';
import { getProgressDataActivedComponent } from '../Booking/helper';
import Reservation from './Reservation';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footerLoadingContainer: {
    height: 60
  },
  footerLoading: {
    height: '100%'
  }
});

class OrderManagement extends Component {
  state = {
    listReservation: [],
    loading: true,
    refreshing: false,
    isLoadMore: false,
    canLoadMore: false
  };
  getListReservationRequest = new APIRequest();
  requests = [this.getListReservationRequest];
  limit = 30;
  offset = 0;

  componentDidMount() {
    this.getListReservation();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getListReservation(isLoadMore = false) {
    const { t } = this.props;
    const data = {
      limit: this.limit,
      offset: this.offset
    };
    try {
      this.getListReservationRequest.data = APIHandler.user_list_reservation_beeland(
        data
      );
      const response = await this.getListReservationRequest.promise();
      if (response && response.status === STATUS_SUCCESS) {
        this.handleResponse(response.data.bills, isLoadMore);
      } else {
        this.offset -= this.limit;
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
      console.log(response);
    } catch (err) {
      console.log('%cget_list_reservation_beeland', 'color: red', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
        isLoadMore: false
      });
    }
  }

  handleResponse(newListReservation, isLoadMore) {
    let listReservation = [];
    if (isLoadMore) {
      if (newListReservation.length === 0) {
        this.offset -= this.limit;
      } else {
        listReservation = [...this.state.listReservation].concat(
          newListReservation
        );
      }
    } else {
      listReservation = newListReservation;
    }

    if (listReservation.length !== 0) {
      this.setState({
        listReservation,
        canLoadMore: true
      });
    } else {
      this.setState({
        canLoadMore: false
      });
    }
  }

  handleReservationPress(reservation) {
    Actions.push(appConfig.routes.billsPaymentMethod, {
      title: 'Thanh toán cọc',
      site_id: reservation.site_id,
      id_code: reservation.id_code,
      company_name: reservation.company_name,
      price: reservation.price_reserve || 0,
      ids: [reservation.id],
      onSubmit: () => {
        this.getListReservation();
        Actions.popTo(`${appConfig.routes.orderManagementBeeLand}_1`);
      },
      transferInfoHeaderComponent: getProgressDataActivedComponent(3),
      headerComponent: getProgressDataActivedComponent(2)
    });
  }

  onRefresh() {
    this.offset = 0;
    this.setState({ refreshing: true });
    this.getListReservation();
  }

  onLoadMore() {
    if (this.state.canLoadMore && !this.state.isLoadMore) {
      this.offset += this.limit;
      this.setState({ isLoadMore: true }, () => {
        this.getListReservation(true);
      });
    }
  }

  renderReservation({ item: reservation, index }) {
    return (
      <Reservation
        code={reservation.id}
        date={reservation.created}
        status={reservation.status}
        statusColor={reservation.status_color}
        image={reservation.image_url}
        projectName={reservation.project_name}
        name={reservation.product_name}
        total={reservation.total_price_view}
        deposit={reservation.price_reserve_view}
        isPaid={reservation.status_code !== 6}
        onPress={() => this.handleReservationPress(reservation)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          {this.state.loading && <Loading center />}
          <FlatList
            data={this.state.listReservation}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={this.renderReservation.bind(this)}
            onEndReached={this.onLoadMore.bind(this)}
            onEndReachedThreshold={0.4}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh.bind(this)}
                refreshing={this.state.refreshing}
              />
            }
            ListEmptyComponent={
              !this.state.loading && <NoResult message="Không có đơn hàng" />
            }
            ListFooterComponent={
              this.state.isLoadMore && (
                <View style={styles.footerLoadingContainer}>
                  <Loading style={styles.footerLoading} size="small" />
                </View>
              )
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default withTranslation()(OrderManagement);
