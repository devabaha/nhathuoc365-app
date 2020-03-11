import React from 'react';
import { StyleSheet } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function CloseButton(props) {
  return (
    <Button containerStyle={styles.container} onPress={Actions.pop}>
      <Icon name="close" size={24} color={props.color || '#333'} />
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginHorizontal: 4
  }
});

export default CloseButton;
