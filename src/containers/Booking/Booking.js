import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import { Container } from 'src/components/Layout';
import ScheduleSection from './ScheduleSection';

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
});

export class Booking extends Component {
  state = {
    quantity: MIN_QUANTITY,
    max: undefined,

    note: '',
  };
  refScrollView = React.createRef();
  scrollContentSizeY = 0;
  scrollOffsetY = 0;
  resetScrollToCoords = {x: 0, y: 0};
  noteHeight = 0;

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

  handleSelectAttr = (selectedAttr, selectedAttrViewData) => {
    console.log(selectedAttr, selectedAttrViewData);
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

  handleChangeNote = (note) => {
    this.setState({note});
  };

  handleNoteSizeChange = (e) => {
    const noteHeight = e.nativeEvent.layout.height;
    const noteAreaBoundary = e.nativeEvent.layout.y + noteHeight;

    if (
      this.refScrollView.current &&
      this.noteHeight &&
      this.scrollOffsetY <
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

  handleScrollViewLayout = (e) => {
    this.scrollContentSizeY = e.nativeEvent.layout.height;
  };

  render() {
    const {t} = this.props;

    return (
      <ScreenWrapper>
        <KeyboardAwareScrollView
          innerRef={(inst) => (this.refScrollView.current = inst)}
          resetScrollToCoords={this.resetScrollToCoords}
          enableResetScrollToCoords
          scrollEventThrottle={16}
          onScrollEndDrag={this.handleScrollEnd}
          onMomentumScrollEnd={this.handleScrollEnd}>
          <ProductInfo
            imageUri="https://imgd.aeplcdn.com/476x268/bw/models/honda-activa-6g-standard20200115132249.jpg?q=80"
            title="Xe máy Honda"
            subTitle="Màu xanh"
            discountPrice="50.000đ"
            price="200.000đ"
            unitName="chiếc"
            inventory={1000}
          />

          <AttributeSelection onSelectAttr={this.handleSelectAttr} />

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

          <ScheduleSection />

          <StoreInfoSection
            title="Cửa hàng"
            name="Test"
            address="115, Láng Hạ"
          />

          <View onLayout={this.handleNoteSizeChange}>
            <NoteSection
              value={this.state.note}
              onChangeText={this.handleChangeNote}
              //   onContentSizeChange={this.handleNoteSizeChange}
            />
          </View>

          <PricingAndPromotionSection
            isPromotionSelectable
            tempPrice="200.000đ"
            totalItem="6"
            totalPrice="1.000.000đ"
            promotionName="Test"
            itemFee={{
              'Phí 1': '1.000đ',
              'Phí 2': '10.000đ',
              'Phí 3': '100.000đ',
            }}
            cashbackView={{
              'Hoàn tiền 1': '1.000đ',
              'Hoàn tiền 2': '10.000đ',
              'Hoàn tiền 3': '100.000đ',
            }}

            // onPressVoucher=() => {}
          />
        </KeyboardAwareScrollView>
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['product', 'common'])(Booking);
