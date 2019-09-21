import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  TouchableHighlight,
  Text as NativeText
} from 'react-native';
import TextElement from '../text/Text';
import fonts from '../config/fonts';
import colors from '../config/colors';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import getIconType from '../helpers/getIconType';
import ViewPropTypes from '../config/ViewPropTypes';

const CheckBox = props => {
  const {
    component,
    checked,
    iconRight,
    title,
    center,
    right,
    containerStyle,
    textStyle,
    onPress,
    onLongPress,
    onIconPress,
    onLongIconPress,
    checkedIcon,
    uncheckedIcon,
    iconType,
    checkedColor,
    uncheckedColor,
    checkedTitle,
    fontFamily,
    hiddenTextElement,
    ...attributes
  } = props;

  let Icon = FAIcon;
  if (iconType) {
    Icon = getIconType(iconType);
  }
  const Component = component || TouchableHighlight;
  let iconName = uncheckedIcon;
  if (checked) {
    iconName = checkedIcon;
  }
  return (
    <Component
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.container, containerStyle && containerStyle]}
      {...attributes}
      underlayColor="transparent"
    >
      <View
        style={[
          styles.wrapper,
          right && { justifyContent: 'flex-end' },
          center && { justifyContent: 'center' }
        ]}
      >
        {!iconRight && (
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
            style={{
              width: 24
            }}
          />
        )}
        {!hiddenTextElement && (
          <TextElement
            style={[
              styles.text,
              textStyle && textStyle,
              fontFamily && { fontFamily }
            ]}
          >
            {checked ? checkedTitle || title : title}
          </TextElement>
        )}
        {iconRight && (
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
          />
        )}
      </View>
    </Component>
  );
};

CheckBox.defaultProps = {
  checked: false,
  iconRight: false,
  right: false,
  center: false,
  checkedColor: 'green',
  uncheckedColor: '#bfbfbf',
  checkedIcon: 'check-square-o',
  uncheckedIcon: 'square-o'
};

CheckBox.propTypes = {
  component: PropTypes.any,
  checked: PropTypes.bool,
  iconRight: PropTypes.bool,
  title: PropTypes.string,
  center: PropTypes.bool,
  right: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  textStyle: NativeText.propTypes.style,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  checkedIcon: PropTypes.string,
  uncheckedIcon: PropTypes.string,
  iconType: PropTypes.string,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string,
  checkedTitle: PropTypes.string,
  onIconPress: PropTypes.func,
  onLongIconPress: PropTypes.func,
  fontFamily: PropTypes.string
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderColor: '#ededed',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3
  },
  text: {
    marginLeft: 10,
    marginRight: 10,
    color: colors.grey1,
    ...Platform.select({
      ios: {
        fontWeight: 'bold'
      },
      android: {
        ...fonts.android.bold
      }
    })
  }
});

export default CheckBox;