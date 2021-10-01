import React, {Component} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Actions} from 'react-native-router-flux';
import {debounce} from 'lodash';

import appConfig from 'app-config';

import store from 'app-store';
import EventTracker from 'app-helper/EventTracker';
import {APIRequest} from 'src/network/Entity';

import ScheduleSection from './ScheduleSection';
import BookingProductInfo from './BookingProductInfo';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import PopupConfirm from 'src/components/PopupConfirm';
import BookingSkeleton from './BookingSkeleton';
import {Container} from 'src/components/Layout';
import {
  PricingAndPromotionSection,
  StoreInfoSection,
  NoteSection,
  CommissionsSection,
  ActionButtonSection,
  PaymentMethodSection,
  OrderInfoSection,
} from 'src/components/payment/Confirm/components';
import {isUnpaid, canTransaction} from 'app-helper/product';
import RightButtonChat from 'src/components/RightButtonChat';

const DEBOUNCE_UPDATE_BOOKING_TIME = 500;
const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 10,
  },
  quantityWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quantityContainer: {
    width: null,
    maxWidth: undefined,
  },
  quantityTxtContainer: {
    minWidth: 70,
    flex: undefined,
  },
  quantity: {
    flexDirection: 'row',
    borderColor: '#eee',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: appConfig.colors.white,
  },
  label: {
    color: '#444',
    fontSize: 16,
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
    borderColor: appConfig.colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  unselected: {
    fontStyle: 'italic',
    color: appConfig.colors.text,
  },

  updateLoadingWrapper: {
    top: 15,
    right: 15,
    left: undefined,
    bottom: undefined,
  },

  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingBottom: 9,
    paddingHorizontal: 30,
  },
  buttonActionWrapper: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  btnActionTitle: {
    fontWeight: '500',
  },
});

export class Booking extends Component {
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
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
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

    Actions.refresh(navbarConfig);
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
            Actions.pop();
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
          Actions.pop();
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
    Actions.push(appConfig.routes.transaction, {
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
    Actions.push(appConfig.routes.myAddress, {
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
    Actions.push(appConfig.routes.paymentMethod, {
      selectedMethod: this.state.booking.payment_method,
      selectedPaymentMethodDetail: this.state.booking.payment_method_detail,
      price: this.state.booking.total_before_view,
      totalPrice: this.state.booking.total_selected,
      extraFee: this.state.booking.item_fee,
      store_id: this.state.booking.site_id,
      cart_id: this.state.booking.id,
      onConfirm: ({paymentType, paymentMethodId}) => {
        Actions.pop();
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

  render() {
    const itemFee = this.state.booking?.item_fee || {};
    const cashbackView = this.state.booking?.cashback_view || {};
    const isInitLoading = !this.state.booking?.id && this.state.loading;

    if (isInitLoading) {
      return <BookingSkeleton />;
    }

    return (
      <Container flex centerVertical={false}>
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
            !this.editable && {
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
                <TouchableOpacity
                  disabled={!this.editable}
                  onPress={this.handleChangeStore}
                  style={styles.unselectedContainer}>
                  <Text style={styles.unselected}>
                    {this.props.t('orders:confirm.store.unselected')}
                  </Text>
                </TouchableOpacity>
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
              isShowActionTitle={this.state.booking.status != CART_STATUS_ORDERING}
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

        {this.state.booking?.id &&
          (this.editable ? (
            <Button
              disabled={this.isDisabled}
              title={this.props.t('orders:confirm.confirmTitle')}
              containerStyle={styles.btnContainer}
              btnContainerStyle={[styles.btnContentContainer]}
              onPress={this.orderBooking}
            />
          ) : (
            canTransaction(this.state.booking) && (
              <Button
                disabled={this.isDisabled}
                title={this.props.t('orders:confirm.order.payTitle')}
                containerStyle={styles.btnContainer}
                btnContainerStyle={[styles.btnContentContainer]}
                onPress={() => this.goToTransaction()}
              />
            )
          ))}

        <PopupConfirm
          ref_popup={this.refPopupCancelBooking}
          title={this.props.t('cart:popup.cancelBooking.message')}
          height={110}
          noConfirm={this.handleClosePopupCancelBooking}
          yesConfirm={this.cancelBooking}
          otherClose={false}
        />
      </Container>
    );
  }
}

export default withTranslation(['product', 'orders', 'cart', 'common'])(
  observer(Booking),
);
