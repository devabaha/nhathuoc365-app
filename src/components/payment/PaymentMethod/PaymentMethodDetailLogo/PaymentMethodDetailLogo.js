import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  paymentMethodDetailLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodDetailLogo: {
    marginLeft: 10,
    resizeMode: 'contain',
    width: 50,
    height: 50,
    flex: 1,
  },
});

const PaymentMethodDetailLogo = (props) => {
  return (
    <View style={styles.paymentMethodDetailLogoContainer}>
      <CachedImage
        mutable
        source={{uri: props.image}}
        style={styles.paymentMethodDetailLogo}
      />
    </View>
  );
};

export default PaymentMethodDetailLogo;
