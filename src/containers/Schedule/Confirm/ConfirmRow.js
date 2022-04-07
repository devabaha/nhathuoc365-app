import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Icon, Input, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  rowIcon: {
    fontSize: 30,
    paddingVertical: 10,
    paddingRight: 20,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontWeight: '500',
  },
  rowSubTitle: {
    marginTop: 5,
  },
  input: {
    marginTop: 7,
    paddingBottom: 7,
  },
});

const ConfirmRow = (props) => {
  const {theme} = useTheme();

  const inputStyle = useMemo(() => {
    return mergeStyles(styles.input, {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderBottomColor: theme.color.border,
    });
  }, [theme]);

  return (
    <View style={styles.row}>
      <Icon
        neutral
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name={props.iconName}
        style={styles.rowIcon}
      />
      <View style={styles.rowInfo}>
        <Typography type={TypographyType.LABEL_LARGE} style={styles.rowTitle}>
          {props.title}
        </Typography>
        {props.editable ? (
          <Input
            style={inputStyle}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
          />
        ) : (
          !!props.subTitle && (
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.rowSubTitle}>
              {props.subTitle}
            </Typography>
          )
        )}
      </View>
    </View>
  );
};
export default ConfirmRow;
