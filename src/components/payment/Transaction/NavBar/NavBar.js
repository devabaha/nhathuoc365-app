import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {CloseButton} from 'app-packages/tickid-navbar';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#cccccc',
  },

  mainContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        height: 44,
      },
      android: {
        height: 54,
      },
      windows: {
        height: 54,
      },
    }),
  },

  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: 17,
    fontWeight: '600',
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
  },

  closeBtnContainer: {},
});

function NavBar({title, onClose = () => {}}) {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.mainContentContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <View pointerEvents="none" style={styles.closeBtnContainer}>
              <CloseButton />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default NavBar;
