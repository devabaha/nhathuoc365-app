import React, { Component } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet, Text } from 'react-native';
import ModernList from 'app-packages/tickid-modern-list';
import Loading from '@tickid/tickid-rn-loading';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import Button from '../../Button';
import store from 'app-store';
import PaymentRow from './PaymentRow';

const DEFAULT_OBJECT = { id: -1 };

class PaymentMethod extends Component {
  static defaultProps = {
    onUpdatePaymentMethod: () => {},
    showPrice: true,
    showSubmit: true
  };

  state = {
    paymentMethod: [],
    selectedMethod: this.props.selectedMethod || DEFAULT_OBJECT,
    selectedBank: DEFAULT_OBJECT,
    loading: true
  };
  unmounted = false;

  componentDidMount() {
    this.getPaymentMethod();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getPaymentMethod = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.payment_method(store.store_id);

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({ paymentMethod: response.data || [] });
          }
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

  handleConfirm = async () => {
    // const selectedMethod =
    //   this.state.selectedMethod === DEFAULT_OBJECT
    //     ? null
    //     : this.state.selectedMethod;
    // const selectedBank =
    //   this.state.selectedBank === DEFAULT_OBJECT
    //     ? null
    //     : this.state.selectedBank;
    // this.props.onConfirm(selectedMethod, selectedBank);
    // Actions.pop();
    if (this.state.selectedMethod === DEFAULT_OBJECT) {
      Actions.pop();
      return;
    }

    this.setState({ loading: true });

    const data = {
      payment_type: this.state.selectedMethod.type,
      payment_content: ''
    };
    const { t } = this.props;
    try {
      const response = await APIHandler.add_payment_method(
        store.store_id,
        store.cart_data.id,
        data
      );

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.props.onUpdatePaymentMethod(response.data);
            store.setCartData(response.data);
            flashShowMessage({
              type: 'success',
              message: response.message
            });
            Actions.pop();
          }
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
    const extraFee = this.props.extraFee || {};

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

          {this.props.showPrice && (
            <View style={[styles.box, { paddingVertical: 7 }]}>
              <View style={styles.priceInfoRow}>
                <Text style={styles.priceLabel}>{t('payment.tempPrice')}</Text>
                <Text style={styles.priceValue}>{this.props.price}</Text>
              </View>
              {Object.keys(extraFee).map(key => {
                return (
                  <View style={styles.priceInfoRow}>
                    <Text style={styles.priceLabel}>{key}</Text>
                    <Text style={styles.priceValue}>{extraFee[key]}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        {this.props.showSubmit && (
          <Button
            renderBefore={
              this.props.showPrice && (
                <TotalPrice t={t} value={this.props.totalPrice} />
              )
            }
            containerStyle={styles.confirmContainer}
            title={t('confirm')}
            onPress={this.handleConfirm}
          />
        )}
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
    paddingVertical: 15,
    paddingBottom: 30
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

export default withTranslation(['paymentMethod', 'common'])(PaymentMethod);

const TotalPrice = props => {
  return (
    <View style={[styles.priceInfoRow, styles.totalPriceInfoRow]}>
      <Text style={[styles.priceLabel, styles.totalPriceText]}>
        {props.t('payment.totalPrice')}
      </Text>
      <Text style={[styles.totalPriceValue, styles.totalPriceText]}>
        {props.value}
      </Text>
    </View>
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
