import React, {useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Container from '../Layout/Container';

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
    color: '#333',
    textAlign: 'center',
  },
  titleHorizontal: {
      marginTop: 0,
      marginHorizontal: 10
  }
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
  const containerStyle = useMemo(() => {
    return {
      width: width || height,
      height: height || width,
      borderRadius: radius || width ? width / 2 : height ? height / 2 : 0,
      backgroundColor: bgrColor,
    };
  }, [width, height, radius, bgrColor]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, wrapperStyle]}>
      <Container row={row} style={contentContainerStyle}>
        <View style={[styles.container, containerStyle, style]}>
          {children}
        </View>
        {!!title && <Text style={[styles.title, row && styles.titleHorizontal, titleStyle]}>{title}</Text>}
      </Container>
    </TouchableOpacity>
  );
}

export default React.memo(RoundButton);
