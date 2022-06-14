import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
import Communications from 'app-helper/Communications';
// custom components
import {Typography, Icon, BaseButton} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
});

const HistoryRow = (props) => {
  const {theme} = useTheme();

  const onPressRow = () => {
    Communications.phonecall(props.tel, true);
  };

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderBottomWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <BaseButton
      useTouchableHighlight
      onPress={() => onPressRow()}
      // underlayColor="transparent"
    >
      <View style={containerStyle}>
        <View style={styles.contentContainer}>
          <Icon
            neutral
            bundle={BundleIconSetName.FONT_AWESOME}
            name="user"
            size={24}
          />
          <View style={[styles.mainContent]}>
            <Typography type={TypographyType.LABEL_LARGE}>
              {props.title}
            </Typography>
            <Typography type={TypographyType.LABEL_SMALL}>
              {props.tel}
            </Typography>
            <Typography type={TypographyType.LABEL_SMALL}>
              {props.date}
            </Typography>
          </View>
        </View>
      </View>
    </BaseButton>
  );
};

export default memo(HistoryRow);
