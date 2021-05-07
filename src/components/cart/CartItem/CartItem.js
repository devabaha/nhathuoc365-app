import React from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {DiscountBadge} from '../../Badges';

import appConfig from 'app-config';
import {CART_ITEM_WIDTH} from '../constants';
import {Actions} from 'react-native-router-flux';
import ExtraQuantityInput from './ExtraQuantityInput';

const styles = StyleSheet.create({
  store_cart_item_container: {
    width: CART_ITEM_WIDTH,
    overflow: 'hidden',
  },
  store_cart_item: {
    width: '100%',
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#eee',
    padding: 7,
  },
  store_cart_item_image_box: {
    width: 60,
    height: 60,
  },
  store_cart_item_image: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  store_cart_item_title_box: {
    flex: 1,
    marginLeft: 10,
  },
  store_cart_item_title: {
    color: '#404040',
    fontSize: 12,
    fontWeight: '500',
  },
  store_cart_item_sub_title: {
    color: '#555',
    fontSize: 10,
    marginTop: 2,
  },
  store_cart_item_price: {
    fontSize: 12,
    color: '#fa7f50',
    fontWeight: '500',
    marginTop: appConfig.device.isIOS ? 2 : 0,
  },
  store_cart_actions: {
    flexDirection: 'row',
    marginTop: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  discountBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    height: undefined,
    backgroundColor: '#fff',
    width: undefined,
    ...elevationShadowStyle(3),
  },
  discountBadgeContentContainer: {
    backgroundColor: '#FD0D1C',
    paddingVertical: 2,
  },
  discountBadgeLabel: {
    fontSize: 10,
  },

  store_cart_calculator: {
    // marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  store_cart_item_qnt_container: {
    paddingHorizontal: 16,
    maxWidth: CART_ITEM_WIDTH - 75 - 44 - 30,
  },
  store_cart_item_qnt: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#404040',
    fontSize: 12,
  },
  store_cart_item_qnt_change: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Util.pixel,
    borderColor: '#404040',
    borderRadius: 3,
  },

  store_cart_item_remove: {
    backgroundColor: '#cc7171',
    borderWidth: 0,
    position: 'absolute',
    left: 10,
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 5,
    // borderTopLeftRadius: 0,
    // borderBottomLeftRadius: 0,
    ...elevationShadowStyle(2),
  },
  store_cart_item_remove_icon: {
    color: '#fff',
  },

  btn_left: {
    zIndex: 1,
  },
  p8: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const MIN_QUANTITY = 1;

