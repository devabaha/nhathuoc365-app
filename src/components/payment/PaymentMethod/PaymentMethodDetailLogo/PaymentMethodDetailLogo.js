import React from 'react';
import {StyleSheet, View} from 'react-native';
// custom components
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  paymentMethodDetailLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodDetailLogo: {
    marginLeft: 10,
    width: 50,
    height: 50,
    flex: 1,
  },
});

const PaymentMethodDetailLogo = (props) => {
  return (
    <View style={styles.paymentMethodDetailLogoContainer}>
      <Image
        mutable
        source={{uri: props.image}}
        resizeMode="contain"
        style={styles.paymentMethodDetailLogo}
      />
    </View>
  );
};

export default PaymentMethodDetailLogo;
