import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15
  },
  btn: {
    justifyContent: 'center',
    backgroundColor: appConfig.colors.primary,
    paddingHorizontal: 15
  },
  btnDisabled: {
    backgroundColor: '#999'
  },
  icon: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#fff'
  }
});

class SearchCustomer extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={this.props.searchValue}
          keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
          onChangeText={this.props.onChangeText}
          placeholder="Tìm kiếm khách hàng..."
          maxLength={10}
          autoFocus
          onFocus={this.props.onSearchInputFocus}
          onBlur={this.props.onSearchInputBlur}
          onSubmitEditing={!this.props.disabled && this.props.onPress}
        />
        <TouchableOpacity
          style={[styles.btn, this.props.disabled && styles.btnDisabled]}
          onPress={this.props.onPress}
          disabled={this.props.disabled}
        >
          <Icon name="search" style={[styles.icon]} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default SearchCustomer;
