import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const styles = StyleSheet.create({
  wrapperStyle: {
    flex: 1,
  },
  containerStyle: {
    flex: 1,
  },
  content:{
      margin: 8,
      color: '#404040',
      fontSize: 16,
      fontWeight: '400',
  }
});

const AddressContainer = (props) => {
  return (
    <View style={[styles.wrapperStyle, props.containerStyle]}>
          <View style={[styles.containerStyle,props.styleContainerTitle]}>
              <Text style={styles.content}>{props.title}</Text>
          </View>
        {props.children}
    </View>
  );
};

export default AddressContainer;
