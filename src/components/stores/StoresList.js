import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableHighlight,
  FlatList,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements';
import store from '../../store/Store';
import ItemList from '../Home/ItemList';

@observer
export default class StoresList extends Component {
  constructor() {
    super();
    this.state = {
      stores_data: null,
      refreshing: false,
      loading: false,
      user_notice: null,
      finish: false,
      scrollTop: 0
    };

    this._goSearchStore = this._goSearchStore.bind(this);
    this._goListStore = this._goListStore.bind(this);
    this._getData = this._getData.bind(this);
  }

  componentDidMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this),
      onBack: () => {
        this._unMount();

        Actions.pop();
      }
    });

    store.setStoreUnMount('storesList', this._unMount.bind(this));

    this.start_time = time();

    this._getData();

    // auto refresh home
    Events.on(
      KEY_EVENTS_STORE,
      KEY_EVENTS_STORE + 'ID',
      this._getData.bind(this)
    );
  }

  _unMount() {
    Events.removeAll(KEY_EVENTS_STORE);
  }

  // lấy dữ liệu trang home
  _getData(delay) {
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_sites();

          if (response && response.status == STATUS_SUCCESS) {
            setTimeout(() => {
              if (this.state.stores_data == null) {
                layoutAnimation();
              }

              this.setState({
                finish: true,
                loading: false,
                refreshing: false,
                stores_data: response.data
              });
            }, delay || this._delay());
          }
        } catch (e) {
          console.log(e + ' user_sites');
          store.addApiQueue('user_sites', this._getData.bind(this, delay));
        }
      }
    );
  }

  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  // render button trên navbar
  _renderRightButton() {
    return (
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._showPopupAddStore.bind(this)}
      >
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  _showPopupAddStore() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.open();
    }
  }

  // tới màn hình tìm cửa hàng theo mã CH
  _goSearchStore() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.close();
    }
    Actions.search_store();
  }

  // tới màn hình tìm cửa hàng theo danh sách
  _goListStore() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.close();
    }
    Actions.list_store();
  }

  _goScanQRCode() {
    if (this.refs_modal_add_store) {
      this.refs_modal_add_store.close();
    }
    Actions.scan_qr_code();
  }

  // pull to reload danh sách cửa hàng
  _onRefresh() {
    this.setState({ refreshing: true });

    this._getData(1000);
  }

  // render rows cửa hàng trong list
  renderRow({ item, index }) {
    if (index == 0) {
      this.defaultBoxHeight = 0;
    }

    this.defaultBoxHeight += 104;

    // store list
    return <ItemList item={item} />;
  }

  render() {
    var { loading, finish, stores_data } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={event => {
            this.setState({
              scrollTop: event.nativeEvent.contentOffset.y
            });
          }}
          ref={ref => (this.refs_home = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View
            style={{
              backgroundColor: '#f1f1f1',
              paddingHorizontal: 15,
              paddingVertical: 8,
              flexDirection: 'row'
            }}
          >
            <Text style={styles.add_store_title}>CỬA HÀNG YÊU THÍCH</Text>
          </View>

          {loading && this.state.stores_data == null ? (
            <View
              style={[
                styles.defaultBox,
                {
                  height: this.defaultBoxHeight || 104
                }
              ]}
            >
              <Indicator size="small" />
            </View>
          ) : stores_data != null ? (
            <FlatList
              style={styles.stores_box}
              onEndReached={num => {}}
              onEndReachedThreshold={0}
              data={this.state.stores_data}
              renderItem={this.renderRow.bind(this)}
              keyExtractor={item => item.id}
            />
          ) : (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._showPopupAddStore.bind(this)}
            >
              <View style={styles.defaultBox}>
                <CenterText
                  marginTop={0}
                  title={'Chưa có cửa hàng\nThêm cửa hàng bạn yêu thích ngay!'}
                />
              </View>
            </TouchableHighlight>
          )}

          {finish && (
            <View>
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderBottomWidth: Util.pixel,
                  borderColor: '#dddddd'
                }}
              >
                <Text style={styles.add_store_title}>
                  THÊM CỬA HÀNG YÊU THÍCH
                </Text>
              </View>
              <View style={styles.add_store_actions_box}>
                <TouchableHighlight
                  onPress={this._goScanQRCode.bind(this)}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}
                >
                  <View style={styles.add_store_action_btn_box}>
                    <Icon name="qrcode" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>
                      Quét QR code
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this._goSearchStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}
                >
                  <View
                    style={[
                      styles.add_store_action_btn_box,
                      { borderRightWidth: 0 }
                    ]}
                  >
                    <Icon name="search-plus" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>
                      Nhập mã cửa hàng
                    </Text>
                  </View>
                </TouchableHighlight>

                {/*<TouchableHighlight
                  onPress={this._goListStore}
                  underlayColor="transparent"
                  style={styles.add_store_action_btn}>
                  <View style={[styles.add_store_action_btn_box, {borderRightWidth: 0}]}>
                    <Icon name="list-ul" size={20} color="#333333" />
                    <Text style={styles.add_store_action_label}>Danh sách</Text>
                  </View>
                </TouchableHighlight>*/}
              </View>
            </View>
          )}
        </ScrollView>

        <Modal
          entry="top"
          style={[styles.modal, styles.modal_add_store]}
          ref={ref => (this.refs_modal_add_store = ref)}
        >
          <Text style={styles.modal_add_store_title}>
            Thêm cửa hàng bạn yêu thích
          </Text>

          <Button
            onPress={this._goScanQRCode.bind(this)}
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#009588"
            icon={{ name: 'qrcode', type: 'font-awesome' }}
            title="Quét QR code"
          />

          <Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor={DEFAULT_COLOR}
            onPress={this._goSearchStore}
            icon={{ name: 'search-plus', type: 'font-awesome' }}
            title="Nhập mã cửa hàng"
          />

          {/*<Button
            buttonStyle={styles.modal_add_store_btn}
            backgroundColor="#ffc109"
            onPress={this._goListStore}
            icon={{name: 'list-ul', type: 'font-awesome'}}
            title='Xem danh sách cửa hàng' />*/}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultBox: {
    width: '100%',
    height: 104,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    marginBottom: 4
  },

  container: {
    flex: 1,

    marginBottom: 0
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd'
  },

  add_store_box: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  add_store_title: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20
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
    width: ~~(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  modal_add_store: {
    width: '90%',
    // height: 228,
    height: 180,
    borderRadius: 3
  },
  modal_add_store_title: {
    color: '#404040',
    fontSize: 18,
    marginTop: 12,
    marginLeft: 15,
    marginBottom: 8
  },
  modal_add_store_btn: {
    marginTop: 12
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },

  profile_list_opt: {
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },

  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
  }
});
