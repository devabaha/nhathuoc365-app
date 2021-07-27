import React, {Component} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import appConfig from 'app-config';

import ScreenWrapper from 'src/components/ScreenWrapper';
import ProductInfo from 'src/components/stores/ItemAttribute/ProductInfo';
import AttributeSelection from 'src/components/stores/ItemAttribute/AttributeSelection';
import NumberSelection from 'src/components/stores/NumberSelection';
import {
  PricingAndPromotionSection,
  StoreInfoSection,
  NoteSection,
} from 'src/components/payment/Confirm/components';
import store from 'app-store';
import SectionContainer from 'src/components/payment/Confirm/components/SectionContainer';
import {Container} from 'src/components/Layout';
import ScheduleSection from './ScheduleSection';
import Button from 'src/components/Button';
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
import Loading from 'src/components/Loading';
import {Actions} from 'react-native-router-flux';

const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
  value: {
    maxWidth: '50%',
  },
  quantityLabel: {
    flex: undefined,
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
});

export class Booking extends Component {
  static defaultProps = {
    attrs: {},
    models: {},
  };

  state = {
    booking: {},
    addressId: '',
    model: '',
    selectedAttr: [],
    selectedAttrViewData: [],
    bookingTimes: [],

    loading: true,
    refreshing: false,

    quantity: MIN_QUANTITY,
    max: undefined,

    note: '',
    date: '',
    time: {},
    timeValue: '',
  };
  refScrollView = React.createRef();
  scrollContentSizeY = 0;
  scrollOffsetY = 0;
  resetScrollToCoords = {x: 0, y: 0};
  noteHeight = 0;

  getBookingRequest = new APIRequest();
  getBookingTimesRequest = new APIRequest();
  updateBookingRequest = new APIRequest();
  orderBookingRequest = new APIRequest();
  requests = [
    this.getBookingRequest,
    this.getBookingTimesRequest,
    this.updateBookingRequest,
    this.orderBookingRequest,
  ];
  eventTracker = new EventTracker();
  unmounted = false;

  get isDisabled() {
    return (
      this.state.loading ||
      !this.state.model ||
      !this.state.quantity ||
      !this.state.addressId ||
      !this.getDateTimeValue(this.state)
    );
  }

  get storeInfo() {
    return this.state.booking?.site;
  }

