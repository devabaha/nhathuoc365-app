import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, Container} from 'src/components/base';
// custom components
import {Icon} from 'src/components/base';

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});

const IconAngleRight = ({label}) => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      marginLeft: label ? 10 : 0,
      color: theme.color.neutral1,
    });
  }, [theme]);

  return (
    <Container noBackground row>
      {label}
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="angle-right"
        style={iconStyle}
      />
    </Container>
  );
};

export default memo(IconAngleRight);
