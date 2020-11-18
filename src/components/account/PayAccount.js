/* @flow */

import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import EventTracker from '../../helper/EventTracker';

import store from '../../store/Store';

@observer
export default class PayAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historiesData: null,
      wallet: props.wallet,
      account: props.account,
      app: props.app,
      barcode: props.barcode,
      loading: false,
      amount: props.amount ? props.amount : 0
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  componentWillMount() {}

  renderTopLabelCoin() {
    var { wallet, account, barcode } = this.state;
    const { user_info } = store;
    return (
      <View>
        <View style={styles.add_store_actions_box}>
          <TouchableHighlight
            // onPress={this._goScanQRCode.bind(this)}
            underlayColor="transparent"
            style={styles.add_store_action_btn}
          >
            <View style={styles.add_store_action_btn_box_balance}>
              <Text style={styles.add_store_action_label_balance}>
                <Ionicons name="account" size={15} color="#333333" />{' '}
                {account.name}
              </Text>
              <Text style={styles.add_store_action_label_balance}>
                {account.username}
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            // onPress={() => Actions.vnd_wallet({})}
            underlayColor="transparent"
            style={styles.add_store_action_btn}
          >
            <View
              style={[
                styles.add_store_action_btn_box_balance,
                { borderRightWidth: 0 }
              ]}
            >
              <Text style={styles.add_store_action_label_balance}>
                {wallet.name}
              </Text>
              <Text style={styles.add_store_action_content}>
                {wallet.balance_view}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    var { wallet, account, app, barcode, loading } = this.state;
    return (
      <View
        style={[
          styles.container,
          {
            marginBottom: store.keyboardTop
          }
        ]}
      >
        <Text style={styles.historyCoinText}>
          <Icon name="bank" size={15} color="#333333" /> Mã tài khoản {barcode}
        </Text>
        {this.renderTopLabelCoin()}
        <Text style={styles.historyCoinTextAddress}></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    backgroundColor: '#ffffff'
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 32,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 20,
    borderTopWidth: 0,
    borderColor: '#dddddd'
  },
  point_icon: {
    width: 60,
    height: 60
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
    color: '#000000',
    fontWeight: '400'
  },
  profile_list_small_label: {
    fontSize: 14,
    color: '#666666',
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
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(0,0,0)'
  },
  historyCoinTextAddress: {
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
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
    color: 'rgb(150,150,150)'
  },
  pointText: {
    fontSize: 16,
    color: 'rgb(0,0,0)',
    fontWeight: 'bold',
    marginRight: 15
  },

  profile_cover_box: {
    width: '100%',
    backgroundColor: '#ccc',
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
    backgroundColor: '#cccccc',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profile_avatar: {
    width: 76,
    height: 76,
    borderRadius: 38
    // resizeMode: 'cover'
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd'
  },

  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
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
    fontSize: 12,
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
    fontSize: 18,
    marginTop: 5,
    color: '#51A9FF',
    fontWeight: '800'
  },

  invite_text_input: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    // marginTop: 30,
    marginTop: 20
  },

  invite_text_input_sub: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    marginLeft: 20,
    marginRight: 20
  },
  boxButtonActions: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: '#666666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  }
});
