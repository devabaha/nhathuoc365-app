import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DEFAULT_COLOR = '#909090';

const NoResult = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={styles.wrapper}>
        {props.icon || (
          <Icon
            name={props.iconName || 'file-remove'}
            size={72}
            color={DEFAULT_COLOR}
          />
        )}
        <Text style={styles.text}>{props.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: DEFAULT_COLOR,
    paddingTop: 15,
    fontSize: 20,
    paddingBottom: 100,
    fontWeight: '500'
  }
});

export default NoResult;
