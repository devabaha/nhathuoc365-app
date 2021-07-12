import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  titleContainer: {
    padding: 15,
    backgroundColor: appConfig.colors.primary,
    backgroundColor: '#FFF',
    borderBottomWidth: 2,
    borderColor: appConfig.colors.primary,
    borderColor: '#eee',
  },
  title: {
    color: appConfig.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'right',
    fontStyle: 'italic',
  },
});

const AddressContainer = ({
  title,
  containerStyle,
  titleContainerStyle,
  children,

  onLayout,
}) => {
  return (
    <View onLayout={onLayout} style={[styles.container, containerStyle]}>
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default AddressContainer;
