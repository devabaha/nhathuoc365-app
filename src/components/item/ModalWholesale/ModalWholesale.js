import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modalbox';

import appConfig from 'app-config';

import Button from 'src/components/Button';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  modalSafeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flex: 1,
  },
  container: {
    maxHeight: appConfig.device.height * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: appConfig.device.bottomSpace,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: appConfig.device.width,
  },
  headerIcon: {
    color: appConfig.colors.primary,
    fontSize: 22,
  },
  headerLabel: {
    ...appConfig.styles.typography.heading3,
    marginLeft: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  headingRow: {
    borderTopWidth: appConfig.device.pixel,
    borderBottomWidth: appConfig.device.pixel,
  },
  listRow: {
    flexDirection: 'row',
    borderColor: '#999',
    width: appConfig.device.width,
  },
  cellContent: {
    fontSize: 13,
    color: '#8b8b8b',
    padding: 15,
    paddingVertical: 12,
    flex: 1,
    textAlign: 'center',
  },
  listSeparatorColumn: {
    borderColor: '#999',
    borderRightWidth: appConfig.device.pixel,
  },
  listCell: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  rightCellText: {
    flex: 1,
    color: appConfig.colors.primary,
    fontWeight: '500',
  },
  actionBtn: {
    width: appConfig.device.width,
    paddingTop: 15,
    paddingBottom: 10,
  },
});

const ModalWholesale = ({data, innerRef = () => {}}) => {
  const {t} = useTranslation('product');

  const refModal = React.useRef();

  const handleRef = (inst) => {
    innerRef(inst);
    refModal.current = inst;
  };

  const handleClose = () => {
    refModal.current && refModal.current.close();
  };

  const renderWholesaleItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.listRow,
          index && {
            borderTopWidth: appConfig.device.pixel,
          },
        ]}>
        <View style={[styles.listCell, styles.listSeparatorColumn]}>
          <Text>{item.quantity}</Text>
        </View>

        <View style={styles.listCell}>
          <Text style={styles.rightCellText}>{item.unit_price}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      ref={handleRef}
      style={styles.modal}
      position="top"
      swipeToClose={false}>
      <View style={[styles.modalSafeView]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Octicons name="package" style={styles.headerIcon} />
            <Text style={styles.headerLabel}>{t('wholesale.title')}</Text>
          </View>
          <View style={[styles.headingRow, styles.listRow]}>
            <Text style={styles.cellContent}>{t('wholesale.quantity')}</Text>

            <Text style={styles.cellContent}>{t('wholesale.unitPrice')}</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderWholesaleItem}
            keyExtractor={(_, index) => index.toString()}
          />

          <Button
            title={t('common:agree')}
            containerStyle={styles.actionBtn}
            onPress={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ModalWholesale);
