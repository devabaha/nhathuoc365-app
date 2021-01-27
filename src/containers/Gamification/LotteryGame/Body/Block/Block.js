import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { MAIN_COLOR } from '../../constants';

const styles = StyleSheet.create({
  block: {
    padding: 15
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: -15,
    backgroundColor: '#f3f3f3',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  icon: {
    fontSize: 20,
    color: MAIN_COLOR,
    marginLeft: 15
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: MAIN_COLOR,
    marginLeft: 15,
    fontStyle: 'italic'
  },
  content: {
    color: '#333'
  }
});

const Block = ({
  containerStyle,
  titleContainerStyle,
  titleStyle,
  contentStyle,
  iconStyle,
  title,
  content,
  iconName,
  icon
}) => {
  return (
    <View style={[styles.block, containerStyle]}>
      <View style={[styles.titleContainer, titleContainerStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {icon || <Icon name={iconName} style={[styles.icon, iconStyle]} />}
      </View>
      <Text style={[styles.content, contentStyle]}>{content}</Text>
    </View>
  );
};

export default Block;
