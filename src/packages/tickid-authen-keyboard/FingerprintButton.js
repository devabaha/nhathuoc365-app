import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Icon, TextButton} from 'src/components/base';

FingerprintButton.propTypes = {
  label: PropTypes.string,
  onPress: PropTypes.func,
  visible: PropTypes.bool,
};

FingerprintButton.defaultProps = {
  onPress: () => {},
  visible: true,
};

function FingerprintButton(props) {
  if (!props.visible) return null;

  const {t} = useTranslation();

  const label = props.label || t('verifyFingerprint');

  const renderFingerprintIcon = useCallback(
    (titleStyle, buttonStyle, fontStyle) => {
      return (
        <Icon
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          name="fingerprint"
          style={[fontStyle, styles.fingerPrintIcon]}
        />
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <TextButton
        style={styles.button}
        renderIconLeft={renderFingerprintIcon}
        onPress={props.onPress}>
        {label}
      </TextButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fingerPrintIcon: {
    fontSize: 20,
    marginRight: 5,
  },
});

export default FingerprintButton;
