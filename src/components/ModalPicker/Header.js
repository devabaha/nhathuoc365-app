import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {Container, TextButton, Typography, TypographyType} from '../base';
import {ThemeContext, useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

const styles = StyleSheet.create({
  languagePickerSubTitle: {
    letterSpacing: 1.15,
    alignSelf: 'center',
    marginTop: Platform.select({
      ios: 5,
      android: 2,
    }),
  },
  languagePickerSelectText: {
    fontWeight: 'bold',
  },
  languagePickerSelect: {
    position: 'absolute',
    right: 15,
  },
  languagePickerTitle: {
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  languagePickerCancelText: {
    fontWeight: 'bold',
  },
  languagePickerCancel: {
    position: 'absolute',
    left: 15,
  },
  languagePickerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  languagePickerHeaderContainer: {
    zIndex: 1,
    width: '100%',
    paddingVertical: 10,
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

  const languagePickerHeaderContainerStyle = useMemo(() => {
    return mergeStyles(styles.languagePickerHeaderContainer, {
      borderBottomColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  return (
    <Container
      onLayout={onHeaderLayout}
      style={languagePickerHeaderContainerStyle}>
      <View style={styles.languagePickerHeader}>
        <TextButton
          hitSlop={HIT_SLOP}
          onPress={onCancelPress}
          style={styles.languagePickerCancel}
          title={cancelTitle}
          titleStyle={styles.languagePickerCancelText}
          typoProps={cancelTypoProps}
        />

        <Typography
          type={TypographyType.TITLE_LARGE}
          style={styles.languagePickerTitle}>
          {title}
        </Typography>

        <TextButton
          hitSlop={HIT_SLOP}
          onPress={onSelectPress}
          style={styles.languagePickerSelect}
          disabled={confirmDisabled}
          title={confirmTitle}
          titleStyle={styles.languagePickerSelectText}
          typoProps={confirmTypoProps}
        />
      </View>
      <Typography
        type={TypographyType.DESCRIPTION_MEDIUM}
        style={styles.languagePickerSubTitle}>
        {selectedLabel}
      </Typography>
    </Container>
  );
};

export default Header;
