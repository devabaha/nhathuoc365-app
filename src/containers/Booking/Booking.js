import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {isUnpaid, canTransaction} from 'app-helper/product';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {refresh, pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ButtonRoundedType, TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import ScheduleSection from './ScheduleSection';
import BookingProductInfo from './BookingProductInfo';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import PopupConfirm from 'src/components/PopupConfirm';
import RightButtonChat from 'src/components/RightButtonChat';
import {
  PricingAndPromotionSection,
  StoreInfoSection,
  NoteSection,
  CommissionsSection,
  ActionButtonSection,
  PaymentMethodSection,
  OrderInfoSection,
} from 'src/components/payment/Confirm/components';
import {
  ScreenWrapper,
  RefreshControl,
  AppOutlinedButton,
} from 'src/components/base';
// skeleton
import BookingSkeleton from './BookingSkeleton';

const DEBOUNCE_UPDATE_BOOKING_TIME = 500;
const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 10,
  },
  btnContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  btnContentContainer: {
    borderRadius: 0,
    height: 60,
  },

  unselectedContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unselected: {
    fontStyle: 'italic',
  },

  updateLoadingWrapper: {
    top: 15,
    right: 15,
    left: undefined,
    bottom: undefined,
  },
});

export class Booking extends Component {
  static contextType = ThemeContext;

  state = {
    booking: {},
    bookingTimes: [],
    addressId: '',
    model: '',
    selectedAttrViewData: [],

    loading: true,
    updateLoading: false,
    refreshing: false,

    quantity: MIN_QUANTITY,

    tempNote: '',
    note: '',
    date: '',
    time: {},
    timeValue: '',
    paymentType: '',
    paymentMethodId: '',
  };
  refScrollView = React.createRef();
  refPopupCancelBooking = React.createRef();

  scrollContentSizeY = 0;
  scrollOffsetY = 0;
  resetScrollToCoords = {x: 0, y: 0};
  noteHeight = 0;

  getBookingRequest = new APIRequest();
  getBookingTimesRequest = new APIRequest();
  updateBookingRequest = new APIRequest();
  orderBookingRequest = new APIRequest();
  cancelBookingRequest = new APIRequest();
  requests = [
    this.getBookingRequest,
    this.getBookingTimesRequest,
    this.updateBookingRequest,
    this.orderBookingRequest,
    this.cancelBookingRequest,
  ];
  eventTracker = new EventTracker();
  unmounted = false;
  isInitData = false;
  isInitModel = false;

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get editable() {
    return this.state.booking?.status == CART_STATUS_ORDERING;
  }

  get cancelable() {
    return (
      this.state.booking?.status >= CART_STATUS_READY &&
      this.state.booking?.status < CART_STATUS_COMPLETED
    );
  }

  get isDisabled() {
    return (
      this.state.loading ||
      (!!this.props.models && !this.state.model) ||
      !this.state.quantity ||
      // !this.state.addressId ||
      !this.state.date ||
      !this.state.timeValue
    );
  }

  get storeInfo() {
    return this.state.booking?.store || {};
  }

  get voucher() {
    return this.state.booking?.user_voucher || {};
  }

  get mainProduct() {
    return Object.values(this.state.booking?.products || {})[0] || {};
  }

  getMainProduct(products = {}) {
    return Object.values(products)[0] || {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !!this.isInitData &&
      ((this.isInitModel &&
        !!nextState.model &&
        nextState.model !== this.state.model) ||
        nextState.quantity !== this.state.quantity ||
        nextState.addressId !== this.state.addressId ||
        nextState.note !== this.state.note ||
        (nextState.date &&
          (nextState.date !== this.state.date ||
            (nextState.timeValue &&
              nextState.timeValue !== this.state.timeValue))) ||
        nextState.paymentType !== this.state.paymentType ||
        nextState.paymentMethodId !== this.state.paymentMethodId)
    ) {
      this.updateBooking(
        nextState,
        nextState.paymentType !== this.state.paymentType ||
          nextState.paymentMethodId !== this.state.paymentMethodId,
      );
    }

    return true;
  }

