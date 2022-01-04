import React from 'react';
import {StyleSheet} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  icon: {
    fontSize: 13,
  },
  desc_content: {
    marginTop: 4,
    marginLeft: 22,
  },
  orders_status: {
    fontWeight: '600',
    marginTop: 15,
  },
});

const DeliverySection = ({code, statusColor, statusName}) => {
  const {t} = useTranslation('orders');

  return (
    <SectionContainer
      title={t('confirm.information.deliveryTitle')}
      iconName="shipping-fast"
      iconStyle={styles.icon}
      marginTop>
      <Typography
        type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
        style={styles.desc_content}>
        {code}
      </Typography>
      <Typography
        type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
        style={[
          styles.desc_content,
          styles.orders_status,
          {
            color: statusColor,
          },
        ]}>
        {statusName}
      </Typography>
    </SectionContainer>
  );
};

export default React.memo(DeliverySection);
