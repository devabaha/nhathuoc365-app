import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import RoundButton from 'src/components/RoundButton';
import SectionContainer from '../SectionContainer';
import {Container, Icon} from 'src/components/base';

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
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreTitle: {
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
  icon: {
    fontSize: 16,
  },
});

const ActionButtonSection = ({
  safeLayout = false,

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

  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const addMoreContainerStyle = useMemo(() => {
    return mergeStyles(styles.addMoreContainer, {
      borderRadius: theme.layout.borderRadiusSmall,
      borderWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
      backgroundColor: theme.color.marigold,
    });
  }, [theme]);

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.white,
    });
  }, [theme]);

  const addMoreTitleStyle = useMemo(() => {
    return mergeStyles(styles.addMoreTitle, {
      color: theme.color.white,
    });
  }, [theme]);

  return (
    <SectionContainer marginTop style={styles.container}>
      <Container safeLayout={safeLayout} centerVertical={false} style={styles.boxButtonActions}>
        {!!hasMainBlockData && (
          <Container row style={styles.block}>
            {!!editable && (
              <RoundButton
                onPress={onEdit}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={theme.color.info}
                width={30}
                title={t('confirm.edit')}
                titleStyle={styles.btnActionTitle}>
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="pencil"
                  style={iconStyle}
                />
              </RoundButton>
            )}

            {!!cancelable && (
              <RoundButton
                onPress={onCancel}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={theme.color.danger}
                width={30}
                title={t('confirm.cancel')}
                titleStyle={styles.btnActionTitle}>
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="times"
                  style={iconStyle}
                />
              </RoundButton>
            )}

            {!!canReorder && (
              <RoundButton
                onPress={onReorder}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={theme.color.success}
                width={30}
                title={t('confirm.reorder')}
                titleStyle={styles.btnActionTitle}>
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="refresh"
                  style={iconStyle}
                />
              </RoundButton>
            )}

            {!!canFeedback && (
              <RoundButton
                onPress={onFeedback}
                wrapperStyle={styles.buttonActionWrapper}
                bgrColor={theme.color.marigold}
                width={30}
                title={t('confirm.feedback')}
                titleStyle={styles.btnActionTitle}>
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="star"
                  style={iconStyle}
                />
              </RoundButton>
            )}
          </Container>
        )}

        {!!canAddMore && (
          <RoundButton
            row
            onPress={onAddMore}
            wrapperStyle={[styles.block, styles.addMoreWrapper]}
            contentContainerStyle={addMoreContainerStyle}
            width={30}
            title={t('confirm.addMoreItems')}
            titleStyle={addMoreTitleStyle}>
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="plus"
              style={iconStyle}
            />
          </RoundButton>
        )}
      </Container>
    </SectionContainer>
  );
};

export default React.memo(ActionButtonSection);
