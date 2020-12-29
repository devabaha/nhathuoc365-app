/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Switch,
  Keyboard,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Platform
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import EventTracker from '../../helper/EventTracker';

class NapTKCConfirm extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {};
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _unMount() {}

  onPressContinue() {
    if (this.state.pay === 0) {
    } else {
      return Alert.alert(
        'Thông báo',
        'OK',
        [
          {
            text: 'Đồng ý',
            onPress: () => {}
          }
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: 50
          }}
        >
          {/* Block thong tin chi tiet*/}
          <View style={styles.block_detail_box}>
            <TouchableHighlight underlayColor="#ffffff">
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Icon
                  style={styles.icon_label}
                  name="info-circle"
                  size={16}
                  color="#999999"
                />
                <Text style={styles.input_label_header}>
                  Chi tiết giao dịch
                </Text>
              </View>
            </TouchableHighlight>
            <View style={styles.block_detail_content}>
              <View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.blocl_continue_input_label}>Số </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {this.props.detail.text_tel}
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.blocl_continue_input_label}>
                    Dịch vụ{' '}
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {' '}
                      Nạp {this.props.detail.telco}{' '}
                      {this.props.detail.price_select}
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.blocl_continue_input_label}>Số tiền</Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {this.props.detail.price_select}
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label}>
                  <Text style={styles.blocl_continue_input_label}>
                    Hoàn tiền
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {this.props.detail.discount_label}
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label}>
                  <Text style={styles.blocl_continue_input_label}>
                    Phí giao dịch
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      Miễn phí
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.blocl_continue_input_label}>
                    Tổng tiền{' '}
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      {this.props.detail.pay} đ
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.blocl_continue_input_label}>
                    Ví TickID
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.blocl_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      50.000 đ
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label}>
                  <Text style={styles.block_continue_input_label}>
                    Ví tạm ứng
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.block_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      46.000 đ
                    </Text>
                  </View>
                </View>
                <View style={styles.block_continue_content_label_no_border}>
                  <Text style={styles.block_continue_input_label}>
                    Tiền mặt{' '}
                  </Text>
                  <View style={styles.block_continue_content_label_right}>
                    <Text
                      style={[
                        styles.block_continue_input_label,
                        { color: DEFAULT_COLOR }
                      ]}
                    >
                      0 đ
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/*Block Confirm */}
        <View
          style={[
            styles.boxButtonActions,
            {
              paddingTop: 0
            }
          ]}
        >
          <TouchableHighlight
            style={styles.buttonAction}
            onPress={() => this.onPressContinue()}
            underlayColor="transparent"
          >
            <View
              style={[
                styles.boxButtonAction,
                {
                  width: Util.size.width - 160,
                  backgroundColor: DEFAULT_COLOR,
                  borderColor: '#999999'
                }
              ]}
            >
              <Icon
                style={styles.starReviews}
                name="check"
                size={12}
                color="#ffffff"
              />
              <Text
                style={[
                  styles.buttonActionTitle,
                  {
                    color: '#ffffff'
                  }
                ]}
              >
                Xác nhận
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0
  },
  input_label_header: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
    fontWeight: 'bold'
  },
  input_label: {
    fontSize: 14,
    color: '#000000'
  },
  input_text: {
    width: '96%',
    height: 44,
    paddingLeft: 8,
    color: '#000000',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },
  // Detail
  block_detail_box: {
    width: '100%',
    // minHeight: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd'
  },
  block_detail_content: {
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd'
  },
  //Block Continue
  block_continue: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%'
  },
  block_continue_content: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 10,
    paddingHorizontal: 20,
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd'
  },
  block_continue_content_label_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  block_continue_content_label: {
    width: '100%',
    height: 30,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center'
  },
  block_continue_content_label_no_border: {
    width: '100%',
    height: 30,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  block_continue_input_label: {
    fontSize: 14,
    color: '#000'
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },
  right_title_btn_box: {
    flex: 1,
    alignItems: 'flex-end'
  },
  boxButtonActions: {
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
    flexDirection: 'row',
    color: '#333333',
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionTitleActive: {
    flexDirection: 'row',
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14
  },
  buttonActionSubTitle: {
    color: '#333333',
    marginLeft: 4,
    fontSize: 7
  },
  buttonActionSubTitleActive: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 7
  },
  lineView: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgb(225,225,225)'
  }
});

export default observer(NapTKCConfirm);