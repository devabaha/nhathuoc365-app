import React from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});

const NoPaymentMethod = (props) => {
  return (
    <View style={styles.noResultContainer}>
      <Typography type={TypographyType.DESCRIPTION_MEDIUM}>
        {props.message}
      </Typography>
    </View>
  );
};

export default NoPaymentMethod;
