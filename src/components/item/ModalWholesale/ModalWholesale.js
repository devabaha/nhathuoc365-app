import React, {useMemo} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
// 3-party-libs
import Modal from 'react-native-modalbox';
// configs
import appConfig from 'app-config';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import Button from 'src/components/Button';
import {Typography, Icon, Container, FlatList} from 'src/components/base';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  modalSafeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 0,
  },
  container: {
    maxHeight: appConfig.device.height * 0.8,
    overflow: 'hidden',
    alignItems: 'center',
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
    fontSize: 22,
  },
  headerLabel: {
    marginLeft: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  headingRow: {},
  listRow: {
    flexDirection: 'row',
    width: appConfig.device.width,
  },
  cellContent: {
    padding: 15,
    paddingVertical: 12,
    flex: 1,
    textAlign: 'center',
  },
  listSeparatorColumn: {},
  listCell: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  rightCellText: {
    flex: 1,
    fontWeight: '500',
  },
  actionBtn: {
    width: appConfig.device.width,
    paddingTop: 15,
    paddingBottom: 10,
  },
});

const ModalWholesale = ({data, innerRef = () => {}}) => {
  const {theme} = useTheme();

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
      <View style={[styles.listRow, listRowStyle]}>
        <View
          style={[
            styles.listCell,
            styles.listSeparatorColumn,
            listSeparatorColumnStyle,
          ]}>
          <Typography type={TypographyType.LABEL_MEDIUM}>
            {item.quantity}
          </Typography>
        </View>

        <View style={styles.listCell}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_PRIMARY}
            style={styles.rightCellText}>
            {item.unit_price}
          </Typography>
        </View>
      </View>
    );
  };

  const modalStyle = useMemo(() => {
    return {
      borderTopLeftRadius: theme.layout.borderRadiusHuge,
      borderTopRightRadius: theme.layout.borderRadiusHuge,
    };
  }, [theme]);

  const headingRowStyle = useMemo(() => {
    return {
      borderTopWidth: theme.layout.borderWidthSmall,
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    };
  }, [theme]);

  const listRowStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    };
  }, [theme]);

  const listSeparatorColumnStyle = useMemo(() => {
    return {
      borderRightWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    };
  }, [theme]);

  return (
    <Modal
      ref={handleRef}
      style={styles.modal}
      position="top"
      swipeToClose={false}>
      <View style={styles.modalSafeView}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={{flex: 1}} />
        </TouchableWithoutFeedback>

        <Container safeLayout style={[styles.container, modalStyle]}>
          <View style={styles.headerContainer}>
            <Icon
              primaryHighlight
              bundle={BundleIconSetName.OCTICONS}
              name="package"
              style={styles.headerIcon}
            />
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.headerLabel}>
              {t('wholesale.title')}
            </Typography>
          </View>
          <View style={[styles.headingRow, styles.listRow, headingRowStyle]}>
            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
              style={styles.cellContent}>
              {t('wholesale.quantity')}
            </Typography>

            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
              style={styles.cellContent}>
              {t('wholesale.unitPrice')}
            </Typography>
          </View>
          <FlatList
            data={data}
            contentContainerStyle={styles.listContentContainer}
            renderItem={renderWholesaleItem}
            keyExtractor={(_, index) => index.toString()}
          />

          <Button
            title={t('common:agree')}
            containerStyle={styles.actionBtn}
            onPress={handleClose}
          />
        </Container>
      </View>
    </Modal>
  );
};

export default React.memo(ModalWholesale);
