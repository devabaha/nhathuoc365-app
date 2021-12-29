import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {ButtonRoundedType, TypographyType} from 'src/components/base';
// custom components
import {AppFilledButton} from 'src/components/base';

function ButtonTag({text, onPress, checked}) {
  const {theme} = useTheme();

  const tagTypoProps = {
    type: TypographyType.LABEL_SEMI_MEDIUM,
  };

  const containerStyle = useMemo(() => {
    return {
      backgroundColor: checked
        ? theme.color.persistPrimary
        : theme.color.surface,
    };
  }, [theme, checked]);

  const checkedTitleStyle = useMemo(() => {
    return {
      color: checked ? theme.color.onPersistPrimary : theme.color.onSurface,
    };
  }, [theme, checked]);

  return (
    <AppFilledButton
      typoProps={tagTypoProps}
      rounded={ButtonRoundedType.EXTRA_SMALL}
      style={[styles.containerTag, containerStyle]}
      titleStyle={[
        styles.title,
        theme.typography[TypographyType.LABEL_SEMI_MEDIUM],
        checkedTitleStyle,
      ]}
      numberOfLines={3}
      onPress={onPress}>
      {text}
    </AppFilledButton>
  );
}

const styles = StyleSheet.create({
  containerTag: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    textAlign: 'center',
  },
});

const areEquals = (prev, next) => {
  return prev.text === next.text && prev.checked === next.checked;
};

export default React.memo(ButtonTag, areEquals);
