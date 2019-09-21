import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import MyVoucherItem from './MyVoucherItem';

const defaultListener = () => {};

class MyVoucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onRefresh: defaultListener,
    refreshing: false
  };

  renderMyVouchers() {
    return (
      <FlatList
        data={[{}, {}, {}, {}, {}]}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderMyVoucher}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }

  renderMyVoucher = ({ item, index }) => {
    return (
      <MyVoucherItem
        title="[Phở ông Hùng] Giảm 10% tổng hóa đơn"
        remaining="2"
        avatar="https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/31895380_186603668820258_510303184904781824_n.jpg?_nc_cat=103&_nc_oc=AQkZyIKqNm6_uksfCxdGfcgaxtCUSSvyLl7PuD_nnjp14rSZff_TP4AAkJQxjwxpD-U&_nc_ht=scontent.fhan2-1.fna&oh=369fbee953486122a190d9f72a45134e&oe=5DF246CC"
        last={4 === index}
        onPress={this.props.onPressVoucher}
      />
    );
  };

  render() {
    return <View style={styles.container}>{this.renderMyVouchers()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  }
});

export default MyVoucher;
