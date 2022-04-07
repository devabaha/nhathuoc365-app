import React, {useMemo} from 'react';
import {StyleSheet, Platform, View} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {CloseButton} from 'app-packages/tickid-navbar';
import {
  BaseButton,
  NavBar as BaseNavBar,
  Typography,
} from 'src/components/base';

const styles = StyleSheet.create({
  mainContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: 44,
      },
      android: {
        height: 54,
      },
      windows: {
        height: 54,
      },
    }),
  },

  title: {
    fontWeight: '600',
  },

  closeBtnContainer: {},
});

function NavBar({navigation, onClose = () => {}}) {
  const {theme} = useTheme();

  const containerStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
      borderBottomWidth: theme.layout.borderWidthPixel,
      borderBottomColor: theme.color.border,
    };
  }, [theme]);

  const backButtonColor = useMemo(() => {
    return theme.color.textPrimary;
  }, [theme]);

  const renderBack = (iconStyle) => (
    <BaseButton onPress={onClose}>
      <View pointerEvents="none">
        <CloseButton iconStyle={iconStyle} />
      </View>
    </BaseButton>
  );

  return <BaseNavBar navigation={navigation} renderBack={renderBack} />;
}

export default NavBar;
