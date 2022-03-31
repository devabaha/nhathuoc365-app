import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 0.5,
    borderColor: '#eaeaea'
  },
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {},
  avatarIcon: {
    fontSize: 26,
    color: appConfig.colors.primary
  },
  mainInfo: {
    flex: 1,
    paddingHorizontal: 15
  },
  title: {
    fontWeight: '500',
    color: '#333',
    fontSize: 16
  },
  subTitle: {
    marginTop: 5,
    color: '#888'
  },
  rightIcon: {
    fontSize: 16,
    color: '#ccc'
  }
});

class CustomerRow extends Component {
  state = {};
  render() {
    return (
      <TouchableHighlight underlayColor="#ddd" onPress={this.props.onPress}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            {/* <View style={styles.avatarContainer}>
          <Icon name="user-circle" style={styles.avatarIcon} />
        </View> */}
            <View style={styles.mainInfo}>
              <Text style={styles.title}>{this.props.name}</Text>
              <Text style={styles.subTitle}>{this.props.tel}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Icon name="chevron-right" style={styles.rightIcon} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default CustomerRow;
