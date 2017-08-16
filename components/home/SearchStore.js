/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  FlatList
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class SearchStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggest_data: [
        "O'Green Liễu Giai",
        "O'Green Đội Cấn",
        "O'Green Nguyễn Trãi",
        "O'Green Cầu Giấy",
        "O'Green Nhổn",
        "O'Green Nguyễn Văn Cừ",
        "O'Green Chợ Long Biên",
        "O'Green Mỹ Đình",
      ],
      data: [
        {id: 1, image: 'http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg'}
      ],
      refreshing: false
    }
  }

  componentWillMount() {
    Actions.refresh({
      showSearchBar: true,
      placeholder: "Nhập mã cửa hàng",
      // autoFocus: true
    });
  }


  componentDidMount() {
      for(let i = 0; i <= 10; i++) {
        let code = 'BTNKT' + i;
        this._add_site(code);
      }
  }

  async _add_site(site_code) {
    try {
      var response = await APIHandler.user_add_site(site_code);

      if (response && response.status == STATUS_SUCCESS) {
        console.warn(JSON.stringify(response));
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }



  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.suggest_box}>
            <View style={styles.suggest_heading_box}>
              <View style={styles.star_box}>
                <Icon name="star" size={12} color="#ffffff" />
              </View>
              <Text style={styles.star_label}>Cửa hàng nổi bật</Text>
            </View>


            <View style={styles.store_item_box}>
            {
              this.state.suggest_data.map((item, key) => (
                <TouchableHighlight
                  key={key}
                  style={[styles.store_item]}
                  underlayColor="transparent"
                  onPress={() => {

                  }}>
                  <Text style={styles.store_item_title}>{item}</Text>
                </TouchableHighlight>
              ))
            }
            </View>
          </View>

          {this.state.data != null && <FlatList
            style={styles.stores_result_box}
            data={this.state.data}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            renderItem={({item, index}) => {

              return(
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    Actions.stores({});
                  }}>

                  <View style={[styles.store_result_item, index < 3 ? styles.store_result_item_active : null]}>
                    <View style={styles.store_result_item_image_box}>
                      <Image style={styles.store_result_item_image} source={{uri: item.image}} />
                    </View>

                    <View style={styles.store_result_item_content}>
                      <View style={styles.store_result_item_content_box}>
                        <Text style={styles.store_result_item_title}>Thực phẩm sạch O{"'"}Sreen</Text>
                        <Text style={styles.store_result_item_desc}>Số 1 Lương Yên, Long Biên, Hà Nội</Text>

                        <View style={styles.store_result_item_add_box}>
                          <TouchableHighlight
                            style={styles.store_result_item_add_btn}
                            underlayColor="transparent"
                            onPress={() => {
                              Actions.pop();
                            }}>
                            <View style={styles.add_btn_icon_box}>
                              <Text style={styles.add_btn_icon}>+</Text>
                              <Text style={styles.add_btn_label}>Thêm cửa hàng</Text>
                            </View>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              );
            }}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />}


        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  suggest_box: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
  },
  suggest_heading_box: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 4,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    paddingBottom: 14
  },
  star_box: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center"
  },
  star_label: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8,
  },

  store_item_box: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  store_item: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 12,
    marginTop: 12,
    borderRadius: 12
  },
  store_item_title: {
    color: DEFAULT_COLOR
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  stores_result_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 110
  },
  store_result_item_active: {
    // backgroundColor: "#ebebeb"
  },
  store_result_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  store_result_item_content: {
    flex: 1
  },
  store_result_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  store_result_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '500',
    lineHeight: isIOS ? 18 : 20
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 14,
    lineHeight: isIOS ? 18 : 20
  },
  store_result_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
  store_result_item_add_box: {
    position: 'absolute',
    bottom: 4,
    right: 0
  },
  add_btn_icon_box: {
    borderWidth: 1,
    borderColor: DEFAULT_COLOR,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  add_btn_icon: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginTop: -2
  },
  add_btn_label: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginLeft: 4
  }
});
