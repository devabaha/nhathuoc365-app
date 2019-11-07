import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import ModalOverlay from '../ModalOverlay';
import { View, Text, StyleSheet } from 'react-native';

const defaultFn = () => {};

ModalConfirm.propTypes = {
  visible: PropTypes.bool,
  hideCloseTitle: PropTypes.bool,
  heading: PropTypes.string,
  textMessage: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

function ModalConfirm({
  visible = false,
  hideCloseTitle = false,
  heading = '',
  textMessage = 'Message mặc định!',
  cancelLabel = 'Hủy',
  confirmLabel = 'Xác nhận',
  onCancel = defaultFn,
  onConfirm = defaultFn
}) {
  return (
    <ModalOverlay
      heading={heading}
      visible={visible}
      onClose={onCancel}
      hideCloseTitle={hideCloseTitle}
    >
      <View style={styles.confirmContent}>
        <Text style={styles.confirmText}>{textMessage}</Text>

        <View style={styles.confirmBtnWrap}>
          <Button
            style={[styles.confirmBtn, styles.btnCancel]}
            containerStyle={[
              styles.confirmBtnContainer,
              styles.btnContainerCancel
            ]}
            onPress={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            style={[styles.confirmBtn, styles.btnOk]}
            containerStyle={[styles.confirmBtnContainer, styles.btnContainerOk]}
            onPress={onConfirm}
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </ModalOverlay>
  );
}

const styles = StyleSheet.create({
  confirmContent: {
    padding: 16
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#666'
  },
  confirmBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32
  },
  confirmBtnContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 8,
    borderRadius: 6
  },
  btnContainerCancel: {
    marginRight: 8
  },
  btnContainerOk: {
    marginLeft: 8,
    borderColor: config.colors.primary,
    backgroundColor: config.colors.primary
  },
  confirmBtn: {},
  btnCancel: {
    color: '#666'
  },
  btnOk: {
    color: '#fff'
  }
});

export default ModalConfirm;
