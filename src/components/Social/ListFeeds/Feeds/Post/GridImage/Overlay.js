import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.35)',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

const Overlay = ({title}) => {
  return (
    <Container center style={styles.container}>
      {!!title && <Text style={styles.title}>+{title}</Text>}
    </Container>
  );
};

export default React.memo(Overlay);
