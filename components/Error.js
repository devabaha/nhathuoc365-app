import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import store from '../store/Store';

@observer
class Error extends Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected
    .fetch()
    .done(isConnected => store.setConnect(isConnected));
  }

  handleConnectionChange = (isConnected) => {
    store.setConnect(isConnected);
  }

  render() {
    var { isConnected } = store;
    if (isConnected) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Kiểm tra kết nối internet!</Text>
        </View>
      </View>
    );
  }
}

const NAV_HEIGHT = isIOS ? 64 : 54;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: NAV_HEIGHT,
    left: 0,
    right: 0
  },
  content: {
    width: Util.size.width,
    height: 28,
    backgroundColor: '#FFD2D2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    color: '#D8000C',
    fontSize: 14
  }
});

export default Error;