import React from 'react';
import {StyleSheet} from 'react-native';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Icon, Typography} from 'src/components/base';
import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  icon: {
    width: 15,
    fontSize: 19,
  },
  desc_content: {
    marginTop: 4,
    marginLeft: 22,
    textTransform: 'uppercase',
  },
  orders_status: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 15,
  },
});

const POSSection = ({code}) => {
  const {t} = useTranslation('orders');

  return (
    <SectionContainer
      title={t('confirm.information.POSTitle')}
      customIcon={
        <Icon
          neutral
          bundle={BundleIconSetName.FONTISO}
          style={styles.icon}
          name="shopping-pos-machine"
        />
      }
      marginTop>
      <Typography
        type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
        style={styles.desc_content}>
        {code}
      </Typography>
    </SectionContainer>
  );
};

export default React.memo(POSSection);
