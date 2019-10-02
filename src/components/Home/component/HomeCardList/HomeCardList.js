import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function HomeCardList(props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>

        <Button
          containerStyle={styles.showAllBtn}
          underlayColor="transparent"
          onPress={props.onShowAll}
        >
          {props.onShowAll && <Text style={styles.viewAll}>Xem tất cả</Text>}
        </Button>
      </View>

      <FlatList
        horizontal
        data={props.data}
        showsHorizontalScrollIndicator={false}
        renderItem={props.children}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingBottom: 16
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  showAllBtn: {
    paddingTop: 12,
    paddingBottom: 6
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20
  },
  viewAll: {
    color: '#0084ff',
    fontSize: 15,
    fontWeight: '500'
  }
});

const defaultListener = () => null;

HomeCardList.propTypes = {
  data: PropTypes.array,
  onShowAll: PropTypes.func,
  children: PropTypes.func.isRequired
};

HomeCardList.defaultProps = {
  data: [],
  onShowAll: defaultListener,
  children: defaultListener
};

export default HomeCardList;
