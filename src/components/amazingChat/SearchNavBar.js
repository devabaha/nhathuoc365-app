import React, { Component } from 'react';
import { StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import appConfig from 'app-config';
import { Header, Icon, Input, Item, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

const defaultListener = () => {};
const DURATION_FADE = 300;

class SearchNavBar extends Component {
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
    rightTitle: 'Hủy',
    searchPlaceholder: 'Tìm kiếm khách hàng...',
    searchValue: ''
  };

  state = {
    focus: false,
    fadeAnimation: new Animated.Value(0)
  };
  refInput = null;

  handleFocusInput() {
    this.setState({ focus: true });
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      easing: Easing.ease,
      duration: DURATION_FADE
    }).start();
  }

  handleBlurInput() {
    this.setState({ focus: false });
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      easing: Easing.ease,
      duration: DURATION_FADE
    }).start();
  }

  toggleSearch() {
    if (this.state.focus) {
      if (this.refInput) {
        this.refInput._root.blur();
      } else {
        this.handleBlurInput();
      }
    } else {
      if (this.refInput) {
        this.refInput._root.focus();
      } else {
        this.handleFocusInput();
      }
    }
  }

  handleSearch() {}

  handleBack() {
    Actions.pop();
  }

  render() {
    const iconProps = {
      color: '#fff',
      fontSize: 22
    };

    return (
      <Header style={[styles.container]} searchBar rounded>
        <Item style={[styles.searchInput]}>
          <Animated.View
            style={[
              styles.inputAnimatedWrapper,
              {
                backgroundColor: this.state.fadeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.4)']
                })
              }
            ]}
          >
            <TouchableOpacity onPress={this.toggleSearch.bind(this)}>
              <Animated.View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1
                }}
              >
                <Icon name="ios-search" size={20} style={iconProps} />
              </Animated.View>
            </TouchableOpacity>
            <Input
              ref={inst => (this.refInput = inst)}
              placeholder={this.props.searchPlaceholder}
              placeholderTextColor={'rgba(255, 255, 255, .6)'}
              onChangeText={this.props.onChangeSearch}
              onFocus={this.handleFocusInput.bind(this)}
              onBlur={this.handleBlurInput.bind(this)}
              autoFocus
              style={[
                styles.input,
                {
                  color: 'white'
                }
              ]}
            />
          </Animated.View>
        </Item>

        <Button
          containerStyle={styles.btnCancel}
          onPress={this.handleBack.bind(this)}
        >
          <Text style={styles.textButton}>{this.props.rightTitle}</Text>
        </Button>
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
  icon: {
    color: appConfig.colors.white
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

export default SearchNavBar;
