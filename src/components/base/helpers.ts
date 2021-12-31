import {isEmpty, isObject} from 'lodash';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export const getFontStyle = (
  styles: StyleProp<ViewStyle | TextStyle>,
): StyleProp<TextStyle> => {
  let colorStyle = {};
  let normalizedStyle = [];
  normalizeStyles(styles, normalizedStyle);
  normalizedStyle.forEach((style) => {
    if (style?.color && typeof style?.color === 'string') {
      colorStyle = {color: style.color};
    }
  });
  return colorStyle;
};

const normalizeStyles = (styles = {}, result = []) => {
  if (Array.isArray(styles)) {
    styles.map((style) => {
      if (Array.isArray(style)) {
        normalizeStyles(style, result);
      } else {
        result.push(style);
      }
    });
  } else {
    result.push(styles);
  }
};
