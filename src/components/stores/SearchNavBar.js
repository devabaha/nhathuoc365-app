import React, { Component } from 'react';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

class SearchNavBar extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string
  };

  static defaultProps = {
    onCancel: () => {},
    onSearch: () => {},
    placeholder: '',
    searchValue: ''
  };

  renderRight() {
    return (
      <Button
        containerStyle={styles.cancelButton}
        onPress={() => {
          Actions.pop();
          this.props.onCancel();
        }}
      >
        <Text style={styles.cancelText}>Hủy</Text>
      </Button>
    );
  }

  renderMiddle() {
    return (
      <View style={styles.searchWrapper}>
        <Icon
          size={20}
          color="#ccc"
          style={styles.searchIcon}
          name="ios-search"
        />
        <TextInput
          style={styles.searchInput}
          placeholder={this.props.placeholder}
          placeholderTextColor="#ccc"
          onChangeText={this.props.onSearch}
          value={this.props.searchValue}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMiddle()}
        {this.renderRight()}
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
  cancelButton: {
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  cancelText: {
    fontSize: 16,
    color: '#fff'
  },
  searchIcon: {
    position: 'relative',
    top: 2
  },
  searchWrapper: {
    flex: 1,
    paddingLeft: 8,
    marginLeft: 10,
    marginVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    color: appConfig.colors.white
  }
});

export default SearchNavBar;
