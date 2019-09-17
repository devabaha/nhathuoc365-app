/* @flow */

import React, { Component } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';

class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  onChangeMoney = value => this.setState({ value });

  sendRequest = () => {};

  cancelRequest = () => {};

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          width: Util.size.width
        }}
        keyboardShouldPersistTaps="always"
        // refreshControl={
        //     <RefreshControl
        //         refreshing={loadingHistory || loadingHistoryWithdraw}
        //         onRefresh={this._getData.bind(this)}
        //     />
        // }
      >
        <View style={[styles.row]}>
          <Text
            style={[
              styles.text,
              {
                flex: 0.4,
                textAlign: 'left',
                textAlignVertical: 'center'
              }
            ]}
          >
            Số tiền cần rút
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={{
              flex: 0.6,
              height: 42,
              borderColor: '#dddddd',
              borderWidth: 1,
              paddingHorizontal: 8,
              borderRadius: 2,
              color: '#404040',
              fontSize: 18,
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: '#ffffff'
            }}
            keyboardType={isIOS ? 'number-pad' : 'numeric'}
            onChangeText={this.onChangeMoney.bind(this)}
            value={this.state.value}
          />
        </View>
        <TouchableHighlight
          underlayColor="transparent"
          style={styles.btn_container}
          onPress={this.sendRequest.bind(this)}
        >
          <View style={[styles.empty_box_btn]}>
            <Text style={styles.empty_box_btn_title}>Gửi yêu cầu</Text>
          </View>
        </TouchableHighlight>
        <View style={[styles.bank_info]}>
          <View style={[styles.bank_info_row]}>
            <Text style={[styles.text]}>Tài khoản nhận tiền:</Text>
          </View>
          <View style={[styles.bank_info_row]}>
            <Text style={[styles.text]}>Ngân hàng:</Text>
            <Text style={[styles.text]}>VCB</Text>
          </View>
          <View style={[styles.bank_info_row]}>
            <Text style={[styles.text]}>Chi nhánh:</Text>
            <Text style={[styles.text]}>Hoàn Kiếm</Text>
          </View>
          <View style={[styles.bank_info_row]}>
            <Text style={[styles.text]}>Số tài khoản:</Text>
            <Text style={[styles.text]}>0011004056527</Text>
          </View>
          <View style={[styles.bank_info_row]}>
            <Text style={[styles.text]}>Chủ TK:</Text>
            <Text style={[styles.text]}>Le Huy Thuc</Text>
          </View>
        </View>

        <View style={[styles.withdraw_history]}>
          <View style={[styles.row, { alignItems: 'center' }]}>
            <Icon name="list-ul" size={20} color="#333333" />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#404040',
                paddingBottom: 1,
                marginLeft: 5
              }}
            >
              <Text style={[styles.title]}>Lịch sử rút tiền</Text>
            </View>
          </View>
        </View>

        <Record status={1} />
        <Record status={0} cancelRequest={this.cancelRequest.bind(this)} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#404040'
  },
  btn_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15
  },
  empty_box_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: DEFAULT_COLOR
  },
  empty_box_btn_title: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center'
  },
  bank_info: {
    paddingVertical: 15
  },
  bank_info_row: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: '#404040',
    marginRight: 5,
    marginBottom: 5
  }
});

export default Withdraw;

const Record = props => {
  const cancelBtn = props.status === 1 && (
    <TouchableHighlight
      underlayColor="transparent"
      style={[
        {
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginRight: 15
        }
      ]}
      onPress={props.cancelRequest}
    >
      <View style={[styles.empty_box_btn]}>
        <Text style={styles.empty_box_btn_title}>Hủy</Text>
      </View>
    </TouchableHighlight>
  );
  const status =
    props.status === 1 ? (
      <Text style={[styles.text, { color: '#edb008' }]}>Chờ xác nhận</Text>
    ) : (
      <Text style={[styles.text, { color: 'green' }]}>Đã hoàn thành</Text>
    );

  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-between',
          flex: 1,
          marginTop: 15,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#404040'
        }
      ]}
    >
      <View
        style={{
          flex: 1,
          paddingRight: 15
        }}
      >
        <Text style={[styles.title]}>Rút 100.000đ</Text>
        <Text style={[styles.text]}>VCB - 00990099000999</Text>
        {cancelBtn}
      </View>
      <View
        style={{
          justifyContent: 'flex-start'
        }}
      >
        <Text style={[styles.text, { fontSize: 14 }]}>01/01/2020 10:10:10</Text>
        {status}
      </View>
    </View>
  );
};
