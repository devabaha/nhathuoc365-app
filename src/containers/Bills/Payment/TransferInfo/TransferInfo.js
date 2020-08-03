import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Clipboard,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import Button from '../../../../components/Button';

class TransferInfo extends Component {
  state = {
    loading: true,
    info: {}
  };

  copyAccountNumber = value => {
    Clipboard.setString(value);
    Toast.show('Đã sao chép số TK vào bộ nhớ tạm');
  };

  handleConfirm = () => {
    Actions.replace(appConfig.routes.room, {
      room_id: this.props.room_id,
      site_id: this.props.site_id
    });
  };

  render() {
    const info = this.props.info || {};
    const amount = this.props.info
      ? vndCurrencyFormat(+(info.amount || 0))
      : '';
    const account_no = info ? (
      <Text>
        {info.account_no} <Icon name="copy" size={16} />
      </Text>
    ) : (
      ''
    );
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{this.props.heading}</Text>
          <RowItem label="Tên ngân hàng" value={info.bank_name} />
          <RowItem
            label="Số tài khoản"
            value={account_no}
            onPress={() => this.copyAccountNumber(info.account_no)}
          />
          <RowItem label="Tên tài khoản" value={info.account_name} />
          <RowItem label="Số tiền" value={amount} rightValue highlight />
          <Text style={styles.note}>{this.props.note}</Text>
        </ScrollView>

        <Button title="Quay về" onPress={this.handleConfirm} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    color: '#333',
    paddingVertical: 15,
    paddingHorizontal: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.2
  },
  note: {
    color: '#444',
    lineHeight: 20,
    paddingVertical: 15,
    paddingHorizontal: 15
  },

  /** RowItem */
  rowContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff'
  },
  label: {
    color: '#666',
    fontWeight: '500',
    marginRight: 15,
    flex: 0.4
  },
  value: {
    flex: 0.6,
    color: '#333',
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 16
  },
  right: {
    textAlign: 'right'
  },
  highlight: {
    color: appConfig.colors.primary,
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default withTranslation()(TransferInfo);

const RowItem = ({
  label,
  value,
  highlight = false,
  rightValue = false,
  onPress = null
}) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.label}>{label}</Text>

      <Text
        onPress={onPress}
        style={[
          styles.value,
          rightValue && styles.right,
          highlight && styles.highlight
        ]}
      >
        {value}
      </Text>
    </View>
  );
};
