/* @flow */

import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  FlatList
} from 'react-native';

// library
import store from '../../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import NdtHistory from './NdtHistory';


export default class SyncNdt extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNum: 0,
      stores_data: store.stores_data,
      user: store.user_info,
      activeTab: 0,
      loading: [true, false]
    }
  }

  componentDidMount() {
    // GoogleAnalytic('ndt');
  }

  _onFinish() {
    Actions.myTabBar({
      type: ActionConst.RESET
    });
  }

  // thực hiện add cửa hàng vào account của user

  async _add_ref() {
    if (this.state.searchValue != undefined) {
      var response = await APIHandler.user_sync_ndt(this.state.searchValue);
      if (response) {
        if (response.status == STATUS_SUCCESS) {
          this._onFinish();
        } else {
          Toast.show(response.message);
        }
      } else {
        Toast.show("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this.changeActiveTab(pageNum);
  }

  _onChangeSearch(text) {
    this.setState({
      searchValue: text
    });
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

  onLoaded = (index) => {
    let state = this.state;
    state.loading[index] = false;
    this.setState({ ...state });
  }

  render() {
    let { ndt } = this.props;
    let { activeTab, loading } = this.state;
    let data = [
      {
        id: "0",
        title: "Ví Tiền mặt"
      },
      {
        id: "1",
        title: "Ví Sản phẩm"
      }
    ]
    return (
      <View style={[styles.container, isIOS && {paddingTop: 15}]}>
        <View style={{
          marginTop: 60,
          borderTopWidth: 0,
          borderColor: "#dddddd"
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 15
          }}>
            <Icon name="user" size={18} />
            <Text style={{
              fontWeight: 'bold',
              color: "#404040",
              fontSize: 18,
              marginLeft: 15
            }}>
              {ndt.mcc_investor_username}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#dddddd',

        }}>
          <View style={[
            {
              width: '50%',
              paddingVertical: 15
            },
            activeTab === 0 && {
              borderBottomWidth: 4,
              borderBottomColor: DEFAULT_COLOR
            }
          ]}>
            <TouchableHighlight
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderRightColor: '#dddddd',
              }}
              underlayColor="transparent"
              onPress={this.changeActiveTab.bind(this, 0)}
            >
              <Fragment>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="credit-card" size={20} style={{color: 'red'}}/>
                  <Text style={{
                    fontWeight: 'bold',
                    color: "#404040",
                    fontSize: 16,
                    marginLeft: 5
                  }}>Tiền mặt</Text>
                </View>
                <Text style={{
                  fontWeight: 'bold',
                  color: "#404040",
                  fontSize: 16,
                  marginLeft: 5
                }}>
                  {ndt.mcc_investor_lending_balance}
                </Text>
              </Fragment>
            </TouchableHighlight>
          </View>

          <View style={[
            { width: '50%', paddingVertical: 15 },
            activeTab === 1 && {
              borderBottomWidth: 4,
              borderBottomColor: DEFAULT_COLOR
            }
          ]}>
            <TouchableHighlight
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
              underlayColor="transparent"
              onPress={this.changeActiveTab.bind(this, 1)}
            >
              <Fragment>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="credit-card" size={20}  style={{color: '#cc9900'}}/>
                  <Text style={{
                    fontWeight: 'bold',
                    color: "#404040",
                    fontSize: 16,
                    marginLeft: 5
                  }}>Sản phẩm</Text>
                </View>
                <Text style={{
                  fontWeight: 'bold',
                  color: "#404040",
                  fontSize: 16,
                  marginLeft: 5
                }}>
                  {ndt.mcc_investor_product_balance}
                </Text>
              </Fragment>
            </TouchableHighlight>
          </View>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={ref => this.flatlist = ref}
          data={data}
          keyExtractor={item => item.id}
          horizontal={true}
          onScrollToIndexFailed={() => {}}
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
            return (
              <NdtHistory
                ndt={ndt}
                title={item.title}
                type={item.id}
                loading={loading[item.id]}
                onLoaded={this.onLoaded.bind(this, item.id)}
              />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: "#ffffff",
    paddingBottom: 15
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  store_result_item_image_box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  store_result_item_image: {
    width: 240,
    height: 150,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  invite_text_input: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },

  invite_text_input_sub: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  boxButtonActions: {
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center'
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
    width: ~~(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
  },
  add_store_action_wallet_text: {
    fontSize: 15,
    color: '#404040',
    marginLeft: 3
  },
  add_store_action_wallet_content: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '700'
  },
  add_store_action_wallet: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // paddingVertical: 8,
    paddingHorizontal: 8,
    // marginRight: 8
  },
  ndt_history: {
    marginTop: 10
  },

  ndt_history_sub: {
    marginLeft: 20,
    marginRight: 20
  },

  profile_button_box: {
    position: 'absolute',
    bottom: 42,
    right: 0,
    flexDirection: 'row'
  },
  profile_button_login_box: {
    backgroundColor: "#4267b2",
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3,
    marginRight: 15
  },
  profile_button_title: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 4
  },
  profile_list_opt: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  profile_list_label: {
    fontSize: 18,
    color: "#000000",
    fontWeight: '400'
  },
  profile_list_label_balance: {
    fontSize: 16,
    color: DEFAULT_COLOR,
    fontWeight: '600'
  },

  profile_list_label_point: {
    fontSize: 16,
    color: "#e31b23",
    fontWeight: '600'
  },
  profile_list_label_invite_id: {
    fontSize: 16,
    color: "#51A9FF",
    fontWeight: '600'
  },
  profile_list_small_label: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2
  },
});
