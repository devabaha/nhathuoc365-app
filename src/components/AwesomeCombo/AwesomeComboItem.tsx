import React, {useMemo} from 'react';
import {StyleSheet, GestureResponderEvent} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  title: {
    flex: 1,
  },
  last: {
    borderBottomWidth: 0,
  },
});

type AwesomeComboItemProps = {
  title: string;
  last?: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

const AwesomeComboItem = ({
  title,
  last = false,
  onPress,
}: AwesomeComboItemProps) => {
  const {theme} = useTheme();

  const textBtnTypoProps = {type: TypographyType.LABEL_MEDIUM_SECONDARY};

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  return (
    <TextButton
      typoProps={textBtnTypoProps}
      onPress={onPress}
      titleStyle={styles.title}
      style={[containerStyle, last && styles.last]}>
      {title}
    </TextButton>
  );
};

export default AwesomeComboItem;
