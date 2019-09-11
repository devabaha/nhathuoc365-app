import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight
} from 'react-native';
import VoucherItem from './VoucherItem';

function ListVouchers(props) {
  function renderVoucherItem({ item, index }) {
    return (
      <VoucherItem
        title={item.title}
        imageUrl={item.image_url}
        onPress={props.onVoucherPressed}
        last={props.data.length - 1 === index}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>

        <TouchableHighlight
          style={styles.showAllBtn}
          underlayColor="transparent"
          onPress={props.onShowAll}
        >
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableHighlight>
      </View>

      <FlatList
        horizontal
        data={props.data}
        showsHorizontalScrollIndicator={false}
        renderItem={renderVoucherItem}
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

const defaultListener = () => {};

ListVouchers.propTypes = {
  data: PropTypes.array,
  onVoucherPressed: PropTypes.func,
  onShowAll: PropTypes.func
};

ListVouchers.defaultProps = {
  data: [],
  onVoucherPressed: defaultListener,
  onShowAll: defaultListener
};

export default ListVouchers;
