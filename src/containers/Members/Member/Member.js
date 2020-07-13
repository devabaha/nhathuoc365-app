import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

class Member extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Image source={{ uri: this.props.avatar }} style={styles.image} />
        </View>
        <View style={styles.right}>
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subTitle}>{this.props.subTitle}</Text>
          </View>
          {this.props.isUserAsOwner && !this.props.isMemberAsOwner && (
            <View style={styles.subInfo}>
              <TouchableOpacity onPress={this.props.onMorePress}>
                <Icon name="x-square" style={styles.moreIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  right: {
    flex: 1,
    padding: 10,
    paddingLeft: 15,
    height: '100%',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd'
  },
  mainInfo: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  title: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5
  },
  subTitle: {
    fontSize: 13,
    color: '#666'
  },
  subInfo: {
    paddingLeft: 10
  },
  moreIcon: {
    fontSize: 24,
    color: '#888',
    right: 0
  }
});

export default Member;
