import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import {Typography, Icon, BaseButton} from 'src/components/base';

const USE_ONLINE = 'USE_ONLINE';

const styles = StyleSheet.create({
  address_name_box: {
    flexDirection: 'row',
  },
  address_default_box: {
    paddingLeft: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  feeBox: {
    marginTop: 12,
  },
  feeLabel: {
    flex: 1,
  },
  both: {
    fontWeight: '600',
  },
  totalPriceContainer: {
    borderTopWidth: 0,
  },
  totalItem: {
    fontWeight: '400',
  },

  useVoucherLabelWrapper: {
    // flex: 1,
    flexDirection: 'row',
    paddingRight: 30,
    alignSelf: 'center',
  },
  addVoucherWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  addVoucherLabel: {
    fontWeight: '400',
  },
  voucherIcon: {
    fontSize: 20,
    marginRight: 5,
    top: appConfig.device.isAndroid ? 1 : 0,
  },
  promotionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 15,
  },
  cashbackViewContainer: {
    borderTopWidth: 0,
  },
});

const PricingAndPromotionSection = ({
  tempPrice,
  totalItem,
  totalPrice,
  promotionName,
  selectedVoucher,
  siteId,

  orderId,
  orderType,

  isPromotionSelectable,

  itemFee = {},
  cashbackView = {},

  onUseVoucherOnlineSuccess,
  onRemoveVoucherOnlineSuccess,
  voucherStatus,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const handleOpenVoucher = () => {
    if (selectedVoucher) {
      openCurrentVoucher(selectedVoucher);
    } else {
      openMyVoucher();
    }
  };

  const openMyVoucher = () => {
    push(
      appConfig.routes.myVoucher,
      {
        mode: USE_ONLINE,
        siteId,
        orderId,
        orderType,
        onUseVoucherOnlineSuccess: handleUseVoucherOnlineSuccess,
        onUseVoucherOnlineFailure: handleUseOnlineFailure,
      },
      theme,
    );
  };

  const openCurrentVoucher = (userVoucher) => {
    push(
      appConfig.routes.voucherDetail,
      {
        mode: USE_ONLINE,
        orderId,
        orderType,
        title: userVoucher.voucher_name,
        voucherId: userVoucher.id,
        onRemoveVoucherSuccess: handleRemoveVoucherSuccess,
        onRemoveVoucherFailure: handleRemoveVoucherFailure,
      },
      theme,
    );
  };

  const handleUseVoucherOnlineSuccess = (
    cartData,
    fromDetailVoucher = false,
  ) => {
    pop();
    if (fromDetailVoucher) {
      setTimeout(pop, 0);
    }

    if (onUseVoucherOnlineSuccess) {
      onUseVoucherOnlineSuccess(cartData);
    } else if (cartData) {
      store.setCartData(cartData);
    }
  };

  const handleUseOnlineFailure = (response) => {};

  const handleRemoveVoucherSuccess = (cartData) => {
    pop();

    if (onRemoveVoucherOnlineSuccess) {
      onRemoveVoucherOnlineSuccess(cartData);
    } else if (cartData) {
      store.setCartData(cartData);
    }
  };

  const handleRemoveVoucherFailure = (response) => {};

  const useVoucherLabelWrapperStyle = useMemo(() => {
    return mergeStyles(styles.useVoucherLabelWrapper, {
      borderColor: theme.color.border,
      borderRightWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  const voucherIconStyle = useMemo(() => {
    return mergeStyles(styles.voucherIcon, {
      color:
        voucherStatus === VOUCHER_STATUS_ERROR
          ? theme.color.warning
          : theme.color.success,
    });
  }, [theme, voucherStatus]);

  return (
    <>
      <SectionContainer marginTop>
        <View style={styles.address_name_box}>
          <Typography type={TypographyType.LABEL_LARGE} style={styles.feeLabel}>
            {t('confirm.payment.price.temp')}
          </Typography>
          <View style={styles.address_default_box}>
            <Typography type={TypographyType.LABEL_LARGE_TERTIARY}>
              {tempPrice}
            </Typography>
          </View>
        </View>

        {Object.keys(itemFee).map((key) => {
          return (
            <View key={key} style={[styles.address_name_box, styles.feeBox]}>
              <Typography
                type={TypographyType.LABEL_LARGE_PRIMARY}
                style={styles.feeLabel}>
                {key}
              </Typography>
              <View style={styles.address_default_box}>
                <Typography type={TypographyType.LABEL_LARGE_PRIMARY}>
                  {itemFee[key]}
                </Typography>
              </View>
            </View>
          );
        })}
      </SectionContainer>

      <SectionContainer style={styles.totalPriceContainer}>
        <View style={styles.address_name_box}>
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={[styles.feeLabel, styles.both]}>
            {`${t('confirm.payment.price.total')} `}
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.totalItem}>
              ({totalItem} {t('confirm.unitName')})
            </Typography>
          </Typography>
          <View style={styles.address_default_box}>
            <Typography
              type={TypographyType.LABEL_LARGE_PRIMARY}
              style={styles.both}>
              {totalPrice}
            </Typography>
          </View>
        </View>
      </SectionContainer>

      {!isPromotionSelectable && (
        <SectionContainer marginTop>
          <View style={styles.address_name_box}>
            <View style={useVoucherLabelWrapperStyle}>
              <Icon
                bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                name="ticket-percent"
                style={voucherIconStyle}
              />
              <Typography type={TypographyType.LABEL_LARGE} style={styles.both}>
                {t('confirm.payment.discount.title')}
              </Typography>
            </View>

            <BaseButton
              style={[styles.address_default_box, styles.addVoucherWrapper]}
              onPress={handleOpenVoucher}>
              {!!promotionName ? (
                <View style={styles.promotionValueContainer}>
                  <Icon
                    bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                    name={
                      voucherStatus === VOUCHER_STATUS_ERROR
                        ? 'alert-circle'
                        : 'check-circle'
                    }
                    style={voucherIconStyle}
                  />
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    numberOfLines={2}>
                    {promotionName}
                  </Typography>
                </View>
              ) : (
                <Typography type={TypographyType.LABEL_MEDIUM}>
                  {t('confirm.payment.discount.add')}
                </Typography>
              )}
            </BaseButton>
          </View>
        </SectionContainer>
      )}

      {Object.keys(cashbackView).map((key, index) => {
        return (
          <SectionContainer
            key={key}
            marginTop={index === 0}
            style={styles.cashbackViewContainer}>
            <View style={styles.address_name_box}>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={[styles.feeLabel, styles.both]}>
                {key}
              </Typography>
              <View style={styles.address_default_box}>
                <Typography
                  type={TypographyType.LABEL_LARGE_PRIMARY}
                  style={styles.both}>
                  {cashbackView[key]}
                </Typography>
              </View>
            </View>
          </SectionContainer>
        );
      })}
    </>
  );
};

export default React.memo(PricingAndPromotionSection);
