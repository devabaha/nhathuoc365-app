import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {Typography, TypographyType} from 'src/components/base';
// custom components
import {Container} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  titleContainer: {
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'right',
    fontStyle: 'italic',
  },
});

const AddressContainer = ({
  title,
  containerStyle: containerStyleProp,
  titleContainerStyle: titleContainerStyleProp,
  children,

  onLayout,
}) => {
  const {theme} = useTheme();

  const containerStyles = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          borderColor: theme.color.border,
          borderBottomWidth: theme.layout.borderWidth,
        },
      ],
      containerStyleProp,
    );
  }, [theme, containerStyleProp]);

  const titleContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.titleContainer,
        {
          borderColor: theme.color.border,
          borderBottomWidth: theme.layout.borderWidthLarge,
        },
      ],
      titleContainerStyleProp,
    );
  }, [theme, titleContainerStyleProp]);

  return (
    <View onLayout={onLayout} style={containerStyles}>
      {!!title && (
        <Container style={titleContainerStyle}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_PRIMARY}
            style={styles.title}>
            {title}
          </Typography>
        </Container>
      )}
      {children}
    </View>
  );
};

export default AddressContainer;
