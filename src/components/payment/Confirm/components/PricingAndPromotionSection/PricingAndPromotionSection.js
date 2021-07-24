import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from 'react-native-button';

import appConfig from 'app-config';

import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  address_name_box: {
    flexDirection: 'row',
  },
  address_default_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  address_default_title: {
    color: '#666666',
    fontSize: 12,
  },
  text_total_items: {
    fontSize: 14,
    color: '#333',
  },
  feeContainer: {
    borderTopWidth: 0,
    backgroundColor: '#fafafa',
  },
  feeBox: {
    marginTop: 12,
  },
  feeLabel: {
    fontSize: 16,
    flex: 1,
  },
  feeValue: {
    fontSize: 16,
    color: appConfig.colors.text,
  },
  title_active: {
    color: appConfig.colors.primary,
  },

  both: {
    fontWeight: '600',
  },

  totalPriceContainer: {
    borderTopWidth: 0,
  },
  totalItem: {
    fontWeight: '400',
    fontSize: 14,
  },

  useVoucherLabelWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  addVoucherWrapper: {
    flex: 1,
    borderLeftWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ebebeb',
  },
  addVoucherLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  voucherIcon: {
    color: appConfig.colors.status.success,
    fontSize: 20,
    marginRight: 5,
  },
  promotionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
  },
});

const PricingAndPromotionSection = ({
  tempPrice,
  totalItem,
  totalPrice,
  promotionName,

  isPromotionSelectable,

  itemFee = {},
  cashbackView = {},

  onPressVoucher = () => {},
}) => {
  const {t} = useTranslation('orders');

  return (
    <>
      <SectionContainer marginTop style={styles.feeContainer}>
        <View style={[styles.address_name_box]}>
          <Text style={[styles.text_total_items, styles.feeLabel]}>
            {t('confirm.payment.price.temp')}
          </Text>
          <View style={styles.address_default_box}>
            <Text
              style={[
                styles.address_default_title,
                styles.feeValue,
              ]}>
              {tempPrice}
            </Text>
          </View>
        </View>

        {Object.keys(itemFee).map((key) => {
          return (
            <View key={key} style={[styles.address_name_box, styles.feeBox]}>
              <Text
                style={[
                  styles.text_total_items,
                  styles.feeLabel,
                styles.title_active,
                ]}>
                {key}
              </Text>
              <View style={styles.address_default_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <Text
                    style={[
                      styles.address_default_title,
                      styles.feeValue,
                      styles.title_active,
                    ]}>
                    {itemFee[key]}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          );
        })}
      </SectionContainer>

      <SectionContainer style={styles.totalPriceContainer}>
        <View style={styles.address_name_box}>
          <Text style={[styles.text_total_items, styles.feeLabel, styles.both]}>
            {`${t('confirm.payment.price.total')} `}
            <Text style={styles.totalItem}>
              ({totalItem} {t('confirm.unitName')})
            </Text>
          </Text>
          <View style={styles.address_default_box}>
            <Text
              style={[
                styles.address_default_title,
                styles.feeValue,
                styles.both,
                styles.title_active,
            ]}>
              {totalPrice}
            </Text>
          </View>
        </View>
      </SectionContainer>

      {isPromotionSelectable && (
        <SectionContainer marginTop>
          <View style={styles.address_name_box}>
            <View style={styles.useVoucherLabelWrapper}>
              <MaterialCommunityIcons
                name="ticket-percent"
                style={styles.voucherIcon}
              />
              <Text
                style={[styles.text_total_items, styles.feeLabel, styles.both]}>
                {t('confirm.payment.discount.title')}
              </Text>
            </View>
            <Button
              containerStyle={[
                styles.address_default_box,
                styles.addVoucherWrapper,
              ]}
              onPress={onPressVoucher}>
              {!!promotionName ? (
                <View style={styles.promotionValueContainer}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    style={styles.voucherIcon}
                  />
                  <Text numberOfLines={1} style={[styles.addVoucherLabel]}>
                    {promotionName}
                  </Text>
                </View>
              ) : (
                <Text style={styles.addVoucherLabel}>
                  {t('confirm.payment.discount.add')}
                </Text>
              )}
            </Button>
          </View>
        </SectionContainer>
      )}

      {Object.keys(cashbackView).map((key, index) => {
        return (
          <SectionContainer
            key={key}
            marginTop={index === 0}
            style={[
              {
                borderTopWidth: 0,
              },
            ]}>
            <View style={styles.address_name_box}>
              <Text
                style={[styles.text_total_items, styles.feeLabel, styles.both]}>
                {key}
              </Text>
              <View style={styles.address_default_box}>
                <Text
                  style={[
                    styles.address_default_title,
                    styles.feeValue,
                    styles.both,
                    styles.title_active,
                ]}>
                  {cashbackView[key]}
                </Text>
              </View>
            </View>
          </SectionContainer>
        );
      })}
    </>
  );
};

export default React.memo(PricingAndPromotionSection);
