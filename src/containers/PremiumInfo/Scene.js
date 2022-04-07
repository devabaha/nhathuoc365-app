import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3 party libs
import {useTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {isConfigActive} from 'app-helper/configKeyHandler';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import BenefitRow from './BenefitRow';
import {
  Container,
  FlatList,
  RefreshControl,
  TextButton,
  Icon,
  Typography,
} from 'src/components/base';

const styles = StyleSheet.create({
  premiumBenefitHeading: {
    paddingTop: 15,
    textAlign: 'right',
    paddingHorizontal: 15,
  },
  loyaltyContainer: {
    marginTop: 7,
    padding: 15,
  },
  loyaltyTitle: {
    flex: 1,
  },
  loyaltyIconRight: {
    flex: undefined,
  },
});

const Scene = ({
  benefits,
  currentPremium,
  premium,
  handleRefresh,
  refreshing,
}) => {
  const userInfo = store.user_info || {};
  const isShowPremiumPoint = !isConfigActive(CONFIG_KEY.HIDE_PREMIUM_POINT_KEY);

  const {theme} = useTheme();

  const {t} = useTranslation('premium');

  const goToNews = () => {
    push(
      appConfig.routes.notifyDetail,
      {
        data: {
          id: userInfo.premium_post_id,
        },
        title: t('title'),
      },
      theme,
    );
  };

  const renderPremiumBenefitsHeader = (premium) => {
    const message =
      premium.point && premium.point > (userInfo.premium_point || 0)
        ? t('tierTitle.reach', {premiumPoint: premium.point})
        : currentPremium.id === premium.id
        ? t('tierTitle.currentTier')
        : t('tierTitle.unlockedTier');
    return (
      <Typography
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        style={styles.premiumBenefitHeading}>
        {message}
      </Typography>
    );
  };

  const renderPremiumBenefit = ({item: benefit}) => {
    return (
      <BenefitRow
        active={benefit.unlock}
        title={benefit.name}
        description={benefit.describe}
      />
    );
  };

  const renderFooterRightIcon = useCallback((titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="chevron-right"
        style={[titleStyle, styles.loyaltyIconRight]}
      />
    );
  }, []);
  const goToNewsTypoProps = useMemo(() => {
    return {type: TypographyType.DESCRIPTION_MEDIUM_TERTIARY};
  }, []);

  return (
    <Container flex>
      <FlatList
        safeLayout
        extraData={benefits}
        data={benefits}
        renderItem={renderPremiumBenefit}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          isShowPremiumPoint && renderPremiumBenefitsHeader(premium)
        }
        ListFooterComponent={
          <Container row noBackground style={styles.loyaltyContainer}>
            <TextButton
              onPress={goToNews}
              typoProps={goToNewsTypoProps}
              titleStyle={styles.loyaltyTitle}
              renderIconRight={renderFooterRightIcon}>
              {t('title')}
            </TextButton>
          </Container>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </Container>
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    nextProps.benefits === prevProps.benefits &&
    nextProps.currentPremium === prevProps.currentPremium &&
    nextProps.premium === prevProps.premium &&
    nextProps.refreshing === prevProps.refreshing
  );
};

export default memo(Scene, areEquals);
