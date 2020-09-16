import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';

import appConfig from 'app-config';
import store from 'app-store';

import Button from '../../../../components/Button';
import Loading from '../../../../components/Loading';
import HorizontalInfoItem from '../../../../components/account/HorizontalInfoItem';

import APIRequest from '../../../../network/Entity/APIRequest/APIRequest';

import Block from '../Block';
import { getProgressDataActivedComponent } from '../helper';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    borderBottomWidth: 0.5,
    borderColor: '#f0f0f0'
  }
});

class Confirm extends Component {
  state = {
    confirmData: this.normalizeConfirmData
  };
  saveBookingRequest = new APIRequest();
  requests = [this.saveBookingRequest];

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  get normalizeConfirmData() {
    const {
      customer: { name, tel, email, address },
      room: { price_reserve_view, time_reserve }
    } = this.props;

    return [
      {
        title: 'Thông tin khách mua',
        data: [
          {
            title: 'Bên mua',
            value: name
          },
          {
            title: 'Số điện thoại',
            value: tel
          },
          {
            title: 'Email',
            value: email
          },
          {
            title: 'Địa chỉ',
            value: address,
            columnView: true
          }
        ]
      },
      {
        title: 'Thông tin booking',
        data: [
          {
            title: 'Ngày booking',
            value: moment().format('ll')
          },
          {
            title: 'Thời gian booking',
            value: time_reserve
          },
          {
            title: 'Số tiền cọc',
            value: price_reserve_view
          }
        ]
      }
    ];
  }

  async saveBooking() {
    this.setState({ loading: true });
    const { t } = this.props;
    const data = {
      site_id: this.props.site_id,
      //
      customer_code: this.props.customer.code,
      //
      id_code: this.props.staff.id_code,
      company_name: this.props.staff.company_name,
      //
      total_price: this.props.room.total_price,
      product_code: this.props.room.product_code,
      price_contract: this.props.room.price_contract,
      group_cart_code: this.props.room.group_cart_code,
      maintenance_fee: this.props.room.maintenance_fee,
      price_without_vat: this.props.room.price_without_vat,
      total_contract_value: this.props.room.total_contract_value
    };
    try {
      this.saveBookingRequest.data = APIHandler.user_create_reservation_bill_beeland_beeland(
        data
      );
      const response = await this.saveBookingRequest.promise();
      console.log(response);
      if (response.status === STATUS_SUCCESS && response.data) {
        store.forceReloadProjectProductBeeLand(true);
        this.goToDepositPayment(response.data.bill);
        flashShowMessage({
          type: 'success',
          message: response.message
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
    } catch (err) {
      console.log('save_booking_beeland', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  goToDepositPayment(bill) {
    Actions.push(appConfig.routes.billsPaymentMethod, {
      title: 'Thanh toán cọc',
      site_id: this.props.siteId,
      id_code: bill.id_code,
      company_name: bill.company_name,
      price: bill.price_reserve || 0,
      ids: [bill.id],
      onSubmit: () =>
        Actions.popTo(`${appConfig.routes.projectProductBeeLand}_1`),
      transferInfoHeaderComponent: getProgressDataActivedComponent(3),
      headerComponent: getProgressDataActivedComponent(2)
    });
  }

  renderRowConfirm(rows) {
    return rows.map((row, index) => (
      <HorizontalInfoItem
        key={index}
        data={row}
        containerStyle={index !== rows.length - 1 && styles.row}
      />
    ));
  }

  renderConfirmData() {
    return this.state.confirmData.map((section, index) => {
      return (
        <Block key={index} title={section.title}>
          {this.renderRowConfirm(section.data)}
        </Block>
      );
    });
  }

  render() {
    console.log(this.props);
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {getProgressDataActivedComponent(1)}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {this.renderConfirmData()}
        </ScrollView>
        <Button title="Lưu Booking" onPress={this.saveBooking.bind(this)} />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Confirm);
