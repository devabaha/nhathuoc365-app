import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Keyboard,
  SafeAreaView
} from 'react-native';
import PropTypes from 'prop-types';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class PlaceNavBar extends Component {
  static propTypes = {
    onChangeText: PropTypes.func
  }

  static defaultProps = {
    onChangeText: value => value
  }

  constructor(props) {
    super(props);

    this.state = {
      keyword: ''
    }
  }

  render() {
    var { onChangeText } = this.props;
    var { keyword } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>

          <View style={{
            backgroundColor: '#ffffff',
            width: Util.size.width - 8 - 80,
            height: 34,
            marginLeft: 8,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center'
          }}>

            <Icon style={{
              paddingHorizontal: 10
            }} name="search" size={16} color="#999999" />

            <TextInput
              underlineColorAndroid="transparent"
              style={{
                fontSize: 15,
                padding: 0,
                margin: 0,
                width: Util.size.width - 8 - 80 - 64,
                color: '#404040',
                height: 32,
                marginTop: isIOS ? 2 : 1
              }}
              value={keyword}
              onChangeText={value => {
                this.setState({
                  keyword: value
                }, () => {
                  onChangeText(value);
                });
              }}
              placeholder="Tìm tỉnh thành phố hoặc sân bay"
              />

            {keyword != '' && (
              <TouchableHighlight
                style={{
                  flex: 1,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  this.setState({
                    keyword: ''
                  }, () => {
                    onChangeText('');
                  });
                }}
                underlayColor="transparent">
                <Icon name="times-circle" size={16} color="#cccccc" />
              </TouchableHighlight>
            )}
          </View>

          <View style={{
            width: 80,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TouchableHighlight
              style={{
                padding: 8
              }}
              onPress={() => {
                Keyboard.dismiss();
                Actions.pop();
              }}
              underlayColor="transparent">
              <Text style={{
                fontSize: 16,
                color: '#ffffff',
                fontWeight: '600'
              }}>Đóng</Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const NAV_HEIGHT = isIOS ? 84 : 54;

const styles = StyleSheet.create({
  container: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    paddingTop: isIOS ? 20 : 0,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#828287',
    backgroundColor: DEFAULT_COLOR
  },
  content: {
    // marginTop:20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
