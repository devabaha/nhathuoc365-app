import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Container} from 'src/components/Layout';
import {themes} from '../../themes';

const styles = StyleSheet.create({
  title: {
    color: themes.colors.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  highlight: {
    color: themes.colors.primary,
  },
});

const Timer = ({
  current,
  total = '',
  containerStyle = {},
  titleStyle = {},
  highlightStyle = {},
  onLayout = () => {}
}) => {
  return (
    <Container onLayout={onLayout} row reanimated style={containerStyle}>
      <Text style={[styles.title, titleStyle]}>
        <Text style={[styles.highlight, highlightStyle]}>{current}</Text>
        {!!total && ` / ${total}`}
      </Text>
    </Container>
  );
};

export default React.memo(Timer);
