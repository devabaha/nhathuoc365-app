import React from 'react';

import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/Entypo';

/**
 * @component - Information of user sent request.
 *
 * @param {string} name
 * @param {string} avatar
 * @param {*} room_code
 * @param {*} tel
 */
const UserRow = ({ name, avatar, room_code, tel }) => {
  function callUser() {
    Communications.phonecall(tel, true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subTitle}>{room_code}</Text>
      </View>

      <TouchableOpacity onPress={callUser}>
        <Icon name="phone" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 15
  },
  avatar: {
    width: '100%',
    height: '100%'
  },
  mainInfo: {
    flex: 1
  },
  title: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5
  },
  subTitle: {
    color: '#666',
    fontSize: 12
  },
  icon: {
    fontSize: 22,
    color: '#333'
  }
});

export default UserRow;
