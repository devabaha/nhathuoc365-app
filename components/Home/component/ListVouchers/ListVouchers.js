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
        item={item}
        onPress={props.onVoucherPressed}
        last={props.data.length - 1 === index}
      />
    );
  }

  return (
    <Fragment>
      <View style={styles.content}>
        <Text style={styles.addStoreTitle}>{props.title}</Text>

        <View style={styles.rightTitleBtnBox}>
          <TouchableHighlight
            style={styles.rightTitleBtn}
            underlayColor="transparent"
            onPress={props.onShowAll}
          >
            <Text style={[styles.addStoreTitle, { color: '#042C5C' }]}>
              Xem tất cả
            </Text>
          </TouchableHighlight>
        </View>
      </View>

      <FlatList
        horizontal
        data={props.data}
        showsHorizontalScrollIndicator={false}
        renderItem={renderVoucherItem}
        keyExtractor={item => `${item.id}`}
      />
    </Fragment>
  );
}

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

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row'
  },
  addStoreTitle: {
    color: '#042C5C',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20
  },
  rightTitleBtnBox: {
    flex: 1,
    alignItems: 'flex-end'
  }
});

export default ListVouchers;
