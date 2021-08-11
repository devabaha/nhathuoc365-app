import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';

import RoundButton from 'src/components/RoundButton';
import SectionContainer from '../SectionContainer';
import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 3,
  },
  boxButtonActions: {
    justifyContent: 'center',
    paddingTop: 8,
  },
  block: {
    marginBottom: 15,
  },
  addMoreWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  addMoreContainer: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: appConfig.device.pixel,
    borderColor: '#999',
    backgroundColor: appConfig.colors.marigold,
  },
  addMoreTitle: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  starReviews: {
    marginLeft: 2,
  },

  buttonActionWrapper: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  btnActionTitle: {
    fontWeight: '500',
  },
});

const ActionButtonSection = ({
  editable,
  onEdit = () => {},

  cancelable,
  onCancel = () => {},

  canReorder,
  onReorder = () => {},

  canAddMore,
  onAddMore = () => {},

  canFeedback,
  onFeedback = () => {},
}) => {
  const hasMainBlockData =
    !!editable || !!cancelable || !!canReorder || !!canFeedback;
  if (!hasMainBlockData && !canAddMore) {
    return null;
  }

  const {t} = useTranslation('orders');

  return (
    <SectionContainer marginTop style={styles.container}>
      <Container centerVertical={false} style={styles.boxButtonActions}>
        {!!hasMainBlockData && (
          <Container row centerVertical={false} style={styles.block}>
            {!!editable && (
              <RoundButton
                onPress={onEdit}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.info}
                width={30}
                title={t('confirm.edit')}
                titleStyle={styles.btnActionTitle}>
                <FontAwesomeIcon name="pencil" size={16} color="#fff" />
              </RoundButton>
            )}

            {!!cancelable && (
              <RoundButton
                onPress={onCancel}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.danger}
                width={30}
                title={t('confirm.cancel')}
                titleStyle={styles.btnActionTitle}>
                <FontAwesomeIcon name="times" size={16} color="#fff" />
              </RoundButton>
            )}

            {!!canReorder && (
              <RoundButton
                onPress={onReorder}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.status.success}
                width={30}
                title={t('confirm.reorder')}
                titleStyle={styles.btnActionTitle}>
                <FontAwesomeIcon name="refresh" size={16} color="#fff" />
              </RoundButton>
            )}

            {canFeedback && (
              <RoundButton
                onPress={onFeedback}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={appConfig.colors.marigold}
                width={30}
                title={t('confirm.feedback')}
                titleStyle={styles.btnActionTitle}>
                <FontAwesomeIcon name="star" size={16} color="#fff" />
              </RoundButton>
            )}
          </Container>
        )}

        {!!canAddMore && (
          <RoundButton
            row
            onPress={onAddMore}
            wrapperStyle={[styles.block, styles.addMoreWrapper]}
            contentContainerStyle={styles.addMoreContainer}
            width={30}
            title={t('confirm.addMoreItems')}
            titleStyle={styles.addMoreTitle}>
            <FontAwesomeIcon name="plus" size={16} color="#fff" />
          </RoundButton>
        )}
      </Container>
    </SectionContainer>
  );
};

export default React.memo(ActionButtonSection);
