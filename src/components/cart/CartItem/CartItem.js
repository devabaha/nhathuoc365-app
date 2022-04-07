import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
import {CART_ITEM_WIDTH} from '../constants';
// custom components
import {DiscountBadge} from '../../Badges';
import ExtraQuantityInput from './ExtraQuantityInput';
import {BaseButton, Typography, Icon, IconButton} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  store_cart_item_container: {
    width: CART_ITEM_WIDTH,
    overflow: 'hidden',
  },
  store_cart_item: {
    width: '100%',
    flexDirection: 'row',
    padding: 7,
  },
  store_cart_item_image_box: {
    width: 75,
    height: 75,
  },
  store_cart_item_image: {
    flex: 1,
    resizeMode: 'contain',
  },
  store_cart_item_title_box: {
    flex: 1,
    marginLeft: 10,
  },
  store_cart_item_title: {
    fontWeight: '500',
  },
  store_cart_item_sub_title: {
    marginTop: 2,
  },
  store_cart_item_price: {
    fontWeight: 'bold',
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
    width: undefined,
  },
  discountBadgeContentContainer: {
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  discountBadgeLabel: {},

  store_cart_calculator: {
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
  },
  store_cart_item_qnt_change: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  store_cart_item_remove: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  storeCartItemQntChangeContainer: {
    overflow: 'hidden',
  },
  btn_left: {
    zIndex: 1,
  },
  p8: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 14},
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
  const {theme} = useTheme();

  const {t} = useTranslation(['cart', 'common']);

  let refModal = null;

  const handleSelectQuantity = (quantity) => {
    if (refModal) {
      refModal.close();
    }
    onUpdateQuantity(quantity);
  };

  const onShowModalChangeQuantity = () => {
    push(appConfig.routes.modalInput, {
      backdropPressToClose: true,
      title: t('quantityInput'),
      btnTitle: t('common:select'),
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

  const storeCartItemStyle = useMemo(() => {
    return mergeStyles(styles.store_cart_item, {
      borderColor: theme.color.border,
      borderRightWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  const storeCartItemQntChangeContainerStyle = useMemo(() => {
    return mergeStyles(styles.store_cart_item_qnt_change, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
      borderColor: theme.color.border,
      borderWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  const storeCartItemRemoveStyle = useMemo(() => {
    return mergeStyles(styles.store_cart_item_remove, {
      backgroundColor: theme.color.contentBackgroundStrong,
      borderWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
      shadowColor: theme.color.shadow,
      ...theme.layout.shadow,
    });
  }, [theme]);

  return (
    <View style={[styles.store_cart_item_container, containerStyle]}>
      <BaseButton useTouchableHighlight onPress={onPressCartItem}>
        <View style={storeCartItemStyle}>
          <View style={styles.store_cart_item_image_box}>
            {!!image && (
              <Image
                style={styles.store_cart_item_image}
                source={{uri: image}}
              />
            )}
          </View>
          <View style={styles.store_cart_item_title_box}>
            <View style={{flex: 1}}>
              <Typography
                type={TypographyType.LABEL_SMALL}
                numberOfLines={1}
                style={styles.store_cart_item_title}>
                {name}
              </Typography>
              {!!classification && (
                <Typography
                  type={TypographyType.DESCRIPTION_TINY_TERTIARY}
                  numberOfLines={1}
                  style={[styles.store_cart_item_sub_title]}>
                  {classification}
                </Typography>
              )}
              <Typography
                type={TypographyType.LABEL_SMALL_PRIMARY}
                style={styles.store_cart_item_price}>
                {priceView}
              </Typography>
            </View>
            <View style={styles.store_cart_actions}>
              <View style={styles.store_cart_calculator}>
                <BaseButton
                  useTouchableHighlight
                  onPress={
                    disabled ||
                    isUpdateQuantityLoading ||
                    isMinusLoading ||
                    isPlusLoading
                      ? () => {}
                      : onMinus
                  }
                  hitSlop={HIT_SLOP}
                  style={[
                    styles.storeCartItemQntChangeContainer,
                    styles.btn_left,
                    styles.p8,
                    storeCartItemQntChangeContainerStyle,
                  ]}>
                  {isMinusLoading ? (
                    <Indicator size="small" />
                  ) : (
                    <Icon
                      bundle={BundleIconSetName.ANT_DESIGN}
                      name="minus"
                      style={styles.icon}
                    />
                  )}
                </BaseButton>

                <BaseButton
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
                      <Typography
                        type={TypographyType.LABEL_SMALL}
                        numberOfLines={2}
                        style={styles.store_cart_item_qnt}>
                        {quantityView}
                      </Typography>
                    )}
                  </View>
                </BaseButton>

                <BaseButton
                  useTouchableHighlight
                  onPress={
                    disabled ||
                    isUpdateQuantityLoading ||
                    isMinusLoading ||
                    isPlusLoading
                      ? () => {}
                      : onPlus
                  }
                  hitSlop={HIT_SLOP}
                  style={[
                    styles.storeCartItemQntChangeContainer,
                    styles.p8,
                    storeCartItemQntChangeContainerStyle,
                  ]}>
                  {isPlusLoading ? (
                    <Indicator size="small" />
                  ) : (
                    <Icon
                      bundle={BundleIconSetName.ANT_DESIGN}
                      name="plus"
                      style={styles.icon}
                    />
                  )}
                </BaseButton>
              </View>
            </View>
          </View>
        </View>
      </BaseButton>

      {!!discountPercent && (
        <DiscountBadge
          containerStyle={styles.discountBadgeContainer}
          contentContainerStyle={styles.discountBadgeContentContainer}
          label={saleFormat(discountPercent)}
        />
      )}
      <IconButton
        hitSlop={HIT_SLOP}
        name="close"
        bundle={BundleIconSetName.ANT_DESIGN}
        style={[styles.store_cart_item_qnt_change, storeCartItemRemoveStyle]}
        onPress={onRemove}
      />
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
