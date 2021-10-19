import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import appConfig from 'app-config';
import { Header, Item, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

const defaultListener = () => {};

class ListNavBar extends Component {
  static propTypes = {
    onRight: PropTypes.func,
    onChangeSearch: PropTypes.func,
    onClearText: PropTypes.func,
    rightTitle: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchValue: PropTypes.string
  };

  static defaultProps = {
    onRight: defaultListener,
    onChangeSearch: defaultListener,
    onClearText: defaultListener,
    rightTitle: '',
    searchPlaceholder: 'Tìm kiếm khách hàng...',
    searchValue: ''
  };

  state = {
    focus: false
  };
  refInput = null;

  handleSearch() {
    Actions.search_chat();
  }

  handleBack() {
    Actions.pop();
  }

  render() {
    const iconProps = {
      color: '#fff',
      fontSize: 24
    };
    return (
      <Header
        iosBarStyle="light-content"
        style={[styles.container]}
        searchBar
        rounded
      >
        <Item style={[styles.searchInput]}>
          <TouchableOpacity onPress={this.handleBack.bind(this)}>
            <View style={styles.iconWrapper}>
              <Icon name="ios-arrow-back" style={[styles.icon, iconProps]} />
            </View>
          </TouchableOpacity>

          <View style={[styles.inputAnimatedWrapper]}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>

          {/* <TouchableOpacity onPress={this.handleSearch.bind(this)}>
            <View style={styles.iconWrapper}>
              <Icon name="ios-search" style={[styles.icon, iconProps]} />
            </View>
          </TouchableOpacity> */}
        </Item>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appConfig.colors.primary
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: appConfig.colors.white
  },
  leftWrapper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  textButton: {
    color: appConfig.colors.white
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  icon: {
    color: appConfig.colors.white,
    paddingHorizontal: 5
  },
  btnClearText: {
    backgroundColor: '#999',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  closeIcon: {
    position: 'relative',
    top: -1
  },
  btnCancel: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  inputAnimatedWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 0
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default ListNavBar;
