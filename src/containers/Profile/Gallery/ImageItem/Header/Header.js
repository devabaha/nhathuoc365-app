import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileContext from '../../../ProfileContext';
class Header extends PureComponent {
  static contextType = ProfileContext;
  state = {};

  handleDelete = () => {
    this.props.onClose();
    this.props.onDelete();
  };

  render() {
    const { isMainUser } = this.context;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onClose}>
          <Icon name="close-circle" style={styles.icon} />
        </TouchableOpacity>

        {isMainUser && (
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
