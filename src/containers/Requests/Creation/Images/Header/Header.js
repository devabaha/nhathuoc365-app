import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {IconButton} from 'src/components/base';

class Header extends PureComponent {
  state = {};

  handleDelete = () => {
    this.props.onClose();
    this.props.onDelete();
  };

  render() {
    return (
      <View style={styles.container}>
        <IconButton
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          iconStyle={styles.icon}
          onPress={this.props.onClose}
        />

        {!this.props.isEdit && (
          <IconButton
            bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
            iconStyle={styles.icon}
            name="delete"
            onPress={this.handleDelete}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  icon: {
    // color: '#fff',
    fontSize: 28,
    paddingLeft: 15,
    // ...elevationShadowStyle(7),
  },
});

export default Header;
