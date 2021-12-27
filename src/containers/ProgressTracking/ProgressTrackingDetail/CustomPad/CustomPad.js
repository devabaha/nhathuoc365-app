import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Icon} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
  },
  iconDirection: {
    fontSize: 16,
  },
});

const CustomPad = ({dimensions: padDimensions, isReverse}) => {
  const {theme} = useTheme();

  const contentDimensions = padDimensions / 6;
  const borderWidth = 1;
  const contentDimensionsOutline = contentDimensions + borderWidth;
  const contentTop = contentDimensionsOutline / 4;

  const iconDirectionStyle = useMemo(() => {
    return {
      color: theme.color.primaryHighlight,
    };
  }, [theme]);

  const wrapperStyle = useMemo(() => {
    return mergeStyles(styles.wrapper, {
      top: 20 + contentTop,
    });
  }, [contentTop]);

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.wrapper, {
      top: contentTop,
      transform: [
        {
          rotate: isReverse ? '180deg' : '0deg',
        },
      ],
    });
  }, [contentTop, isReverse]);

  return (
    <Container noBackground shadow center style={wrapperStyle}>
      <Container noBackground row style={containerStyle}>
        <Icon
          bundle={BundleIconSetName.IONICONS}
          name="caret-up"
          style={[styles.iconDirection, iconDirectionStyle]}
        />
      </Container>
    </Container>
  );
};

export default CustomPad;
