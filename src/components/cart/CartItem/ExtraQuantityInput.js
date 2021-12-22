import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  container: {paddingLeft: 15},
});

const ExtraQuantityInput = ({message}) => {
  return (
    <View style={styles.container}>
      <Typography type={TypographyType.LABEL_LARGE_SECONDARY}>
        {message}
      </Typography>
    </View>
  );
};

export default memo(ExtraQuantityInput);
