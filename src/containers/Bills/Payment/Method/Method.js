import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import ModernList from 'app-packages/tickid-modern-list';
import Loading from '@tickid/tickid-rn-loading';
import PaymentRow from '../../../../components/payment/PaymentMethod/PaymentRow';
import Button from '../../../../components/Button';

import appConfig from 'app-config';

const DEFAULT_OBJECT = { id: -1, type: -1 };

class Method extends Component {
  static defaultProps = {
    onUpdatePaymentMethod: () => {}
  };

  state = {
    paymentMethod: [],
    selectedMethod: this.props.selectedMethod || DEFAULT_OBJECT,
    selectedBank: DEFAULT_OBJECT,
    loading: true
  };
  unmounted = false;

  get confirmTitle() {
    const { t } = this.props;
    let title = t('agree');
    switch (this.state.selectedMethod.type) {
      case PAYMENT_METHOD_TYPES.EPAY:
        title = t('confirm');
        break;
    }

    return title;
  }

  get transferFeeView() {
    let transferFee = 0;
    const currentFee = this.state.selectedMethod.user_fee || '0';
    if (currentFee) {
      const [fee, percentTag] = currentFee.split('%');
      if (percentTag) {
        transferFee = currentFee * (fee / 100);
      } else {
        transferFee = +fee;
      }
    }

    return {
      value: transferFee,
      view: vndCurrencyFormat(transferFee)
    };
  }

  get priceView() {
    const price = this.props.price || 0;
    return {
      value: price,
      view: vndCurrencyFormat(price)
    };
  }

  get totalPriceView() {
    let totalPrice = this.transferFeeView.value + this.priceView.value;
    return {
      value: totalPrice,
      view: vndCurrencyFormat(totalPrice)
    };
  }

  componentDidMount() {
    this.getPaymentMethod();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getPaymentMethod = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.payment_method(this.props.site_id);
      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          const state = { ...this.state };
          state.paymentMethod = response.data || [];
          const selectedMethod = response.data.find(item => item.default_flag);
          if (selectedMethod) {
            state.selectedMethod = selectedMethod;
          }
          this.setState(state);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (err) {
      console.log('get_payment_method', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  async createEpayTransfer() {
    this.setState({ loading: true });
    const { t } = this.props;
    const data = {
      bill_ids: this.props.ids,
      amount: this.totalPriceView.value
    };
    try {
      const response = await APIHandler.site_transfer_pay_va(
        this.props.site_id,
        this.props.room_id,
        data
      );

      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          Actions.push(appConfig.routes.transferInfo, {
            info: response.data.va_info,
            heading: this.state.selectedMethod.name,
            note: this.state.selectedMethod.content
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (err) {
      console.log('create_transfer_epay', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  }

  handleBankPress = selectedBank => {
    this.setState({ selectedBank });
  };

  onPressPaymentMethod = item => {
    const isExisted =
      this.state.selectedMethod && this.state.selectedMethod.id === item.id;
    this.setState({
      selectedMethod: isExisted ? DEFAULT_OBJECT : item
    });

    // switch (item.type) {
    //   case '2':
    //     Actions.push(appConfig.routes.internetBanking, {
    //       onPressBank: this.handleBankPress
    //     });
    //     break;
    // }
  };

  handleConfirm = async () => {
    switch (this.state.selectedMethod.type) {
      case PAYMENT_METHOD_TYPES.EPAY:
        this.createEpayTransfer();
        break;
      default:
        Actions.replace(appConfig.routes.room, {
          room_id: this.props.room_id,
          site_id: this.props.site_id
        });
        break;
    }
  };

  renderPaymentMethod(item, index) {
    return (
      <PaymentRow
        key={index}
        title={item.name}
        subTitle={item.content}
        onPress={() => this.onPressPaymentMethod(item)}
        active={item.id === this.state.selectedMethod.id}
        image={item.type === '3' && item.image}
        /**
         * Specify style for bank transfer
         */
        bankTransferData={item.type === '2' && item.data}
        // renderRight={
        //   item.type === '1' &&
        //   this.state.selectedBank && (
        //     <BankLogo image={this.state.selectedBank.image} />
        //   )
        // }
      />
    );
  }

  render() {
    const { t } = this.props;
    const extraData = this.state.selectedMethod.id + this.state.selectedBank.id;
    const disabled = this.state.selectedMethod.id === -1;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.box}>
            {this.state.loading && <Loading loading />}
            <ModernList
              extraData={extraData}
              data={this.state.paymentMethod}
              headerTitle={t('method.selectTitle')}
              renderItem={this.renderPaymentMethod.bind(this)}
              listEmptyComponent={
                !this.state.loading && (
                  <NoPaymentMethod message={t('method.emptyMessage')} />
                )
              }
            />
          </View>
        </ScrollView>

        <Button
          renderBefore={
            <TotalPrice
              t={t}
              transferFeeLabel={t('payment.transferFee')}
              transferFee={this.transferFeeView.view}
              priceLabel={t('payment.totalPrice')}
              price={this.totalPriceView.view}
            />
          }
          disabled={disabled}
          containerStyle={styles.confirmContainer}
          title={this.confirmTitle}
          onPress={this.handleConfirm}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  check: {
    fontSize: 18,
    marginRight: 10
  },
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3
  },
  subPaymentMethodLabel: {
    fontSize: 13,
    color: '#8c8c8c'
  },
  box: {
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  priceInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceLabel: {
    color: '#555',
    fontSize: 16
  },
  priceValue: {
    fontWeight: '500',
    color: '#242424',
    fontSize: 16
  },
  confirmContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 15,
    paddingBottom: 10
  },
  totalPriceInfoRow: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    paddingTop: 0
  },
  totalPriceValue: {
    color: DEFAULT_COLOR,
    fontSize: 20,
    fontWeight: '600'
  },
  bankLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bankLogo: {
    resizeMode: 'contain',
    width: 80,
    flex: 1
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  noResultText: {
    color: '#777'
  }
});

export default withTranslation(['paymentMethod', 'common'])(Method);

const TotalPrice = props => {
  return (
    <>
      <View style={[styles.priceInfoRow, styles.totalPriceInfoRow]}>
        <Text style={styles.priceLabel}>{props.transferFeeLabel}</Text>
        <Text style={styles.priceValue}>{props.transferFee}</Text>
      </View>
      <View style={[styles.priceInfoRow, styles.totalPriceInfoRow]}>
        <Text style={[styles.priceLabel, styles.totalPriceText]}>
          {props.priceLabel}
        </Text>
        <Text style={[styles.totalPriceValue, styles.totalPriceText]}>
          {props.price}
        </Text>
      </View>
    </>
  );
};

const BankLogo = props => {
  return (
    <View style={styles.bankLogoContainer}>
      <CachedImage
        mutable
        source={{ uri: props.image }}
        style={styles.bankLogo}
      />
    </View>
  );
};

const NoPaymentMethod = props => (
  <View style={styles.noResultContainer}>
    <Text style={styles.noResultText}>{props.message}</Text>
  </View>
);
