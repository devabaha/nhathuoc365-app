import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import Tag from 'src/components/Tag';
import {Typography, Container} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 22,
    marginTop: 3,
  },

  orders_status: {
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
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const actionBtnTitleStyle = useMemo(() => {
    return {color: theme.color.textTertiary};
  }, [theme]);

  const orderStatusStyle = useMemo(() => {
    return mergeStyles(styles.orders_status, {
      color: theme.color.cartStatus[statusCode] || theme.color.primaryHighlight,
    });
  }, [theme, statusCode]);

  const paymentStatusLabelStyle = useMemo(() => {
    return mergeStyles(styles.cartTypeLabel, {
      color: theme.color.cartPaymentStatus[paymentStatusCode],
    });
  }, [theme, paymentStatusCode]);

  const paymentStatusColor = useMemo(() => {
    return hexToRgba(theme.color.cartPaymentStatus[paymentStatusCode], 0.1);
  }, [theme, paymentStatusCode]);

  return (
    <SectionContainer
      title={t('confirm.information.title')}
      iconName="info-circle"
      actionBtnTitle={t('confirm.information.status')}
      actionBtnTitleStyle={actionBtnTitleStyle}>
      <Container centerVertical={false} style={styles.container}>
        <View style={styles.block}>
          <Typography type={TypographyType.DESCRIPTION_SMALL_TERTIARY}>
            {`${t('confirm.information.ordersCode')}:`} {code}
          </Typography>

          <Typography
            type={TypographyType.LABEL_SMALL}
            style={orderStatusStyle}>
            {statusView}
          </Typography>
        </View>

        <View style={[styles.block, styles.tagContainer]}>
          <View style={styles.cartTypeMainContainer}>
            {!!typeView && (
              <View style={styles.cartTypeContainer}>
                <Tag
                  label={typeView}
                  fill={theme.color.cartType[typeCode]}
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
                fill={paymentStatusColor}
                animate={false}
                strokeWidth={0}
                labelStyle={paymentStatusLabelStyle}
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
