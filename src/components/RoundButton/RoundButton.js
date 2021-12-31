import React from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Typography, Container} from 'src/components/base';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  titleHorizontal: {
    marginTop: 0,
    marginHorizontal: 10,
  },
});

function RoundButton({
  row = false,
  title,
  bgrColor,
  width,
  height,
  radius,
  wrapperStyle,
  contentContainerStyle,
  style,
  titleStyle,
  children,
  onPress,
}) {
  const containerStyle = {
    width: width || height,
    height: height || width,
    borderRadius: radius || width ? width / 2 : height ? height / 2 : 0,
    backgroundColor: bgrColor,
  };

  return (
    <BaseButton onPress={onPress} style={[styles.wrapper, wrapperStyle]}>
      <Container centerHorizontal row={row} style={contentContainerStyle}>
        <View style={[styles.container, containerStyle, style]}>
          {children}
        </View>
        {!!title && (
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[styles.title, row && styles.titleHorizontal, titleStyle]}>
            {title}
          </Typography>
        )}
      </Container>
    </BaseButton>
  );
}

export default React.memo(RoundButton);
