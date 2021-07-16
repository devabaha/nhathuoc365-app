import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

export default class DatePickerNavBar extends Component {
  constructor(props) {
    super();
  }

  render() {
    var { title } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.leftNav}>
          <View style={styles.btnCloseBox}>
            <TouchableHighlight
              style={styles.btnClose}
              onPress={() => {
                Actions.pop();
              }}
              underlayColor="transparent">
              <Icon name="ios-close" size={38} color="rgba(255,255,255,.6)" />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.centerNav}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightNav}>

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
    backgroundColor: DEFAULT_COLOR
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
    width: 60,
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
