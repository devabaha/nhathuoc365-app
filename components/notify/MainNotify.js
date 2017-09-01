/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import SelectionList from '../SelectionList';
import NotifyItemComponent from './NotifyItemComponent';

@observer
export default class MainNotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      navigators: [
        {
          key: 0,
          label: "Tin khuyến mãi",
          desc: "Khuyến mãi mới nhất từ các cửa hàng",
          icon: "bookmark",
          onPress: () => {
            Actions.notifys({
              title: "KHUYẾN MÃI",
              news_type: "/1"
            });
          },
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#fa7f50"
          }],
          iconColor: "#ffffff"
        },
        {
          key: 1,
          label: "Từ My Food",
          desc: "Thông báo từ My Food",
          icon: "lemon-o",
          onPress: () => {
            Actions.notifys({
              title: "TỪ MY FOOD",
              news_type: "/2"
            });
          },
          boxIconStyle: [styles.boxIconStyle],
          iconColor: "#ffffff"
        }
      ],
      loading: true,
      notice_data: null
    }
  }

  componentDidMount() {
    this._getData();
  }

  componentWillReceiveProps() {
    // this._getData();
  }

  _getData(delay) {
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_notice();

        if (response && response.status == STATUS_SUCCESS) {

          layoutAnimation();

          this.setState({
            loading: false,
            user_notice: response.data
          });

        } else {
          layoutAnimation();

          this.setState({
            loading: false
          });
        }
      } catch (e) {
        console.warn(e);
      } finally {

      }
    });
  }

  render() {

    var {user_notice, loading} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <SelectionList data={this.state.navigators} />

          <View style={styles.boxTop} />

          <View style={styles.headding_box}>
            <Text style={styles.headding_title}>Cập nhật đơn hàng</Text>
          </View>

          <View style={styles.notice_box}>
            {loading ? (
              <View style={[styles.defaultBox]}>
                <Indicator size="small" />
              </View>
            ) : user_notice != null ? (
              <FlatList
                ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                data={user_notice}
                style={[styles.profile_list_opt]}
                renderItem={({item, index}) => {
                  return(
                    <NotifyItemComponent
                      item={item} />
                  );
                }}
                keyExtractor={item => item.id}
              />
            ) : (
              <View style={styles.empty_box}>
                <Icon name="shopping-basket" size={32} color={hexToRgbA(DEFAULT_COLOR, 0.6)} />
                <Text style={styles.empty_box_title}>Chưa có đơn hàng nào</Text>

                <TouchableHighlight
                  onPress={() => {
                    Actions._home({type: ActionConst.REFRESH});
                  }}
                  underlayColor="transparent">
                  <View style={styles.empty_box_btn}>
                    <Text style={styles.empty_box_btn_title}>Mua sắm ngay</Text>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultBox: {
    width: '100%',
    height: 120,
    backgroundColor: "#ffffff",
    marginBottom: 8
  },

  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    backgroundColor: "#ffffff"
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15
  },

  boxTop: {
    width: '100%',
    height: 8,
    backgroundColor: "#f1f1f1"
  },

  headding_box: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  headding_title: {
    color: "#404040",
    fontSize: 14,
    fontWeight: '600'
  },

  notice_box: {
    width: '100%'
  },

  empty_box: {
    alignItems: 'center',
    marginTop: 32
  },
  empty_box_title: {
    fontSize: 12,
    marginTop: 8,
    color: "#404040"
  },
  empty_box_btn: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderRadius: 5,
    backgroundColor: DEFAULT_COLOR
  },
  empty_box_btn_title: {
    color: "#ffffff"
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd"
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  }
});
