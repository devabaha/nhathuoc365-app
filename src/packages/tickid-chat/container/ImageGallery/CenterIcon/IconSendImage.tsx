import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import CenterIcon from './CenterIcon';

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
});

const IconSendImage = ({style}) => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.icon,
        {
          color: theme.color.accent2,
        },
      ],
      style,
    );
  }, [theme, style]);

  return (
    <CenterIcon
      bundle={BundleIconSetName.FONT_AWESOME}
      name="paper-plane"
      style={iconStyle}
    />
  );
};

export default memo(IconSendImage);
