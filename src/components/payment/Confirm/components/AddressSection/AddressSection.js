import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  address_content_address_detail: {
    color: '#404040',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
    paddingRight: 15,
  },
  address_name: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },

  comboAddress: {
    marginLeft: -22 - 15,
    marginRight: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    color: '#333',
    letterSpacing: 0.2,
    marginTop: 10,
    fontSize: 13,
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
  const {t} = useTranslation('orders');

  return (
    <SectionContainer
      marginTop={marginTop}
      iconName="truck"
      iconStyle={styles.icon}
      title={t('confirm.address.title')}
      actionBtnTitle={editable ? t('confirm.change') : t('confirm.copy.title')}
      onPressActionBtn={onPressActionBtn}>
      <View style={styles.address_content}>
        <Text style={styles.address_name}>{name}</Text>
        <Text style={styles.address_content_phone}>{tel}</Text>
        <Text style={styles.address_content_address_detail}>{address}</Text>

        {!!comboAddress && (
          <Text style={styles.comboAddress}>{comboAddress}</Text>
        )}
      </View>
    </SectionContainer>
  );
};

export default React.memo(AddressSection);
