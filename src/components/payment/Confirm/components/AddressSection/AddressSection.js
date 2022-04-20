import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import SectionContainer from '../SectionContainer';

const styles = StyleSheet.create({
  icon: {
    fontSize: 12,
  },

  address_content: {
    marginTop: 12,
    marginLeft: 22,
  },
  address_content_phone: {
    marginTop: 4,
    fontWeight: '600',
  },
  address_content_address_detail: {
    marginTop: 4,
    lineHeight: 20,
    paddingRight: 15,
  },
  address_name: {
    fontWeight: '600',
    flex: 1,
  },

  comboAddress: {
    marginLeft: -22 - 15,
    marginRight: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    letterSpacing: 0.2,
    marginTop: 10,
    fontWeight: '400',
  },
});

const AddressSection = ({
  name = '',
  tel = '',
  address = '',
  comboAddress = '',
  editable = true,
  marginTop = true,

  onPressActionBtn = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const comboAddressStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackgroundWeak,
    };
  }, [theme]);

  return (
    <SectionContainer
      marginTop={marginTop}
      iconName="truck"
      iconStyle={styles.icon}
      title={t('confirm.address.title')}
      actionBtnTitle={editable ? t('confirm.change') : t('confirm.copy.title')}
      onPressActionBtn={onPressActionBtn}>
      <View style={styles.address_content}>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={styles.address_name}>
          {name}
        </Typography>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={styles.address_content_phone}>
          {tel}
        </Typography>
        <Typography
          type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
          style={styles.address_content_address_detail}>
          {address}
        </Typography>

        {!!comboAddress && (
          <Typography
            type={TypographyType.LABEL_SEMI_MEDIUM}
            style={[styles.comboAddress, comboAddressStyle]}>
            {comboAddress}
          </Typography>
        )}
      </View>
    </SectionContainer>
  );
};

export default React.memo(AddressSection);
