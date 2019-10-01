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
import Communications from 'react-native-communications';

//component
import History from './History';
import Info from './Info';

@observer
export default class Affiliate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historiesData: null,
      content: props.aff_content
        ? props.aff_content
        : 'Nhập mã giới thiệu để nhận được phần thưởng hấp dẫn từ ' +
          APP_NAME_SHOW,
      activeTab: 0,
      loading: [true, false, false, false]
    };
  }

  componentWillMount() {
    this._getInviteList();
  }

  async _getInviteList() {
    try {
      var response = await APIHandler.user_invite_history();
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({ historiesData: response.data.histories });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // _sms

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this.changeActiveTab(pageNum);
  }

  changeActiveTab = activeTab => {
    if (this.flatlist) {
      this.flatlist.scrollToIndex({ index: activeTab, animated: true });
    }
    if (activeTab !== this.state.activeTab) {
      let state = this.state;
      state.loading[activeTab] = true;
      state.activeTab = activeTab;
      this.setState({ ...state });
    }
  };

  renderTopLabelCoin() {
    const { user_info } = store;
    return (
      <View>
        <View style={styles.add_store_actions_box}>
          <TouchableHighlight
            onPress={() => Communications.text(null, user_info.text_sms)}
            underlayColor="transparent"
            style={styles.add_store_action_btn}
          >
            <View style={styles.add_store_action_btn_box}>
              <Icon name="commenting" size={22} color="#333333" />
              <Text style={styles.add_store_action_label}>Gửi tin nhắn</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() =>
              Communications.email(
                null,
                null,
                null,
                'Lời mời tham gia chương trình TickID Affiliate',
                user_info.text_sms
              )
            }
            underlayColor="transparent"
            style={styles.add_store_action_btn}
          >
            <View style={styles.add_store_action_btn_box}>
              <Icon name="envelope-o" size={22} color="#333333" />
              <Text style={styles.add_store_action_label}>Gửi Email</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor="transparent"
            style={styles.add_store_action_btn}
          >
            <View
              style={[
                styles.add_store_action_btn_box_balance,
                { borderRightWidth: 0 }
              ]}
            >
              <Text
                style={[
                  styles.add_store_action_label_balance,
                  {
                    textAlign: 'left',
                    width: '100%',
                    paddingHorizontal: 15
                  }
                ]}
              >
                <Icon name="slideshare" size={16} /> Mã giới thiệu
              </Text>
              <Text
                style={[
                  styles.add_store_action_content,
                  {
                    textAlign: 'right',
                    width: '100%',
                    paddingHorizontal: 15
                  }
                ]}
              >
                {user_info.username}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    var { activeTab, content, historiesData } = this.state;
    const data = [
      {
        key: 0,
        title: 'Danh sách giới thiệu',
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
        title: 'Thông tin chương trình',
        component: <Info content={content} />
      }
    ];
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
        <View
          style={[
            i !== data.length - 1 && {
              borderRightColor: '#dddddd',
              borderRightWidth: 1
            }
          ]}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#404040'
            }}
          >
            {d.title}
          </Text>
        </View>
      </TouchableHighlight>
    ));
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
          ref={ref => (this.flatlist = ref)}
          data={data}
          keyExtractor={item => item.key.toString()}
          horizontal={true}
          onScrollToIndexFailed={() => {}}
          pagingEnabled
          style={{
            width: Util.size.width
          }}
          contentContainerStyle={{
            flexGrow: 1
          }}
          onMomentumScrollEnd={this._onScrollEnd.bind(this)}
          getItemLayout={(data, index) => {
            return {
              length: Util.size.width,
              offset: Util.size.width * index,
              index
            };
          }}
          renderItem={({ item, index }) => {
            return item.component;
          }}
        />
        <View />
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
    color: '#51A9FF',
    fontWeight: '800'
  },
  tabStyle: {
    flex: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1
  },
  activeTab: {
    borderBottomColor: DEFAULT_COLOR,
    borderBottomWidth: 4
  }
});
