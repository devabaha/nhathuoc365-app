import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {Component} from 'react';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';

const NAV_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;

const styles = StyleSheet.create({
  container: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    paddingTop: isIOS ? 20 : 0,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#828287',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  navBarItem: {
    flex: 1,
    justifyContent: 'center'
  },
  alignCenter: {
    alignItems: 'center'
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  buttonBox: {
    width: 36,
    height: NAV_HEIGHT - (isIOS ? 20 : 0),
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class NavBar extends Component {

  _renderLeft() {
    var {isGrayStyle, hiddenChatIcon} = this.props;

    return (
      <TouchableOpacity
        onPress={Actions.pop}
        style={[styles.navBarItem]}>
        <View style={[styles.buttonBox, isGrayStyle ? {
          flexDirection: 'row',
          width: 100
        } : null]}>
          <Icon name="angle-left" size={38} color={!isGrayStyle ? "#ffffff" : 'rgb(0, 122, 255)'} />
          {isGrayStyle && <Text style={{
            color: 'rgb(0, 122, 255)',
            marginTop: 2,
            marginLeft: 4,
            fontSize: 14
          }}>Đơn hàng</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    var {isGrayStyle, hiddenChatIcon} = this.props;

    return (
      <View style={[styles.navBarItem, styles.alignCenter, {
        flex: 2
      }]}>
        <Text style={[styles.navTitle, {
          color: !isGrayStyle ? "#ffffff" : "#0A0A0A"
        }]}>{ this.props.title }</Text>
      </View>
    )
  }

  _renderRight() {
    var {isGrayStyle, hiddenChatIcon, phoneNumber} = this.props;

    return (
      <View style={[styles.navBarItem, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
        {!hiddenChatIcon && (
          <TouchableOpacity
            onPress={this.props.onNavFilter}
            style={{ paddingRight: 10}}>
            <View style={styles.buttonBox}>
              <Icon name="filter" size={22} color={!isGrayStyle ? "#ffffff" : 'rgb(0, 122, 255)'} />
              <Text style={[styles.buttonTitle, {
                color: !isGrayStyle ? "#ffffff" : 'rgb(0, 122, 255)'
              }]}>Lọc</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={this.props.onNavSave}
          style={{ paddingRight: 10}}>
          <View style={styles.buttonBox}>
            <Icon name="save" size={22} color={!isGrayStyle ? "#ffffff" : 'rgb(0, 122, 255)'} />
            <Text style={[styles.buttonTitle, {
              color: !isGrayStyle ? "#ffffff" : 'rgb(0, 122, 255)'
            }]}>Xong</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    var {isGrayStyle, hiddenChatIcon} = this.props;

    return (
        <View style={[styles.container, {
          backgroundColor: !isGrayStyle ? DEFAULT_COLOR : "#EFEFF2"
        }]}>
          { this._renderLeft() }
          { this._renderMiddle() }
          { this._renderRight() }
        </View>
    )
  }
}
