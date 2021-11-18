import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

import {Container} from 'src/components/Layout';
import SectionContainer from '../SectionContainer';
import Tag from 'src/components/Tag';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 22,
    marginTop:3
  },

  desc_content: {
    fontSize: 12,
    color: '#666666',
  },
  orders_status: {
    fontSize: 12,
    fontWeight: '600',
  },

  block: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagContainer: {
    marginTop: 7,
  },
  cartTypeMainContainer: {},
  cartTypeContainer: {},
  cartTypeLabelContainer: {
    // marginRight: 5,
    paddingVertical: 3,
  },
  cartTypeLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
  },
});

const OrderInfoSection = ({
  code,
  typeCode,
  typeView,
  statusCode,
  statusView,
  paymentStatusCode,
  paymentStatusView,
}) => {
  const {t} = useTranslation('orders');
  return (
    <SectionContainer
      title={t('confirm.information.title')}
      iconName="info-circle"
      actionBtnTitle={t('confirm.information.status')}
      actionBtnTitleStyle={{
        color: '#666666',
      }}>
      <Container centerVertical={false} style={styles.container}>
        <View style={styles.block}>
          <Text style={styles.desc_content}>
            {`${t('confirm.information.ordersCode')}:`} {code}
          </Text>

          <Text
            style={[
              [
                styles.orders_status,
                {
                  color:
                    appConfig.colors.orderStatus[statusCode] ||
                    appConfig.colors.primary,
                },
              ],
            ]}>
            {statusView}
          </Text>
        </View>

        <View style={[styles.block, styles.tagContainer]}>
          <View style={styles.cartTypeMainContainer}>
            {!!typeView && (
              <View style={styles.cartTypeContainer}>
                <Tag
                  label={typeView}
                  fill={appConfig.colors.cartType[typeCode]}
                  animate={false}
                  strokeWidth={0}
                  labelStyle={styles.cartTypeLabel}
                  labelContainerStyle={styles.cartTypeLabelContainer}
                />
              </View>
            )}
          </View>

          {!!paymentStatusView && (
            <View style={styles.cartTypeContainer}>
              <Tag
                label={paymentStatusView}
                fill={hexToRgba(
                  appConfig.colors.paymentStatus[paymentStatusCode],
                  0.1,
                )}
                animate={false}
                strokeWidth={0}
                labelStyle={[
                  styles.cartTypeLabel,
                  {
                    color: appConfig.colors.paymentStatus[paymentStatusCode],
                  },
                ]}
                labelContainerStyle={styles.cartTypeLabelContainer}
              />
            </View>
          )}
        </View>
      </Container>
    </SectionContainer>
  );
};

export default React.memo(OrderInfoSection);
