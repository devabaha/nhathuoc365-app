import React, {Component} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';
import ModernList from 'app-packages/tickid-modern-list';
import Loading from '@tickid/tickid-rn-loading';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import Button from '../../Button';
import store from 'app-store';
import PaymentRow from './PaymentRow';
import EventTracker from '../../../helper/EventTracker';
import {PAYMENT_METHOD_TYPES} from '../../../constants/payment';

const DEFAULT_OBJECT = {};

class PaymentMethod extends Component {
  static defaultProps = {
    onUpdatePaymentMethod: () => {},
    showPrice: true,
    showSubmit: true,
    store_id: store.store_data?.id,
    cart_id: store.cart_data?.id,
  };

  state = {
    paymentMethod: [],
    selectedMethod: this.props.selectedMethod || DEFAULT_OBJECT,
    selectedPaymentMethodDetail:
      this.props.selectedPaymentMethodDetail ||
      store.cart_data?.payment_method_detail ||
      {},
    loading: true,
    refreshing: false,
  };
  unmounted = false;
  eventTracker = new EventTracker();

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        title:
          this.props.title ||
          this.props.t('common:screen.paymentMethod.mainTitle'),
      });
    });
    this.getPaymentMethod();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  getPaymentMethod = async () => {
    const {t} = this.props;
    try {
      const response = await APIHandler.payment_method(this.props.store_id);

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          if (response.data) {
            let selectedMethod = null;
            if (Array.isArray(response.data)) {
              selectedMethod =
                response.data.find((item) => item.default_flag === 1) || {};
            }
            this.setState({
              paymentMethod: response.data || [],
              selectedMethod: this.state.selectedMethod?.id
                ? this.state.selectedMethod
                : selectedMethod,
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      }
    } catch (err) {
      console.log('get_payment_method', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false, refreshing: false});
    }
  };

  handleConfirm = async () => {
    if (this.state.selectedMethod === DEFAULT_OBJECT) {
      Actions.pop();
      return;
    }

    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm({
        paymentType: this.state.selectedMethod.type,
        paymentMethodId: this.state.selectedPaymentMethodDetail?.id || '',
      });
      return;
    }

    this.setState({loading: true});

    const data = {
      gateway:
        this.state.selectedPaymentMethodDetail?.gateway !== undefined
          ? this.state.selectedPaymentMethodDetail.gateway
          : this.state.selectedMethod.gateway,
      payment_type: this.state.selectedMethod.type,
      payment_content: '',
      payment_method_id: this.state.selectedPaymentMethodDetail?.id || '',
    };
    const {t} = this.props;
    try {
      const response = await APIHandler.add_payment_method(
        this.props.store_id,
        this.props.cart_id,
        data,
      );

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.props.onUpdatePaymentMethod(response.data);
            store.setCartData(response.data);
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
            Actions.pop();
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      }
    } catch (err) {
      console.log('get_payment_method', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  handleSelectPaymentMethodDetail = (
    paymentMethod,
    isSelected,
    selectedPaymentMethodDetail,
  ) => {
    // this.setState({
    //   selectedMethod: isSelected ? DEFAULT_OBJECT : paymentMethod,
    //   selectedPaymentMethodDetail: selectedPaymentMethodDetail
    //     ? {...selectedPaymentMethodDetail, type: paymentMethod?.type}
    //     : DEFAULT_OBJECT,
    // });
    this.setState({
      selectedMethod: paymentMethod,
      selectedPaymentMethodDetail: selectedPaymentMethodDetail
        ? {...selectedPaymentMethodDetail, type: paymentMethod?.type}
        : {},
    });
  };

  onPressPaymentMethod = (item) => {
    const isSelected =
      this.state.selectedMethod && this.state.selectedMethod.id == item.id;

    switch (item.type) {
      case PAYMENT_METHOD_TYPES.MOBILE_BANKING:
        // case PAYMENT_METHOD_TYPES.DOMESTIC_ATM:
        // case PAYMENT_METHOD_TYPES.DEBIT_CREDIT:
        // if (!isSelected) {
        Actions.push(appConfig.routes.internetBanking, {
          title: item.title,
          siteId: store?.store_data?.id,
          paymentMethodId: item.id,
          onPressPaymentMethodDetail: (selectedPaymentMethodDetail) => {
            this.handleSelectPaymentMethodDetail(
              item,
              isSelected,
              selectedPaymentMethodDetail,
            );
          },
        });
        // } else {
        //   this.handleSelectPaymentMethodDetail(item, isSelected);
        // }
        break;
      default:
        this.handleSelectPaymentMethodDetail(item, isSelected);
        break;
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getPaymentMethod();
  };

  renderPaymentMethod(item, index) {
    return (
      <PaymentRow
        key={index}
        title={item.name}
        subTitle={item.content}
        onPress={() => this.onPressPaymentMethod(item)}
        active={item.id == this.state.selectedMethod.id}
        image={item.image}
        /**
         * Specify style for bank transfer
         */
        bankTransferData={
          item.type === PAYMENT_METHOD_TYPES.BANK_TRANSFER && item.data
        }
        renderRight={
          this.state.selectedPaymentMethodDetail?.type == item.type && (
            <PaymentMethodDetailLogo
              image={this.state.selectedPaymentMethodDetail.image}
            />
          )
        }
      />
    );
  }

  render() {
    const {t} = this.props;
    const extraData =
      this.state.selectedMethod.id + this.state.selectedPaymentMethodDetail.id;
    const extraFee = this.props.extraFee || {};

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={styles.box}>
            {this.state.loading && <Loading loading />}
            <ModernList
              scrollEnabled={false}
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
            <View style={[styles.box, {paddingVertical: 7}]}>
              <View style={styles.priceInfoRow}>
                <Text style={styles.priceLabel}>{t('payment.tempPrice')}</Text>
                <Text style={styles.priceValue}>{this.props.price}</Text>
              </View>
              {Object.keys(extraFee).map((key, index) => {
                return (
                  <View key={index} style={styles.priceInfoRow}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    fontSize: 18,
    marginRight: 10,
  },
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  subPaymentMethodLabel: {
    fontSize: 13,
    color: '#8c8c8c',
  },
  box: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  priceInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    flex: 1,
    color: '#555',
    fontSize: 16,
  },
  priceValue: {
    fontWeight: '500',
    color: '#242424',
    fontSize: 16,
  },
  confirmContainer: {
    // backgroundColor: '#fff',
    paddingVertical: 15,
    paddingBottom: appConfig.device.bottomSpace || 15,
  },
  totalPriceInfoRow: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  totalPriceValue: {
    color: DEFAULT_COLOR,
    fontSize: 20,
    fontWeight: '600',
  },
  paymentMethodDetailLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodDetailLogo: {
    marginLeft: 10,
    resizeMode: 'contain',
    width: 50,
    height: 50,
    flex: 1,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  noResultText: {
    color: '#777',
  },
});

export default withTranslation(['paymentMethod', 'common'])(PaymentMethod);

const TotalPrice = (props) => {
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

const PaymentMethodDetailLogo = (props) => {
  return (
    <View style={styles.paymentMethodDetailLogoContainer}>
      <CachedImage
        mutable
        source={{uri: props.image}}
        style={styles.paymentMethodDetailLogo}
      />
    </View>
  );
};

const NoPaymentMethod = (props) => (
  <View style={styles.noResultContainer}>
    <Text style={styles.noResultText}>{props.message}</Text>
  </View>
);
