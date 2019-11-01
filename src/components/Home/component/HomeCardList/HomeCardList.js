import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function HomeCardList(props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>

        {props.onShowAll ? (
          <Button
            containerStyle={styles.showAllBtn}
            underlayColor="transparent"
            onPress={props.onShowAll}
          >
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </Button>
        ) : (
          <View style={[styles.showAllBtn, styles.showAllBtnEmpty]} />
        )}
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
    marginTop: 8
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  showAllBtn: {
    paddingTop: 12,
    paddingBottom: 6
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 6
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
  onShowAll: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  children: PropTypes.func.isRequired
};

HomeCardList.defaultProps = {
  data: [],
  onShowAll: defaultListener,
  children: defaultListener
};

export default HomeCardList;
