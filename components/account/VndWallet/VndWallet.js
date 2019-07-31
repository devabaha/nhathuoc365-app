/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../../../store/Store';

//component
import Withdraw from './Withdraw';
import History from './History';
import Recharge from './Recharge';
import Info from './Info';

@observer
export default class VndWallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historiesData: null,
      wallet: props.wallet,
      activeTab: 0,
      loading: [true, false, false, false]
    }
  }

  componentWillMount() {
    this._getWallet();
  }

  async _getWallet() {
    // user_coins_wallet
    try {
      var response = await APIHandler.user_wallet_history(this.state.wallet.zone_code);
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({ historiesData: response.data.histories })
      }
    } catch (e) {
      console.warn(e);
    }
  }


  _goScanQRCode() {
    Actions.qr_bar_code({ title: "Địa chỉ ví", index: 1, from: "vndwallet", wallet: this.state.wallet, address: this.state.wallet.address });
  }

  _goQRCode() {
    Actions.qr_bar_code({ title: "Địa chỉ ví", wallet: this.state.wallet, address: this.state.wallet.address  + "|" + this.state.wallet.zone_code});
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this.changeActiveTab(pageNum);
  }

  changeActiveTab = (activeTab) => {
    if (this.flatlist) {
      this.flatlist.scrollToIndex({ index: activeTab, animated: true });
    }
    if (activeTab !== this.state.activeTab) {
      let state = this.state;
      state.loading[activeTab] = true;
      state.activeTab = activeTab;
      this.setState({ ...state })
    }
  }

  renderRow({ item, index }) {
    return (
      <View>
        <View style={styles.containerRowView}>
          <Icon style={{ flex: 1, marginLeft: 20 }}
            name={item.change >= 0 ? "plus-square" : "minus-square"}
            size={25}
            color="rgb(0,0,0)" />
          <View style={{ flex: 6, flexDirection: 'column' }}>
            <Text style={{ fontSize: 16 }}>{item.content}</Text>
            <View style={styles.bottomRowView}>
              <Text style={styles.dateText}>{item.created}</Text>
              <Text style={styles.pointText}>{item.change}</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineRowView} />
      </View>
    )
  }

  renderTopLabelCoin() {
    var { wallet } = this.state;
    const { user_info } = store;
    return (
      <View>
        <View style={styles.add_store_actions_box}>
          <TouchableHighlight
            onPress={this._goQRCode.bind(this)}
            underlayColor="transparent"
            style={styles.add_store_action_btn}>
            <View style={styles.add_store_action_btn_box}>
              <Icon name="qrcode" size={30} color="#333333" />
              <Text style={styles.add_store_action_label}>Địa chỉ Ví</Text>
            </View>
          </TouchableHighlight>


          <TouchableHighlight
            onPress={this._goScanQRCode.bind(this)}
            underlayColor="transparent"
            style={styles.add_store_action_btn}>
            <View style={styles.add_store_action_btn_box}>
              <Icon name="minus-square-o" size={30} color="#333333" />
              <Text style={styles.add_store_action_label}>Chuyển khoản</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            // onPress={() => Actions.vnd_wallet({})}
            underlayColor="transparent"
            style={styles.add_store_action_btn}>
            <View style={[styles.add_store_action_btn_box_balance,
            { borderRightWidth: 0, }
            ]}>
              <Text style={[
                styles.add_store_action_label_balance,
                {
                  textAlign: 'left', width: '100%',
                  paddingHorizontal: 15
                }
              ]}>
                <Icon name={wallet.icon} size={16} color={wallet.color} /> Số dư
              </Text>
              <Text style={[
                styles.add_store_action_content,
                {
                  textAlign: 'right', width: '100%',
                  paddingHorizontal: 15,
                  color: wallet.color
                }
              ]}>
                {wallet.balance_view}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    var { wallet, activeTab, historiesData } = this.state;
    const data = [
      {
        key: 0,
        title: 'Lịch sử',
        component: <History historyData={historiesData} />
      },
      // {
      //   key: 1,
      //   title: 'Nạp tiền',
      //   component: <Recharge />
      // },
      // {
      //   key: 2,
      //   title: 'Rút tiền',
      //   component: <Withdraw />
      // },
      {
        key: 1,
        title: 'Thông tin',
        component: <Info content={wallet.content}/>
      },
    ]
    const tabHeader = data.map((d, i) => (
      <TouchableHighlight
        key={d.key}
        underlayColor="transparent"
        style={[
          styles.tabStyle,
          d.key === activeTab && styles.activeTab,
          ,
          { paddingVertical: 15 }
        ]}
        onPress={this.changeActiveTab.bind(this, d.key)}
      >
        <View style={[
          i !== (data.length - 1) && {
            borderRightColor: '#dddddd',
            borderRightWidth: 1,
          }
        ]}>
          <Text style={{
            textAlign: 'center',
            color: '#404040',
          }}>
            {d.title}
          </Text>
        </View>
      </TouchableHighlight>
    ))
    return (

      <View style={styles.container}>
        {this.renderTopLabelCoin()}
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#dddddd',
            borderBottomWidth: 1
          }}
        >
          {tabHeader}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={ref => this.flatlist = ref}
          data={data}
          keyExtractor={item => item.key.toString()}
          horizontal={true}
          onScrollToIndexFailed={() => { }}
          pagingEnabled
          style={{
            width: Util.size.width,
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          onMomentumScrollEnd={this._onScrollEnd.bind(this)}
          getItemLayout={(data, index) => {
            return { length: Util.size.width, offset: Util.size.width * index, index };
          }}
          renderItem={({ item, index }) => {
            return (item.component);
          }}
        />
        <View />
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
        {/* <Text style={styles.historyCoinText}>Lịch sử giao dịch:</Text> */}
        {/* <FlatList
          data={this.state.historiesData}
          renderItem={(item, index) => this.renderRow(item, index)}
        /> */}
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
    marginTop: 10,
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
  },

  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_action_btn: {
    paddingVertical: 4
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 4),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_btn_box_balance: {
    alignItems: 'center',
    width: ~~(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 14,
    color: '#404040',
    marginTop: 4
  },
  add_store_action_label_balance: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
    fontWeight: '600'
  },
  add_store_action_content: {
    fontSize: 19,
    marginTop: 5,
    color: "#51A9FF",
    fontWeight: '800'
  },
  tabStyle: {
    flex: 1,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1
  },
  activeTab: {
    borderBottomColor: DEFAULT_COLOR,
    borderBottomWidth: 4
  }
});
