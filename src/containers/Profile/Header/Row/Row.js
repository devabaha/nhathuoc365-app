import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  rowTitle: {
    lineHeight: 18,
    flex: 1,
  },
  icon: {
    width: 20,
    fontSize: 14,
    marginRight: 0,
  },
});

const Row = ({
  titleStyle = {},
  style = {},
  content = '',
  iconName = '',
  iconStyle: iconStyleProps = {},
}) => {
  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, iconStyleProps);
  }, [iconStyleProps]);

  return (
    <View style={[styles.row, style]}>
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name={iconName}
        style={iconStyle}
      />
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        style={[styles.rowTitle, titleStyle]}>
        {content}
      </Typography>
    </View>
  );
};

export default React.memo(Row);
