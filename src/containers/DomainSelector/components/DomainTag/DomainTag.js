import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  labelContainer: {
    padding: 3,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 10,
  },
});

const DomainTag = ({label, containerStyle}) => {
  const {theme} = useTheme();

  const labelStyle = useMemo(() => {
    return mergeStyles(styles.label, {color: theme.color.white});
  }, [theme]);

  const labelContainerStyle = useMemo(() => {
    return mergeStyles(styles.labelContainer, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  return (
    <View style={[labelContainerStyle, containerStyle]}>
      <Typography type={TypographyType.LABEL_MEDIUM} style={labelStyle}>
        {label}
      </Typography>
    </View>
  );
};

export default React.memo(DomainTag);
