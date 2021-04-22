import React from 'react';
import {SafeAreaView, StyleSheet, Text, Platform, View, TouchableOpacity} from 'react-native';
import appConfig from 'app-config';
import Container from '../../../../components/Layout/Container';
import {CloseButton} from 'app-packages/tickid-navbar';
import {navBarConfig} from '../../../../navBarConfig';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
      windows: {
        height: 54,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#cccccc',
  },

  mainContentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 5,
      },
      windows: {
        top: 5,
      },
    }),
  },

  title: {
    top: 2,
    textAlign: 'center',
    color: '#333',
    fontSize: 17,
    fontWeight: '600',
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
  },

  closeBtnContainer: {top: -8},
});

function NavBar({title, onClose = () => {}}) {
  return (
    <View style={styles.container}>
      <View flex row style={styles.mainContentContainer}>
        {/* <View style={styles.titleWrapper}> */}
        <Text style={styles.title}>{title}</Text>
        {/* </View> */}
        <TouchableOpacity onPress={onClose}>
        <View pointerEvents="none" style={styles.closeBtnContainer}>
          <CloseButton />
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default NavBar;
