import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Container} from 'src/components/Layout';
import {themes} from '../../themes';

const styles = StyleSheet.create({
  title: {
    color: themes.colors.secondary,
  },
  highlight: {
    color: themes.colors.primary,
  },
});

const Timer = ({
  total,
  current,
  containerStyle = {},
  titleStyle = {},
  highlightStyle = {},
}) => {
  return (
    <Container row style={containerStyle}>
      <Text style={[styles.title, titleStyle]}>
        <Text style={[styles.highlight, highlightStyle]}>{current}</Text>
        {!!total && ` / ${total}`}
      </Text>
    </Container>
  );
};

export default React.memo(Timer);