  componentDidMount() {
    this.getBooking();
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );

    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.updateNavBarDisposer();
    this.eventTracker.clearTracking();
  }

  updateNavBar = (booking = this.state.booking) => {
    if (!booking || this.unmounted) return;
    const navbarConfig = {
      right: () => (
        <RightButtonChat
          store_id={booking?.site?.id}
          title={booking?.site?.name}
          tel={booking?.site?.tel}
        />
      ),
    };

    if (booking.cart_code) {
      navbarConfig.title = '#' + booking.cart_code;
    }

    refresh(navbarConfig);
  };

  getBooking = async (bookingId = this.props.bookingId) => {
    const data = {
      product_id: this.props.productId,
    };
    const apiHandler = bookingId
      ? APIHandler.booking_show(this.props.siteId, bookingId)
      : APIHandler.booking_store(this.props.siteId, data);

    this.getBookingRequest.data = apiHandler;

    try {
      const response = await this.getBookingRequest.promise();
      if (this.unmounted) return;
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.updateStateBooking(response.data);
            this.updateNavBar(response.data);
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('get_booking', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  };

  getBookingTimes = async (date = this.state.date) => {
    if (!this.state.booking) return;

    const data = {
      date,
    };

    this.getBookingTimesRequest.data = APIHandler.booking_get_booking_times(
      this.props.siteId,
      this.state.booking?.id,
      data,
    );

    try {
      const response = await this.getBookingTimesRequest.promise();
      if (this.unmounted) return;

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              bookingTimes: this.formatBookingTimes(response.data),
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('get_booking_times', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  };

  updateBooking = debounce(async (state = this.state, forceUpdate = false) => {
    if ((!this.editable || !this.state.booking) && !forceUpdate) return;
    !this.state.loading &&
      this.setState({
        updateLoading: true,
      });

    const data = {
      model: state.model,
      quantity: state.quantity,
      time: this.getDateTimeValue(state),
      address_id: state.addressId,
      user_note: state.note || state.tempNote,
      payment_type: state.paymentType,
      payment_method_id: state.paymentMethodId,
    };

    this.updateBookingRequest.data = APIHandler.booking_update(
      this.props.siteId,
      this.state.booking?.id,
      data,
    );

    try {
      const response = await this.updateBookingRequest.promise();
      if (this.unmounted) return;
      console.log('update', response, data);

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.updateStateBooking(response.data);
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('update_booking', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({
        updateLoading: false,
        loading: false,
      });
    }
  }, DEBOUNCE_UPDATE_BOOKING_TIME);

  orderBooking = async () => {
    if (!this.state.booking) return;

    this.setState({loading: true});

    this.orderBookingRequest.data = APIHandler.booking_order(
      this.props.siteId,
      this.state.booking?.id,
    );

    try {
      const response = await this.orderBookingRequest.promise();
      if (this.unmounted) return;
      console.log('order_booking', response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          flashShowMessage({
            type: 'success',
            message: response.message,
          });
          if (canTransaction(response.data)) {
            this.goToTransaction(response.data.site_id, response.data.id);
          } else {
            pop();
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('order_booking', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({
        loading: false,
      });
    }
  };

  cancelBooking = async () => {
    if (!this.state.booking) return;

    this.setState({loading: true});

    this.cancelBookingRequest.data = APIHandler.booking_cancel(
      this.props.siteId,
      this.state.booking?.id,
    );

    try {
      const response = await this.cancelBookingRequest.promise();
      console.log('cancel', response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          flashShowMessage({
            type: 'success',
            message: response.message,
          });
          pop();
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('cancel_booking', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({
        loading: false,
      });
    }
  };

  updateStateBooking = (booking) => {
    if (!booking) return;
    let state = {
      booking,
    };

    if (!this.state.booking?.id) {
      if (!this.state.time?.value) {
        state.time = this.formatBookingTime(booking.booking_hour_selected);
        state.timeValue = booking.booking_hour;
      }

      state = {
        bookingTimes: this.formatBookingTimes(booking.booking_times),
        addressId: booking.address_id,
        date: booking.booking_date,
        tempNote: booking.user_note || '',
        note: booking.user_note,
        model: this.getMainProduct(booking.products).model,
        paymentType: booking.payment_type,
        paymentMethodId: booking.payment_method?.id,
        ...state,
      };
    }

    if (
      booking.booking_date === this.state.date &&
      booking.booking_hour_selected?.value === this.state.time.value &&
      !booking.booking_hour_selected?.available
    ) {
      state.time = {};
      state.timeValue = '';
      state.bookingTimes = this.formatBookingTimes(booking.booking_times);
    }

    this.setState(state, () => {
      this.isInitData = true;
    });
  };

  formatBookingTimes = (bookingTimes = []) => {
    const formattedBookingTimes = bookingTimes.map(this.formatBookingTime);
    return formattedBookingTimes;
  };

  formatBookingTime = (bookingTime) => {
    return {
      ...bookingTime,
      disabled: !bookingTime?.available,
    };
  };

  getDateTimeValue = (state) => {
    return (state.date || '') + (state.timeValue ? ' ' + state.timeValue : '');
  };

  goToTransaction = (
    siteId = this.state.booking?.site_id,
    cartId = this.state.booking?.id,
  ) => {
    push(appConfig.routes.transaction, {
      siteId,
      cartId,
      onPop: () => {
        this.setState({loading: true});
        this.getBooking(this.state.booking.id);
      },
    });
  };

  handleSelectAttr = (selectedAttr, model) => {
    this.setState({model}, () => {
      if (!this.isInitModel && model) {
        this.isInitModel = true;
      }
    });
  };

  handleChangeQuantity = (quantity) => {
    this.setState({quantity});
  };

  handleChangeStore = () => {
    push(appConfig.routes.myAddress, {
      goBack: true,
      isVisibleStoreAddress: true,
      isVisibleUserAddress: false,
      selectedAddressId: this.state.addressId,
      onSelectAddress: (addressId) => {
        if (addressId !== this.state.addressId) {
          this.setState({addressId, loading: true});
        }
      },
    });
  };

  handleChangeDate = (date) => {
    if (date === this.state.date) return;

    this.setState({date, loading: true, time: {}, timeValue: ''});
    this.getBookingTimes(date);
  };

  handleChangeTime = (time) => {
    this.setState({time, timeValue: time.value});
  };

  handleChangePaymentMethod = () => {
    push(appConfig.routes.paymentMethod, {
      selectedMethod: this.state.booking.payment_method,
      selectedPaymentMethodDetail: this.state.booking.payment_method_detail,
      price: this.state.booking.total_before_view,
      totalPrice: this.state.booking.total_selected,
      extraFee: this.state.booking.item_fee,
      store_id: this.state.booking.site_id,
      cart_id: this.state.booking.id,
      onConfirm: ({paymentType, paymentMethodId}) => {
        pop();
        if (
          paymentType !== this.state.paymentType ||
          paymentMethodId !== this.state.paymentMethodId
        ) {
          this.setState({paymentType, paymentMethodId, loading: true});
        }
      },
    });
  };

  handleChangeNote = (tempNote) => {
    this.setState({tempNote});
  };

  handleUpdateNote = () => {
    this.setState({note: this.state.tempNote || ''});
  };

  handleChangeVoucher = (booking) => {
    this.setState({booking});
  };

  handleOpenPopupCancelBooking = () => {
    if (this.refPopupCancelBooking.current) {
      this.refPopupCancelBooking.current.open();
    }
  };

  handleClosePopupCancelBooking = () => {
    if (this.refPopupCancelBooking.current) {
      this.refPopupCancelBooking.current.close();
    }
  };

  handleNoteSizeChange = (e) => {
    if (appConfig.device.isAndroid) return;

    const noteHeight = e.nativeEvent.layout.height;
    const noteAreaBoundary = e.nativeEvent.layout.y + noteHeight;

    if (
      this.refScrollView.current &&
      this.noteHeight &&
      this.scrollOffsetY + 60 <
        noteAreaBoundary + store.keyboardTop - this.scrollContentSizeY
    ) {
      this.scrollOffsetY = this.scrollOffsetY + (noteHeight - this.noteHeight);
      this.refScrollView.current.scrollTo({
        y: this.scrollOffsetY,
        animated: false,
      });
    }

    this.noteHeight = noteHeight;
  };

  handleScrollEnd = (e) => {
    const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
    this.scrollOffsetY = contentOffset.y;
    this.scrollContentSizeY = layoutMeasurement.height;
    if (appConfig.device.isAndroid) return;

    this.resetScrollToCoords.y =
      contentOffset.y >= contentSize.height - layoutMeasurement.height
        ? contentSize.height - layoutMeasurement.height
        : contentOffset.y;
  };

  handleRefresh = () => {
    if (this.unmounted) return;
    this.setState({refreshing: true});
    this.getBooking(this.state.booking.id);
  };

  handleScrollViewLayout = (e) => {
    this.scrollContentSizeY = e.nativeEvent.layout.height;
  };

  get unselectedContainerStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
      borderColor: this.theme.color.primaryHighlight,
      borderWidth: this.theme.layout.borderWidth,
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }
  render() {
    const itemFee = this.state.booking?.item_fee || {};
    const cashbackView = this.state.booking?.cashback_view || {};
    const isInitLoading = !this.state.booking?.id && this.state.loading;
    const isShowConfirmButton =
      this.state.booking?.id &&
      (this.editable || canTransaction(this.state.booking));

    if (isInitLoading) {
      return (
        <ScreenWrapper>
          <BookingSkeleton />
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper>
        {this.state.updateLoading && (
          <Loading
            pointerEvents="none"
            size="small"
            wrapperStyle={styles.updateLoadingWrapper}
          />
        )}
        {this.state.loading && <Loading center />}
        <KeyboardAwareScrollView
          innerRef={(inst) => (this.refScrollView.current = inst)}
          scrollIndicatorInsets={{right: 0.01}}
          contentContainerStyle={[
            styles.listContentContainer,
            !isShowConfirmButton && {
              paddingBottom: appConfig.device.bottomSpace,
            },
          ]}
          resetScrollToCoords={this.resetScrollToCoords}
          enableResetScrollToCoords
          scrollEventThrottle={16}
          onScrollEndDrag={this.handleScrollEnd}
          onMomentumScrollEnd={this.handleScrollEnd}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }>
          {!this.editable && (
            <OrderInfoSection
              code={this.state.booking?.cart_code}
              typeCode={this.state.booking?.cart_type}
              typeView={this.state.booking?.cart_type_name}
              statusCode={this.state.booking?.status}
              statusView={this.state.booking?.status_view}
              paymentStatusCode={this.state.booking?.payment_status}
              paymentStatusView={this.state.booking?.payment_status_name}
            />
          )}

          {!!this.mainProduct && (
            <BookingProductInfo
              editable={this.editable}
              product={this.mainProduct}
              attrs={this.props.attrs || {}}
              models={this.props.models || {}}
              defaultSelectedModel={this.mainProduct.model}
              onSelectAttr={this.handleSelectAttr}
              onChangeQuantity={this.handleChangeQuantity}
            />
          )}

          <StoreInfoSection
            image={this.storeInfo.img}
            name={this.storeInfo.name}
            address={this.storeInfo.address}
            tel={this.storeInfo.phone}
            originLatitude={this.storeInfo.lat}
            originLongitude={this.storeInfo.lng}
            onPressActionBtn={
              this.editable ? this.handleChangeStore : undefined
            }
            customContent={
              !this.storeInfo?.id && (
                <AppOutlinedButton
                  primaryHighlight
                  disabled={!this.editable}
                  rounded={ButtonRoundedType.EXTRA_SMALL}
                  onPress={this.handleChangeStore}
                  style={styles.unselectedContainer}
                  titleStyle={[
                    styles.unselected,
                    this.theme.typography[TypographyType.LABEL_MEDIUM],
                  ]}>
                  {this.props.t('orders:confirm.store.unselected')}
                </AppOutlinedButton>
              )
            }
          />

          <ScheduleSection
            editable={this.editable}
            date={this.state.date}
            timeSlots={this.state.bookingTimes}
            selectedTimeSlot={this.state.time}
            onChangeDate={this.handleChangeDate}
            onChangeTime={this.handleChangeTime}
          />

          <View onLayout={this.handleNoteSizeChange}>
            <NoteSection
              siteId={this.state.booking.site_id}
              cartId={this.state.booking.id}
              editable={this.editable}
              title={this.props.t('orders:confirm.note.title')}
              value={this.state.tempNote}
              onChangeText={this.handleChangeNote}
              onBlur={this.handleUpdateNote}
              isShowActionTitle={
                this.state.booking.status != CART_STATUS_ORDERING
              }
              onNoteUpdated={this.handleChangeNote}
            />
          </View>

          <PaymentMethodSection
            isUnpaid={isUnpaid(this.state.booking)}
            cartData={this.state.booking}
            onPressChange={this.handleChangePaymentMethod}
          />

          <PricingAndPromotionSection
            isPromotionSelectable={this.editable}
            siteId={this.props.siteId}
            orderId={this.state.booking?.id}
            orderType={this.state.booking?.cart_type}
            tempPrice={this.state.booking?.total_before_view}
            totalItem={this.state.booking?.count_selected}
            totalPrice={this.state.booking?.total_selected}
            promotionName={this.state.booking?.user_voucher?.name}
            selectedVoucher={this.state.booking?.user_voucher}
            itemFee={itemFee}
            cashbackView={cashbackView}
            onUseVoucherOnlineSuccess={this.handleChangeVoucher}
            onRemoveVoucherOnlineSuccess={this.handleChangeVoucher}
            voucherStatus={this.state.booking?.voucher_status}
          />

          <CommissionsSection commissions={this.state.booking?.commissions} />

          <ActionButtonSection
            cancelable={this.cancelable}
            onCancel={this.handleOpenPopupCancelBooking}
          />
        </KeyboardAwareScrollView>

        {isShowConfirmButton && (
          <Button
            showBackground
            safeLayout
            disabled={this.isDisabled}
            title={
              this.editable
                ? this.props.t('orders:confirm.confirmTitle')
                : canTransaction(this.state.booking)
                ? this.props.t('orders:confirm.order.payTitle')
                : ''
            }
            onPress={
              this.editable
                ? this.orderBooking
                : canTransaction(this.state.booking)
                ? () => this.goToTransaction()
                : undefined
            }
          />
        )}

        <PopupConfirm
          ref_popup={this.refPopupCancelBooking}
          title={this.props.t('cart:popup.cancelBooking.message')}
          height={110}
          noConfirm={this.handleClosePopupCancelBooking}
          yesConfirm={this.cancelBooking}
          otherClose={false}
        />
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['product', 'orders', 'cart', 'common'])(
  observer(Booking),
);
