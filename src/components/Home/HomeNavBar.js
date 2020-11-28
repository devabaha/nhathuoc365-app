import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// library
import Communications from 'react-native-communications';

import NavButton from './NavButton';

export default class HomeNavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { title } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.leftNav}></View>

        <View style={styles.centerNav}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightNav}>
          <View style={styles.btnCloseBox}>
            <NavButton
              label="Gọi hỗ trợ"
              icon="ios-call"
              size={24}
              onPress={() => {
                Communications.phonecall(HOTLINE, true);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const NAV_HEIGHT = isIOS ? 64 : 54;

const styles = StyleSheet.create({
  container: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    paddingTop: isIOS ? 20 : 0,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#828287',
    backgroundColor: DEFAULT_COLOR,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  leftNav: {
    flex: 1
  },
  centerNav: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightNav: {
    flex: 1,
    alignItems: 'flex-end'
  },
  title: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600'
  },
  btnCloseBox: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnClose: {
    padding: 8
  },
  btnTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600'
  }
});
