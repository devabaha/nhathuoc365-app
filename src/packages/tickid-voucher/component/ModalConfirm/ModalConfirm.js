import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {useTranslation} from 'react-i18next';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Typography} from 'src/components/base';
import Button from 'src/components/Button';
import ModalOverlay from '../ModalOverlay';

const defaultFn = () => {};

ModalConfirm.propTypes = {
  visible: PropTypes.bool,
  hideCloseTitle: PropTypes.bool,
  heading: PropTypes.string,
  textMessage: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

function ModalConfirm({
  t = useTranslation('voucher'),

  visible = false,
  hideCloseTitle = false,
  heading = '',
  textMessage = t('modal.message'),
  cancelLabel = t('modal.cancel'),
  confirmLabel = t('modal.accept'),
  onCancel = defaultFn,
  onConfirm = defaultFn,
}) {
  return (
    <ModalOverlay
      heading={heading}
      visible={visible}
      onClose={onCancel}
      hideCloseTitle={hideCloseTitle}>
      <Container safeLayout style={styles.confirmContent}>
        <Typography
          type={TypographyType.LABEL_LARGE}
          style={styles.confirmText}>
          {textMessage}
        </Typography>

        <View style={styles.confirmBtnWrap}>
          <Button
            neutral
            containerStyle={styles.confirmBtnContainer}
            onPress={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            containerStyle={styles.confirmBtnContainer}
            onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </View>
      </Container>
    </ModalOverlay>
  );
}

const styles = StyleSheet.create({
  confirmContent: {},
  confirmText: {
    fontWeight: '400',
    padding: 15,
  },
  confirmBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  confirmBtnContainer: {
    flex: 1,
  },
});

export default ModalConfirm;
