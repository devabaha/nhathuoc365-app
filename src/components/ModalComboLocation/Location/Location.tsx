import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// types
import {LocationProps} from '.';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {LOCATION_HEIGHT} from '../constants';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Typography, Icon, BaseButton} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    height: LOCATION_HEIGHT,
    paddingHorizontal: 15,
    flex: 1,
  },
  title: {
    flex: 1,
    paddingRight: 15,
  },
});

const Location = ({
  title,
  selected,

  onPress,
}: LocationProps) => {
  const {theme} = useTheme();

  const containerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          borderBottomWidth: theme.layout.borderWidthSmall,
          borderColor: theme.color.border,
        },
      ],
      selected && {backgroundColor: theme.color.contentBackgroundPrimary},
    );
  }, [theme, selected]);

  const iconStyle = useMemo(() => {
    return {color: theme.color.primaryHighlight, fontSize: 20};
  }, [theme]);

  return (
    <Container row>
      <BaseButton
        useTouchableHighlight
        onPress={onPress}
        style={containerStyle}>
        <Container noBackground flex row>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={styles.title}
            numberOfLines={2}>
            {title}
          </Typography>
          {selected && (
            <Icon
              bundle={BundleIconSetName.ANT_DESIGN}
              name="check"
              style={iconStyle}
            />
          )}
        </Container>
      </BaseButton>
    </Container>
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.selected === nextProps.selected
  );
};

export default React.memo(Location, areEquals);
