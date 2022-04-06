import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {Container, TextButton, Typography, TypographyType} from '../base';
import {ThemeContext, useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

const styles = StyleSheet.create({
  pickerHeaderSubTitle: {
    letterSpacing: 1.15,
    alignSelf: 'center',
    marginTop: Platform.select({
      ios: 5,
      android: 2,
    }),
    paddingHorizontal: 15,
  },
  pickerHeaderSelectText: {
    fontWeight: 'bold',
  },
  pickerHeaderSelect: {
    marginLeft: 15,
  },
  pickerHeaderTitle: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  pickerHeaderCancelText: {
    fontWeight: 'bold',
  },
  pickerHeaderCancel: {
    marginRight: 15,
  },
  pickerHeaderMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerHeaderContainer: {
    zIndex: 1,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

const Header = ({
  cancelTitle = '',
  confirmTitle = '',
  selectedLabel = '',
  title = '',
  confirmDisabled = false,
  onHeaderLayout = () => {},
  onCancelPress = () => {},
  onSelectPress = () => {},
}) => {
  const {theme} = useTheme(ThemeContext);

  const confirmTypoProps = useMemo(() => {
    return {
      type: TypographyType.TITLE_MEDIUM_PRIMARY,
    };
  }, []);

  const cancelTypoProps = useMemo(() => {
    return {
      type: TypographyType.TITLE_MEDIUM,
    };
  }, []);

  const pickerHeaderContainerStyle = useMemo(() => {
    return mergeStyles(styles.pickerHeaderContainer, {
      borderBottomColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  return (
    <Container onLayout={onHeaderLayout} style={pickerHeaderContainerStyle}>
      <View style={styles.pickerHeaderMainContainer}>
        <TextButton
          hitSlop={HIT_SLOP}
          onPress={onCancelPress}
          style={styles.pickerHeaderCancel}
          title={cancelTitle}
          titleStyle={styles.pickerHeaderCancelText}
          typoProps={cancelTypoProps}
        />

        <Typography
          type={TypographyType.TITLE_LARGE}
          style={styles.pickerHeaderTitle}>
          {title}
        </Typography>

        <TextButton
          hitSlop={HIT_SLOP}
          onPress={onSelectPress}
          style={styles.pickerHeaderSelect}
          disabled={confirmDisabled}
          title={confirmTitle}
          titleStyle={styles.pickerHeaderSelectText}
          typoProps={confirmTypoProps}
        />
      </View>
      <Typography
        type={TypographyType.DESCRIPTION_MEDIUM}
        style={styles.pickerHeaderSubTitle}>
        {selectedLabel}
      </Typography>
    </Container>
  );
};

export default Header;
