import React, { PureComponent } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';

class SearchInput extends PureComponent {
  static defaultProps = {};

  state = {};
  refTextInput = React.createRef();

  get refInput() {
    return this.refTextInput.current ? this.refTextInput.current : null;
  }

  render() {
    return (
      <>
        <Icon name="search" size={24} color={appConfig.colors.primary} />
        <TextInput
          ref={this.refTextInput}
          numberOfLines={1}
          style={styles.input}
          placeholder="Nhập để tìm kiếm..."
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 18,
    paddingVertical: 10
  }
});

export default SearchInput;
