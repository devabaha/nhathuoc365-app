import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Header extends PureComponent {
  state = {};

  handleDelete = () => {
    this.props.onClose();
    this.props.onDelete();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onClose}>
          <Icon name="close-circle" style={styles.icon} />
        </TouchableOpacity>

        {!this.props.isEdit && (
          <TouchableOpacity onPress={this.handleDelete}>
            <Icon name="delete" style={styles.icon} />
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
    paddingVertical: 30
  },
  icon: {
    color: '#fff',
    fontSize: 28,
    paddingLeft: 15,
    ...elevationShadowStyle(7)
  }
});

export default Header;