const CartItem = ({
  image,
  name,
  classification,
  priceView,
  quantity,
  quantityView,
  min = MIN_QUANTITY,
  max,
  disabled = false,
  discountPercent,
  unitName,
  isUpdateQuantityLoading = false,
  isMinusLoading = false,
  isPlusLoading = false,
  containerStyle = {},

  onMinus = () => {},
  onPlus = () => {},
  onRemove = () => {},
  onPressCartItem = () => {},
  onUpdateQuantity = () => {},
}) => {
  let refModal = null;

  const handleSelectQuantity = (quantity) => {
    if (refModal) {
      refModal.close();
    }
    onUpdateQuantity(quantity);
  };

  const onShowModalChangeQuantity = () => {
    Actions.push(appConfig.routes.modalInput, {
      backdropPressToClose: true,
      title: 'Nhập số lượng',
      btnTitle: 'Chọn',
      onSubmit: handleSelectQuantity,
      description: `${name}${classification && '\r\n' + classification}`,
      value: quantity.toString(),
      textInputProps: {
        autoFocus: true,
        keyboardType: 'number-pad',
        textAlign: 'center',
      },
      textInputStyle: {flex: 1},
      extraInput: <ExtraQuantityInput message={unitName} />,
      textInputContainerStyle: {flexDirection: 'row'},
      refModal: (inst) => (refModal = inst),
    });
  };

  return (
    <View style={[styles.store_cart_item_container, containerStyle]}>
      <TouchableHighlight underlayColor="#fafafa" onPress={onPressCartItem}>
        <View style={styles.store_cart_item}>
          <View style={styles.store_cart_item_image_box}>
            {!!image && (
              <CachedImage
                mutable
                style={styles.store_cart_item_image}
                source={{uri: image}}
              />
            )}
          </View>
          <View style={styles.store_cart_item_title_box}>
            <View style={{flex: 1}}>
              <Text numberOfLines={1} style={styles.store_cart_item_title}>
                {name}
              </Text>
              {!!classification && (
                <Text
                  numberOfLines={1}
                  style={[styles.store_cart_item_sub_title]}>
                  {classification}
                </Text>
              )}
              <Text style={styles.store_cart_item_price}>{priceView}</Text>
            </View>
            <View style={styles.store_cart_actions}>
              <View style={styles.store_cart_calculator}>
                <TouchableHighlight
                  onPress={disabled || isMinusLoading ? () => {} : onMinus}
                  underlayColor="#eee"
                  hitSlop={HIT_SLOP}
                  style={[styles.btn_left, styles.p8]}>
                  <View style={styles.store_cart_item_qnt_change}>
                    {isMinusLoading ? (
                      <Indicator size="small" />
                    ) : (
                      <AntDesignIcon name="minus" size={14} color="#404040" />
                    )}
                  </View>
                </TouchableHighlight>

                <TouchableOpacity
                  hitSlop={HIT_SLOP}
                  onPress={
                    disabled ||
                    isUpdateQuantityLoading ||
                    isMinusLoading ||
                    isPlusLoading
                      ? () => {}
                      : onShowModalChangeQuantity
                  }>
                  <View style={styles.store_cart_item_qnt_container}>
                    {isUpdateQuantityLoading ? (
                      <Indicator size="small" />
                    ) : (
                      <Text
                        numberOfLines={2}
                        style={styles.store_cart_item_qnt}>
                        {quantityView}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableHighlight
                  onPress={disabled || isPlusLoading ? () => {} : onPlus}
                  underlayColor="#eee"
                  hitSlop={HIT_SLOP}
                  style={styles.p8}>
                  <View style={styles.store_cart_item_qnt_change}>
                    {isPlusLoading ? (
                      <Indicator size="small" />
                    ) : (
                      <AntDesignIcon name="plus" size={14} color="#404040" />
                    )}
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      {!!discountPercent && (
        <DiscountBadge
          containerStyle={styles.discountBadgeContainer}
          contentContainerStyle={styles.discountBadgeContentContainer}
          label={
            <Text style={styles.discountBadgeLabel}>
              {saleFormat(discountPercent)}
            </Text>
          }
        />
      )}
      <TouchableOpacity
        onPress={onRemove}
        hitSlop={HIT_SLOP}
        style={[
          styles.store_cart_item_qnt_change,
          styles.store_cart_item_remove,
        ]}>
        <AntDesignIcon
          name="close"
          style={styles.store_cart_item_remove_icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    nextProps.image === prevProps.image &&
    nextProps.name === prevProps.name &&
    nextProps.classification === prevProps.classification &&
    nextProps.priceView === prevProps.priceView &&
    nextProps.quantity === prevProps.quantity &&
    nextProps.quantityView === prevProps.quantityView &&
    nextProps.min === prevProps.min &&
    nextProps.max === prevProps.max &&
    nextProps.disabled === prevProps.disabled &&
    nextProps.discountPercent === prevProps.discountPercent &&
    nextProps.unitName === prevProps.unitName &&
    nextProps.isUpdateQuantityLoading === prevProps.isUpdateQuantityLoading &&
    nextProps.isMinusLoading === prevProps.isMinusLoading &&
    nextProps.isPlusLoading === prevProps.isPlusLoading &&
    nextProps.containerStyle === prevProps.containerStyle
  );
};

export default React.memo(CartItem, areEquals);
