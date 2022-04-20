import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet, BackHandler, Platform} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {useTranslation} from 'react-i18next';
// configs
import config from '../../config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {showBgrStatusIfOffsetTop} from 'app-packages/tickid-bgr-status-bar';
// context
import {useTheme} from 'src/Themes/Theme.context';
// entities
import EventTracker from 'app-helper/EventTracker';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {
  ScrollView,
  Icon,
  Typography,
  ScreenWrapper,
  Container,
  TextButton,
} from 'src/components/base';
import SubmitButton from '../../component/SubmitButton';
import {FieldItemWrapper, FieldItem} from '../../component/FieldItem';
import CardItem from '../CardItem';
import StatusBarBackground from 'app-packages/tickid-bgr-status-bar';

BuyCardSuccess.propTypes = {
  isBuyCard: PropTypes.bool,
  bookResponse: PropTypes.object,
  serviceId: PropTypes.string,
  historyTitle: PropTypes.string,
};

function BuyCardSuccess({
  isBuyCard = false,
  historyTitle: historyTitleProp = '',
  bookResponse = undefined,
  serviceId = undefined,
}) {
  const {theme} = useTheme();

  const {t} = useTranslation('phoneCard');

  const eventTracker = new EventTracker();

  const historyTitle = historyTitleProp || t('rechargeHistory');

  const viewHistoryTitleTypoProps = {type: TypographyType.LABEL_MEDIUM};

  useEffect(() => {
    function backHandlerListener() {
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', backHandlerListener);
    eventTracker.logCurrentView();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandlerListener);
      eventTracker.clearTracking();
    };
  });

  const pushToBoughtCard = () => {
    config.route.push(
      config.routes.cardHistory,
      {
        serviceId,
        title: historyTitle,
      },
      theme,
    );
  };

  const comeBackHome = () => {
    config.route.pushToMain();
  };

  const handleShowBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    config.routes.buyCardSuccess,
    140,
  );

  const item = bookResponse?.data || {};

  const renderCheckIcon = (titleStyle, fontStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.IONICONS}
        name="checkmark-circle"
        style={[fontStyle, styles.checkIcon]}
      />
    );
  };

  const successTextStyle = useMemo(() => {
    return {
      color: theme.color.white,
    };
  }, [theme]);

  const headerStyle = useMemo(() => {
    return mergeStyles(styles.header, {
      backgroundColor: theme.color.success,
    });
  }, [theme]);

  const viewHistoryTitleStyle = useMemo(() => {
    return {
      color: theme.color.accent2,
    };
  }, [theme]);

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={handleShowBgrStatusIfOffsetTop}>
        <View style={headerStyle}>
          <Typography
            type={TypographyType.TITLE_LARGE}
            style={[styles.successText, successTextStyle]}
            renderIconBefore={renderCheckIcon}>
            {t('success.title')}
          </Typography>
        </View>

        <Container style={styles.messageWrapper}>
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={styles.successMessage}>
            {bookResponse?.message}
          </Typography>
        </Container>

        <Container style={styles.listCards}>
          <View style={styles.listCardHeadingBox}>
            <Typography
              type={TypographyType.TITLE_SEMI_LARGE}
              style={styles.heading}>
              {isBuyCard
                ? t('success.boughtCard')
                : t('success.rechargeInformation')}
            </Typography>

            <TextButton
              typoProps={viewHistoryTitleTypoProps}
              style={styles.viewBoughtCardBtn}
              titleStyle={viewHistoryTitleStyle}
              onPress={pushToBoughtCard}>
              {t('viewHistory')}
            </TextButton>
          </View>

          <CardItem
            cardId={item.id}
            networkType={item.type}
            networkName={item.name}
            price={item.price_label}
            isPay={!!item.is_pay}
            isUsed={!!item.is_used}
            buyTime={item.created}
            showMoreMenu={false}
            statusView={item.status_view}
            syntaxPrepaid={item.syntax_prepaid}
            syntaxPostpaid={item.syntax_postpaid}
            cardCode={item.data && item.data.code}
            cardSeri={item.data && item.data.serial}
          />
        </Container>

        <Container style={styles.orderInfoWrapper}>
          <FieldItemWrapper separate>
            <FieldItem
              label={t('success.transactionStatus')}
              value={item.status_view}
            />
          </FieldItemWrapper>
          <FieldItemWrapper>
            <FieldItem label={t('transactionCode')} value={item.service_code} />
          </FieldItemWrapper>
        </Container>
      </ScrollView>

      <SubmitButton
        safeLayout
        title={t('success.backToHome')}
        style={styles.comeHomeBtn}
        onPress={comeBackHome}
      />

      <StatusBarBackground />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    paddingTop:
      40 + (Platform.OS === 'ios' ? config.device.statusBarHeight : 0),
    paddingBottom: 30,
  },
  successText: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  messageWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  successMessage: {
    textAlign: 'center',
    fontWeight: '600',
  },
  listCards: {
    marginTop: 8,
    paddingBottom: 16,
  },
  listCardHeadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  heading: {
    fontWeight: 'bold',
    marginLeft: 16,
  },
  viewBoughtCardBtn: {
    paddingHorizontal: 16,
  },
  orderInfoWrapper: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  comeHomeBtn: {
    marginTop: 8,
  },

  checkIcon: {
    fontSize: 70,
  },
});

export default BuyCardSuccess;
