import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Button from 'react-native-button';

function renderService({ item, index }) {
  return (
    <Button containerStyle={styles.buttonWrapper}>
      <View style={styles.itemWrapper}>
        <View
          style={[styles.iconWrapper, { backgroundColor: item.bgrColor }]}
        ></View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </Button>
  );
}

function ListServices(props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={props.data}
        renderItem={renderService}
        keyExtractor={item => `${item.id}`}
        numColumns={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12
  },
  buttonWrapper: {
    flex: 1
  },
  itemWrapper: {
    alignItems: 'center'
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#333'
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
    marginTop: 6
  }
});

export default ListServices;
