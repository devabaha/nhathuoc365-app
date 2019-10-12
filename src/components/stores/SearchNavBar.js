import React, { Component } from 'react';
import appConfig from 'app-config';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { HeaderBackButton } from 'react-navigation';

class SearchNavBar extends Component {
  renderLeft() {
    return (
      <View style={styles.backButton}>
        <HeaderBackButton
          onPress={Actions.pop}
          tintColor={appConfig.colors.white}
        />
      </View>
    );
  }

  renderMiddle() {
    return (
      <View style={styles.searchWrapper}>
        <TextInput style={styles.searchInput} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLeft()}
        {this.renderMiddle()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: appConfig.colors.primary,
    ...ifIphoneX(
      {
        paddingTop: 50,
        height: 88
      },
      {
        paddingTop: 20,
        height: Platform.OS === 'ios' ? 64 : 54
      }
    )
  },
  backButton: {
    position: 'relative',
    top: -6
  },
  searchWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  searchInput: {}
});

export default SearchNavBar;
