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
export default class CoinWallet extends Component {
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
      var response = await APIHandler.user_coins_wallet();
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({ historiesData: response.data.histories})
      }
    } catch (e) {
      console.warn(e);
    }
  }

  async onPressNew() {
    var response = await APIHandler.user_news(173);
    if (response && response.status == STATUS_SUCCESS) {
      Actions.notify_item({
        title: 'Giới thiệu ví XU',
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
            <Text>{item.content}</Text>
            <View style={styles.bottomRowView}>
              <Text style={styles.dateText}>{item.created}</Text>
              <Text style={styles.pointText}>{item.change >= 0 ? "+" : "-"}{item.change}</Text>
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
      <View style={styles.profile_list_opt_btn}>
          <View style={styles.iconView}>
            <View style={styles.profile_list_icon_box}>
              <Icon name="product-hunt" size={20} color="#ffffff" />
            </View>
          </View>
          <View style={styles.labelCoinParentView}>
            <View style={styles.labelCoinView}>
              <Text style={styles.profile_list_label}>Số dư ví XU:</Text>
              <Text style={styles.profile_list_label_point}>{user_info.point}</Text>
            </View>
            <View style={styles.lineViewWallet} />
            <View style={styles.labelCoinView}>
              <Text style={styles.profile_list_small_label}>Số Xu tạm giữ</Text>
              <Text style={styles.profile_list_label_point}>{user_info.point_expire}</Text>
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
            <Text style={{ flex: 7, fontSize: 16 }}>Giới thiệu về ví XU</Text>
            <Icon style={{ flex: 1, marginLeft: 10}} name="chevron-right" size={20} color="rgb(200,200,200)" />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.lineView} />
        <Text style={styles.historyCoinText}>Lịch sử xu</Text>
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
    height: 52,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 20,
    borderTopWidth: 0,
    borderColor: "#dddddd"
  },
  iconView: {
    alignItems: 'center',
    flex: 1
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: "#4267b2"
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomRowView: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateText: {
    fontSize: 16,
    color: 'rgb(150,150,150)',
  },
  pointText: {
    fontSize: 16,
    color: 'rgb(0,0,0)',
    fontWeight: 'bold',
    marginRight: 15
  }
});
