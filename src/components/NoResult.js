import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BUNDLE_ICON_SETS, BUNDLE_ICON_SETS_NAME} from 'src/constants';

const NO_RESULT_COLOR = '#909090';

const NoResult = ({
  icon = null,
  iconBundle = BUNDLE_ICON_SETS_NAME.MaterialCommunityIcons,
  iconName = 'file-remove',
  message = '',
<<<<<<< HEAD
  contentContainerStyle = {},
=======
>>>>>>> abaha/core
  containerStyle = {},
  textStyle = {},
}) => {
  const Icon = BUNDLE_ICON_SETS[iconBundle];

  return (
    <View style={[styles.container, containerStyle]}>
<<<<<<< HEAD
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {icon || <Icon name={iconName} size={72} color={NO_RESULT_COLOR} />}
        <Text style={[styles.text, textStyle]}>{message}</Text>
=======
      <View style={styles.wrapper}>
        {icon || <Icon name={iconName} size={72} color={NO_RESULT_COLOR} />}
        {!!message && <Text style={[styles.text, textStyle]}>{message}</Text>}
>>>>>>> abaha/core
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
    alignItems: 'center',
    paddingVertical: '20%',
    paddingBottom: '35%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: NO_RESULT_COLOR,
    paddingTop: 15,
    // paddingBottom: 100,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default NoResult;
