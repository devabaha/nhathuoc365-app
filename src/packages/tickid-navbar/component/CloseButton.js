import React from 'react';
import {StyleSheet} from 'react-native';
// routing
import {pop} from 'app-helper/routing';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {IconButton, Icon} from 'src/components/base';

function CloseButton(props) {
  const renderIcon = (iconStyles) => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="close"
        style={[iconStyles, iconStyle]}
      />
    );
  };

  const iconStyle = props.color && {
    color: props.color,
  };

  return (
    <IconButton
      style={styles.container}
      onPress={pop}
      iconStyle={styles.iconClose}
      renderTitleComponent={renderIcon}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginHorizontal: 4,
  },
  iconClose: {
    fontSize: 24,
  },
});

export default CloseButton;
