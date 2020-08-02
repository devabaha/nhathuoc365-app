import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import appConfig from 'app-config';
import Loading from '../../../../components/Loading';
import NoResult from 'app-components/NoResult';
import { Bill } from '../../../Bills';
import Button from '../../../../components/Button';
import { CheckBox } from 'react-native-elements';

const EMPTY_PAYMENT_METHOD_MESS = 'Chưa chọn phương thức thanh toán';

class List extends Component {
  state = {
    paymentMethod: null,
    bills: null,
    isCheckedAllBills: true,
    checkedBills: [],
    title: '',
    loading: true,
    refreshing: false
  };
  unmounted = false;

  get totalPriceView() {
    const totalPrice = this.state.checkedBills.reduce(
      (total, bill) => total + bill.price,
      0
    );
    return numberFormat(totalPrice) + 'đ';
  }

  componentDidMount() {
    this.getIncompleteBills(this.state.isCheckedAllBills);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getIncompleteBills = async (isCheckedAllBills = false) => {
    const { t } = this.props;
    const data = {
      type: 'bills_incomplete'
    };
    try {
      const response = await APIHandler.site_bills_room(
        this.props.site_id,
        this.props.room_id,
        data
      );

      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          const state = { ...this.state };
          state.title = response.data.title_bills_incomplete;
          state.bills = response.data.bills_incomplete;
          isCheckedAllBills &&
            (state.checkedBills = response.data.bills_incomplete);

          this.setState(state);
        } else {
          const errMess = response.message || t('api.error.message');
          flashShowMessage({
            type: 'danger',
            message: errMess
          });
        }
      }
    } catch (err) {
      console.log(api, err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  };

  onPayment = () => {};

  handleChangePaymentMethod = paymentMethod => {
    this.setState({
      paymentMethod: paymentMethod ? paymentMethod.name : null
    });
    console.log(paymentMethod);
  };

  handleCheckBill(checkingBill) {
    const checkedBills = [...this.state.checkedBills];
    const billExistedIndex = checkedBills.findIndex(
      bill => bill.id === checkingBill.id
    );
    if (billExistedIndex !== -1) {
      checkedBills.splice(billExistedIndex, 1);
    } else {
      checkedBills.push(checkingBill);
    }

    const isCheckedAllBills = checkedBills.length === this.state.bills.length;

    this.setState({
      checkedBills,
      isCheckedAllBills
    });
  }

  handleToggleCheckAllBills = () => {
    this.setState(prevState => ({
      checkedBills: prevState.isCheckedAllBills ? [] : prevState.bills,
      isCheckedAllBills: !prevState.isCheckedAllBills
    }));
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getIncompleteBills();
  };

  goToBillPaymentMethod = () => {
    Actions.push(appConfig.routes.billsPaymentMethod, {
      id: this.props.site_id,
      onConfirm: this.handleChangePaymentMethod
    });
  };

  renderPriceView() {
    return (
      <View style={styles.priceViewContainer}>
        <Text style={styles.priceViewHeading}>Tổng tiền: </Text>
        <Text style={styles.priceViewValue}>{this.totalPriceView}</Text>
      </View>
    );
  }

  renderPaymentMethod() {
    const paymentMethodMess =
      this.state.paymentMethod || EMPTY_PAYMENT_METHOD_MESS;
    return (
      <View>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Hình thức thanh toán</Text>
          <TouchableOpacity onPress={this.goToBillPaymentMethod}>
            <Text style={styles.txtChangePaymentMethod}>Chọn</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.paymentMethod,
            !this.state.paymentMethod && styles.emptyPaymentMethod
          ]}
        >
          {paymentMethodMess}
        </Text>
      </View>
    );
  }

  renderBill = ({ item: bill, index }) => {
    const checked = !!this.state.checkedBills.find(b => b.id === bill.id);
    return (
      <Bill
        checkable
        checked={checked}
        index={index + 1}
        wrapperStyle={styles.billItemWrapper}
        containerStyle={styles.billItemContainer}
        status={bill.status}
        title={bill.title}
        period={bill.payment_period}
        price={bill.price_view}
        onPress={() => this.handleCheckBill(bill)}
        onCheck={() => this.handleCheckBill(bill)}
      />
    );
  };

  render() {
    const disabled =
      !this.state.paymentMethod || this.state.checkedBills.length === 0;
    const title = `${this.state.title} ${
      this.state.bills ? `(${this.state.bills.length})` : ''
    }`;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.state.bills && (
          <>
            <View
              style={[styles.headingContainer, styles.billsCheckableContainer]}
            >
              <CheckBox
                containerStyle={styles.checkBox}
                title={<View />}
                uncheckedIcon="square"
                uncheckedColor="#666"
                checked={this.state.isCheckedAllBills}
                checkedIcon="check-square"
                checkedColor={appConfig.colors.primary}
                onPress={this.handleToggleCheckAllBills}
              />
              <Text style={styles.heading}>{title}</Text>
            </View>
            <FlatList
              contentContainerStyle={styles.contentList}
              data={this.state.bills}
              renderItem={this.renderBill}
              ListEmptyComponent={
                <NoResult message="Danh sách hóa đơn đang trống" />
              }
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              keyExtractor={(item, index) => index.toString()}
            />
            {this.renderPaymentMethod()}
            <Button
              disabled={disabled}
              title="Thanh toán"
              onPress={this.onPayment}
              containerStyle={styles.btnContainer}
              btnContainerStyle={disabled && styles.btnDisabled}
              renderBefore={this.renderPriceView()}
            />
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  billsCheckableContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  checkBox: {
    backgroundColor: 'transparent',
    padding: 0,
    marginLeft: 0,
    borderWidth: 0,

    margin: 0,
    marginRight: 15
  },
  heading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  contentList: {
    flexGrow: 1
  },
  billItemWrapper: {
    flex: 1,
    marginRight: 16,
    marginBottom: 15
  },
  billItemContainer: {
    width: '100%'
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 15,
    paddingVertical: 10,
    marginBottom: 10
  },
  txtChangePaymentMethod: {
    color: appConfig.colors.primary,
    fontWeight: '500'
  },
  btnContainer: {
    backgroundColor: '#f0f0f0'
  },
  btnDisabled: {
    backgroundColor: '#aaa'
  },
  priceViewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: 15
  },
  priceViewHeading: {
    flex: 1,
    color: '#333',
    fontWeight: '500',
    letterSpacing: 1,
    fontSize: 15
  },
  priceViewValue: {
    fontSize: 20,
    color: appConfig.colors.primary,
    fontWeight: 'bold'
  },
  paymentMethod: {
    paddingHorizontal: 15,
    marginBottom: 15
  },
  emptyPaymentMethod: {
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

export default withTranslation()(List);