  componentDidMount() {
    this.getBooking();
    this.eventTracker.logCurrentView();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      (!!nextState.model && nextState.model !== this.state.model) ||
      nextState.quantity !== this.state.quantity ||
      nextState.addressId !== this.state.addressId ||
      (nextState.date &&
        nextState.time &&
        (nextState.date !== this.state.date ||
          nextState.time !== this.state.time))
    ) {
      console.log(
        !!nextState.model && nextState.model !== this.state.model,
        nextState.quantity !== this.state.quantity,
        nextState.addressId !== this.state.addressId,
        nextState.date &&
          nextState.time &&
          (nextState.date !== this.state.date ||
            nextState.time !== this.state.time),
      );
      this.updateBooking(nextState);
    }
    return true;
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();
  }

  getBooking = async () => {
    const data = {
      product_id: this.props.productId,
    };
    this.getBookingRequest.data = APIHandler.booking_store(
      this.props.siteId,
      data,
    );

    try {
      const response = await this.getBookingRequest.promise();
      if (this.unmounted) return;
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              booking: response.data,
              bookingTimes: this.formatBookingTimes(
                response.data.booking_times,
              ),
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

  updateBooking = async (state = this.state) => {
    const data = {
      model: state.model,
      quantity: state.quantity,
      time: this.getDateTimeValue(state),
      address_id: state.addressId,
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
            this.setState({
              booking: response.data,
              bookingTimes: this.formatBookingTimes(
                response.data.booking_times,
              ),
            });
          }
        }
      }
    } catch (error) {
      console.log('update_booking', error);
    } finally {
      if (this.unmounted) return;
    }
  };

  orderBooking = async () => {
    this.setState({loading: true});

    const data = {
      user_note: this.state.note,
    };

    this.orderBookingRequest.data = APIHandler.booking_order(
      this.props.siteId,
      this.state.booking?.id,
      data,
    );

    try {
      const response = await this.orderBookingRequest.promise();
      if (this.unmounted) return;
      console.log('order_booking', response, data);
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

  formatBookingTimes = (bookingTimes = []) => {
    const formattedBookingTimes = bookingTimes.map((bookingTime) => ({
      ...bookingTime,
      disabled: !bookingTime.available,
    }));
    return formattedBookingTimes;
  };

  getDateTimeValue = (state) => {
    return state.date && state.timeValue
      ? state.date + ' ' + state.timeValue
      : '';
  };

  handleSelectAttr = (selectedAttr, selectedAttrViewData, model) => {
    this.setState({
      selectedAttr,
      selectedAttrViewData,
      model,
    });
  };

  handleChangeQuantity = (quantity, min, max) => {
    const hasMax = max !== null && max !== undefined;

    if (
      (Number(quantity) >= Number(min) && hasMax
        ? Number(quantity) <= Number(max)
        : true) ||
      !quantity
    ) {
      this.setState({quantity: !quantity ? '' : Number(quantity)});
    }
  };

  handleMinus = () => {
    this.setState((prevState) => ({quantity: prevState.quantity - 1}));
  };

  handlePlus = () => {
    this.setState((prevState) => ({quantity: prevState.quantity + 1}));
  };

  handleQuantityBlur = () => {
    if (!this.state.quantity) {
      this.setState({quantity: MIN_QUANTITY});
    }
  };

  handleChangeStore = () => {
    Actions.push(appConfig.routes.myAddress, {
      goBack: true,
      isVisibleStoreAddress: true,
      isVisibleUserAddress: false,
      selectedAddressId: this.state.addressId,
      onSelectAddress: (addressId) => {
        this.setState({addressId});
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

  handleChangeNote = (note) => {
    this.setState({note});
  };

  handleChangeVoucher = () => {};

  handleNoteSizeChange = (e) => {
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
    this.getBooking();
  };

  handleScrollViewLayout = (e) => {
    this.scrollContentSizeY = e.nativeEvent.layout.height;
  };

  renderProductInfo = () => {
    const {t} = this.props;

    return Object.keys(this.state.booking?.products || {}).map((key, index) => {
      const product = this.state.booking.products[key];

      return (
        <View key={index}>
          <ProductInfo
            imageUri={product.image}
            title={product.name}
            subTitle={this.state.selectedAttrViewData}
            discountPrice={product.discount}
            price={product.price_view}
            unitName={product.unit_name}
            inventory={product.inventory}
          />

          <AttributeSelection
            attrs={this.props.attrs}
            models={this.props.models}
            defaultSelectedModel={product?.model}
            onSelectAttr={this.handleSelectAttr}
          />

          <View style={styles.quantity}>
            <Text style={styles.label}>{t('attr.quantity')}</Text>
            <View style={styles.quantityWrapper}>
              <NumberSelection
                containerStyle={[styles.quantityContainer]}
                textContainer={styles.quantityTxtContainer}
                value={this.state.quantity}
                min={MIN_QUANTITY}
                max={this.state.max}
                onChangeText={(quantity) =>
                  this.handleChangeQuantity(
                    quantity,
                    MIN_QUANTITY,
                    this.state.max,
                  )
                }
                onMinus={this.handleMinus}
                onPlus={this.handlePlus}
                onBlur={this.handleQuantityBlur}
                // disabled={disabled}
              />
            </View>
          </View>
        </View>
      );
    });
  };

  render() {
    const itemFee = this.state.booking?.item_fee || {};
    const cashbackView = this.state.booking?.cashback_view || {};

    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        <KeyboardAwareScrollView
          innerRef={(inst) => (this.refScrollView.current = inst)}
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
          {this.renderProductInfo()}

          {!!this.storeInfo && (
            <StoreInfoSection
              image={this.storeInfo.logo_url}
              name={this.storeInfo.name}
              address={this.storeInfo.address}
              tel={this.storeInfo.tel}
              onPressActionBtn={this.handleChangeStore}
              customContent={
                <TouchableOpacity
                  onPress={this.handleChangeStore}
                  style={styles.unselectedContainer}>
                  <Text style={styles.unselected}>
                    {this.props.t('orders:confirm.store.unselected')}
                  </Text>
                </TouchableOpacity>
              }
            />
          )}

          <ScheduleSection
            date={this.state.date}
            timeSlots={this.state.bookingTimes}
            selectedTimeSlot={this.state.time}
            onChangeDate={this.handleChangeDate}
            onChangeTime={this.handleChangeTime}
          />

          <View onLayout={this.handleNoteSizeChange}>
            <NoteSection
              value={this.state.note}
              onChangeText={this.handleChangeNote}
            />
          </View>

          <PricingAndPromotionSection
            isPromotionSelectable
            siteId={this.props.siteId}
            orderId={this.state.booking?.id}
            orderType={this.state.booking?.cart_type}
            tempPrice={this.state.booking?.total_before_view}
            totalItem={this.state.booking?.count_selected}
            totalPrice={this.state.booking?.total_selected}
            promotionName={this.state.booking?.user_voucher}
            itemFee={itemFee}
            cashbackView={cashbackView}
            onPressVoucher={this.handleChangeVoucher}
          />
        </KeyboardAwareScrollView>

        <Button
          disabled={this.isDisabled}
          title={this.props.t('orders:confirm.confirmTitle')}
          containerStyle={styles.btnContainer}
          btnContainerStyle={[styles.btnContentContainer]}
          onPress={this.orderBooking}
        />
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['product', 'orders', 'common'])(
  observer(Booking),
);
