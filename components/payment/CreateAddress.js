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
  ScrollView
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class CreateAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address_default: false,
      bottom: 0
    }

    this._keyboardWillShow = this._keyboardWillShow.bind(this);
    this._keyboardWillHide = this._keyboardWillHide.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);

    Actions.refresh({
      onBack: () => {
        this._unMount();

        Actions.pop();
      }
    });
  }

  _unMount() {
    Keyboard.dismiss();
    Keyboard.removeListener('keyboardWillShow', this._keyboardWillShow);
    Keyboard.removeListener('keyboardWillHide', this._keyboardWillHide);
  }

  _keyboardWillShow(e) {
    if (e) {
      this.setState({
        bottom: e.endCoordinates.height
      });
    }
  }

  _keyboardWillHide(e) {
    if (e) {
      this.setState({
        bottom: 0
      });
    }
  }

  _onSave() {
    this._unMount();

    Actions.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.input_box}>
            <Text style={styles.input_label}>Tên</Text>

            <View style={styles.input_text_box}>
              <TextInput
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder="Điền tên"
                placeholderTextColor="#999999"
                autoFocus={true}
                underlineColorAndroid="#ffffff"
                />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>Số điện thoại</Text>

            <View style={styles.input_text_box}>
              <TextInput
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={11}
                placeholder="Điền số điện thoại"
                placeholderTextColor="#999999"
                underlineColorAndroid="#ffffff"
                />
            </View>
          </View>

          <View style={styles.input_address_box}>
            <Text style={styles.input_label}>Địa chỉ</Text>
            <Text style={styles.input_label_help}>(Số nhà, tên toà nhà, tên đường, tên khu vực, thành phố)</Text>

            <TextInput
              style={[styles.input_address_text, {height: this.state.address_height | 50}]}
              keyboardType="default"
              maxLength={250}
              placeholder="Nhập địa chỉ cụ thể"
              placeholderTextColor="#999999"
              multiline={true}
              underlineColorAndroid="#ffffff"
              onContentSizeChange={(e) => {
                this.setState({address_height: e.nativeEvent.contentSize.height});
              }}
              />
          </View>

          <View style={[styles.input_box, {marginTop: 12}]}>
            <Text style={styles.input_label}>Đăt làm địa chỉ mặc định</Text>

            <View style={styles.input_text_box}>
              <Switch
                onValueChange={(value) => {
                  this.setState({
                    address_default: value
                  });
                }}
                value={this.state.address_default}
                onTintColor={DEFAULT_COLOR}
                />
            </View>
          </View>
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, {bottom: this.state.bottom}]}>
          <View style={styles.address_continue_content}>
            <Icon name="check" size={20} color="#ffffff" />
              <Text style={styles.address_continue_title}>HOÀN THÀNH</Text>
          </View>
        </TouchableHighlight>
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
  input_box: {
    width: '100%',
    height: 44,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  input_label: {
    fontSize: 14,
    color: "#000000"
  },
  input_text: {
    width: '96%',
    height: 38,
    paddingLeft: 8,
    color: "#000000",
    fontSize: 14,
    textAlign: 'right'
  },

  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd",
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: "#666666"
  },
  input_address_text: {
    width: '100%',
    color: "#000000",
    fontSize: 14,
    marginTop: 4
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8
  }
});
