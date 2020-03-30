import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import searchImage from '../../assets/images/search.png';
import closeImage from '../../assets/images/close.png';

class Search extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    value: '',
    onChangeText: () => {},
    onClearText: () => {},
    placeholder: 'Tìm theo tên hoặc số điện thoại'
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={searchImage} />
        <TextInput
          style={styles.textInput}
          placeholder={this.props.placeholder}
          placeholderTextColor="#c7c7cd"
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
        {!!this.props.value && (
          <TouchableOpacity onPress={this.props.onClearText}>
            <Image style={styles.icon} source={closeImage} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 8
  },
  icon: {
    width: 18,
    height: 18
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 12,
    marginLeft: 8
  }
});

export default Search;
