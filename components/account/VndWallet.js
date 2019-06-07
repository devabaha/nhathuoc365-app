/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Alert
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { reaction } from 'mobx';
import store from '../../store/Store';

@observer
export default class VndWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historiesData: null,
    }
  }

  componentWillMount() {
    this._getWallet();
  }

  async _getWallet() {
    // user_coins_wallet
    try {
      var response = await APIHandler.user_vnd_wallet();
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({ historiesData: response.data.histories})
      }
    } catch (e) {
      console.warn(e);
    }
  }

  async onPressNew() {
    var response = await APIHandler.user_news(208);
    if (response && response.status == STATUS_SUCCESS) {
      Actions.notify_item({
        title: 'Giới thiệu tài khoản Cashback 4.0',
        data: response.data
      });
    }
  }

  renderRow({ item, index }) {
    return (
      <View>
        <View style={styles.containerRowView}>
          <Icon style={{ flex: 1, marginLeft: 20}} 
                name={item.change >= 0 ? "plus-square" : "minus-square"}
                size={25} 
                color="rgb(0,0,0)" />
          <View style={{ flex: 6, flexDirection: 'column' }}>
            <Text style={{ fontSize: 16}}>{item.content}</Text>
            <View style={styles.bottomRowView}>
              <Text style={styles.dateText}>{item.created}</Text>
              <Text style={styles.pointText}>{item.change}</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineRowView}/>
      </View>
    )
  }

  renderTopLabelCoin() {
    const {user_info} = store;
    return (
        <View>
          <View style={styles.profile_list_opt_btn}>
            <View style={styles.labelCoinParentView}>
              <View style={styles.labelCoinView}>
                <Text style={styles.profile_list_label}>Số dư:</Text>
                <Text style={{
                  color: "#ffffff",
                  width: 150,
                  fontSize: 16,
                  paddingHorizontal: 15,
                  paddingVertical: 3,
                  backgroundColor: "#000000",
                  borderWidth: 2,
                  borderColor: "#ffffff",
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>{user_info.vnd}</Text>
              </View>
            </View>
          </View>
        </View>
    );
  }

  render() {
    return (
      
      <View style={styles.container}>
        {this.renderTopLabelCoin()}
        <View style={styles.lineView} />
        <TouchableWithoutFeedback
          onPress={() => this.onPressNew()}>
          <View style={styles.newsCoinView}>
            <Icon style={{ flex: 1, marginLeft: 20}} name="newspaper-o" size={25} color="#4267b2" />
            <Text style={{ flex: 7, fontSize: 16 }}>Giới thiệu về tài khoản Cashback 4.0</Text>
            <Icon style={{ flex: 1, marginLeft: 10}} name="chevron-right" size={20} color="rgb(200,200,200)" />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.lineView} />
        {/* <View>
          <Text>Nạp qua Ví Momo</Text>
          <Text>Số tài khoản nhận: 0988888888</Text>
          <Text>Nội dung: 0983982021</Text>
          <Text>Lưu ý: Chỉ nhập mã, không nhập thêm gì khác vào nội dung</Text>
          <Text>Thời gian xác nhận nạp tiền thành công: 5 phút</Text>
        </View>
        <View style={styles.lineView} />
        <View>
          <Text>Rút tiền qua Ví Momo</Text>
          <Text>Số điện thoại nhận: 0988888888</Text>
          <Text>Mã thanh toán: 0983982021</Text>
          <Text>Rút</Text>
          <Text>Thời gian xác nhận và rút tiền thành công: 5 phút</Text>
        </View>
        <View style={styles.lineView} /> */}
        <Text style={styles.historyCoinText}>Lịch sử giao dịch:</Text>
        <FlatList
          data={this.state.historiesData}
          renderItem={(item, index) => this.renderRow(item, index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    backgroundColor: "#ffffff",
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 32,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 20,
    borderTopWidth: 0,
    borderColor: "#dddddd"
  },
  point_icon: {
    width: 60,
    height: 60,
  },
  iconView: {
    alignItems: 'center',
    flex: 1
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70
  },
  profile_list_label: {
    fontSize: 18,
    color: "#000000",
    fontWeight: '400'
  },
  profile_list_small_label: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2
  },
  labelCoinParentView: {
    flex: 5,
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10
  },
  labelCoinView: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lineView: {
    marginTop: 10,
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 10,
    height: 1,
    backgroundColor: '#dddddd'
  },
  lineViewWallet: {
    marginTop: 1,
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 1,
    height: 1,
    backgroundColor: '#dddddd'
  },
  lineRowView: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    height: 1,
    backgroundColor: '#dddddd'
  },
  newsCoinView: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center'
  },
  historyCoinText: {
    marginLeft: 20,
    marginBottom: 20,
    fontSize: 18,
    color: 'rgb(0,0,0)'
  },
  containerRowView: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomRowView: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateText: {
    fontSize: 12,
    color: 'rgb(150,150,150)',
  },
  pointText: {
    fontSize: 16,
    color: 'rgb(0,0,0)',
    fontWeight: 'bold',
    marginRight: 15
  },

  profile_cover_box: {
    width: '100%',
    backgroundColor: "#ccc",
    height: 120
  },
  profile_cover: {
    width: '100%',
    height: '100%'
  },
  profile_avatar_box: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 70,
    height: 70,
    backgroundColor: "#cccccc",
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profile_avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    // resizeMode: 'cover'
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  }
});
