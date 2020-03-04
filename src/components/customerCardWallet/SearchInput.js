import React, { PureComponent } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';

class SearchInput extends PureComponent {
  static defaultProps = {
    onChangeText: () => {},
    value: ''
  };

  state = {};
  refTextInput = React.createRef();

  get refInput() {
    return this.refTextInput.current ? this.refTextInput.current : null;
  }

  render() {
    return (
      <>
        <Icon name="search" style={styles.icon} />
        <TextInput
          ref={this.refTextInput}
          numberOfLines={1}
          style={styles.input}
          placeholder="Nhập để tìm kiếm..."
          placeholderTextColor={appConfig.colors.placeholder}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: appConfig.device.isIOS ? 18 : 16,
    paddingVertical: 10
  },
  icon: {
    fontSize: appConfig.device.isIOS ? 24 : 20,
    color: appConfig.colors.primary
  }
});

export default SearchInput;
