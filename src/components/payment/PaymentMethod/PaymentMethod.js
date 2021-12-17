import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Loading from '@tickid/tickid-rn-loading';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {PAYMENT_METHOD_TYPES} from 'src/constants/payment';
import {TypographyType} from 'src/components/base';
// custom components
import ModernList from 'app-packages/tickid-modern-list';
import Button from 'src/components/Button';
import PaymentRow from './PaymentRow';
import TotalPrice from './TotalPrice';
import NoPaymentMethod from './NoPaymentMethod';
import PaymentMethodDetailLogo from './PaymentMethodDetailLogo';
import {
  Container,
  RefreshControl,
  ScreenWrapper,
  ScrollView,
  Typography,
} from 'src/components/base';

const DEFAULT_OBJECT = {};

class PaymentMethod extends Component {
  static contextType = ThemeContext;

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

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() => {
      refresh({
        title:
          this.props.title ||
          this.props.t('common:screen.paymentMethod.mainTitle'),
      });
    });
    this.getPaymentMethod();
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
      pop();
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
            pop();
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
        push(
          appConfig.routes.internetBanking,
          {
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
          },
          this.theme,
        );
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
      <ScreenWrapper style={styles.container}>
        <ScrollView
          safeLayout={!this.props.showSubmit}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <Container style={styles.box}>
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
          </Container>

          {this.props.showPrice && (
            <Container style={[styles.box, {paddingVertical: 7}]}>
              <View style={styles.priceInfoRow}>
                <Typography
                  type={TypographyType.LABEL_LARGE_TERTIARY}
                  style={styles.priceLabel}>
                  {t('payment.tempPrice')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.priceValue}>
                  {this.props.price}
                </Typography>
              </View>
              {Object.keys(extraFee).map((key, index) => {
                return (
                  <View key={index} style={styles.priceInfoRow}>
                    <Typography
                      type={TypographyType.LABEL_LARGE_TERTIARY}
                      style={styles.priceLabel}>
                      {key}
                    </Typography>
                    <Typography
                      type={TypographyType.LABEL_LARGE}
                      style={styles.priceValue}>
                      {extraFee[key]}
                    </Typography>
                  </View>
                );
              })}
            </Container>
          )}
        </ScrollView>
        {this.props.showSubmit && (
          <Button
            safeLayout
            showBackground
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
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    marginBottom: 15,
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
  },
  priceValue: {
    fontWeight: '500',
  },
  confirmContainer: {
    paddingVertical: 15,
  },
});

export default withTranslation(['paymentMethod', 'common'])(PaymentMethod);
