import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {paddingLeft: 15},
  txt: {color: '#ccc', fontSize: 16},
});

const ExtraQuantityInput = React.memo(({message}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txt}>{message}</Text>
    </View>
  );
});

export default ExtraQuantityInput;
