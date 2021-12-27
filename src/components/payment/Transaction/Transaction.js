import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
// 3-party libs
import {Actions} from 'react-native-router-flux';
import Shimmer from 'react-native-shimmer';
import QRCode from 'react-native-qrcode-svg';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {copyToClipboard} from 'app-helper';
import {saveImage} from 'app-helper/image';
import VNPayMerchant from 'app-helper/VNPayMerchant/VNPayMerchant';
import {PhotoLibraryPermission} from 'app-helper/permissionHelper';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop, push, replace} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CART_PAYMENT_STATUS} from 'src/constants/cart/types';
import {PAYMENT_METHOD_GATEWAY} from 'src/constants/payment/types';
import {
  BundleIconSetName,
  TypographyType,
  ButtonRoundedType,
} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import PopupConfirm from 'src/components/PopupConfirm';
import QRPayFrame from './QRPayFrame';
import NavBar from './NavBar';
import {
  RefreshControl,
  ScrollView,
  Typography,
  Icon,
  ScreenWrapper,
  Container,
  AppFilledButton,
  AppFilledTonalButton,
  ActivityIndicator,
} from 'src/components/base';

const styles = StyleSheet.create({
  statusContainer: {
    width: appConfig.device.width,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 22,
  },
  statusTitle: {
    fontWeight: '500',
    marginLeft: 15,
  },
  qrImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveQRBtnContainer: {
    marginBottom: 30,
    width: undefined,
    alignSelf: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },

  saveQRCodeIcon: {
    fontSize: 14,
    marginRight: 7,
  },
  infoButtonContainer: {
    overflow: 'hidden',
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  infoTitle: {
    padding: 10,
    marginBottom: 3,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  copyIcon: {
    marginRight: 5,
  },
  title: {},
  value: {},
  highlight: {
    fontWeight: 'bold',
  },
  special: {
    fontSize: 16,
  },
  note: {
    marginTop: 15,
    padding: 15,
    fontStyle: 'italic',
  },

  btnContainer: {
    paddingVertical: 10,
  },
  confirmBtn: {
    flex: 1,
    width: undefined,
  },
});

const BACK_TYPE = {
  POP: 0,
  BACK_HOME: 1,
};

const Transaction = ({
  siteId = store?.store_data?.id,
  cartId = store?.cart_data?.id,
  onPop = () => {},
  ...props
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation(['common', 'payment']);

  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPaid, setPaid] = useState(false);
  const [isError, setError] = useState(false);

  const [transactionData, setTransactionData] = useState();

  const [backType, setBackType] = useState(BACK_TYPE.POP);
  const [isImageSavingLoading, setImageSavingLoading] = useState(false);

  const [checkPaymentStatusRequest] = useState(
    new APIRequest({testID: new Date().getTime()}),
  );
  const [getTransactionDataRequest] = useState(
    new APIRequest({testID: new Date().getTime()}),
  );

  const refPopup = useRef(null);
  const refQRCode = useRef();

  const isActiveWebview = (transaction = transactionData) =>
    transaction?.url &&
    !transaction?.data_qrcode &&
    !isPaid &&
    !transaction?.data_va?.length;

  const saveQRBtnTypoProps = useMemo(() => {
    return {
      type: TypographyType.LABEL_SMALL,
      renderIconBefore: (titleStyle) => {
        return (
          <Icon
            bundle={BundleIconSetName.ANT_DESIGN}
            name="download"
            style={[titleStyle, styles.saveQRCodeIcon]}
          />
        );
      },
    };
  }, []);

  const copyInfoBtnTypoProps = useMemo(() => {
    return {
      type: TypographyType.LABEL_SMALL,
      renderIconBefore: (titleStyle) => {
        return (
          <Icon
            bundle={BundleIconSetName.IONICONS}
            name="ios-copy"
            style={[titleStyle, styles.copyIcon]}
          />
        );
      },
    };
  }, []);

  useEffect(() => {
    getTransactionData(true);

    return () => {
      getTransactionDataRequest.cancel();
    };
  }, [getTransactionData]);

  useEffect(() => {
    let intervalUpdater = () => {};
    let isUnMounted = false;

    async function checkPaymentStatus() {
      checkPaymentStatusRequest.data = APIHandler.cart_payment_status(
        siteId,
        cartId,
      );
      try {
        const response = await checkPaymentStatusRequest.promise();
        // console.log(response, siteId, cartId);
        if (isUnMounted) return;

        if (response) {
          if (response.status === STATUS_SUCCESS) {
            if (response.data) {
              switch (response.data.status) {
                case CART_PAYMENT_STATUS.PAID:
                  setPaid(true);
                  break;
                case CART_PAYMENT_STATUS.CANCEL:
                  setError(true);
                  break;
              }

              if (
                !!response.data?.close_payment &&
                Actions.currentScene === `${appConfig.routes.modalWebview}_1`
              ) {
                pop();
              }
            }
            setError(false);
          } else {
            setError(true);

            flashShowMessage({
              type: 'danger',
              message: response.message || t('api.error.message'),
            });
          }
        }
      } catch (err) {
        console.log('check_payment_status', err);
        if (isUnMounted) return;

        setError(true);
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      } finally {
        if (isUnMounted) return;
        intervalUpdater = setTimeout(checkPaymentStatus, 2000);
      }
    }

    checkPaymentStatus();

    return () => {
      isUnMounted = true;
      clearTimeout(intervalUpdater);
      checkPaymentStatusRequest.cancel();
    };
  }, []);

  const getTransactionData = useCallback(
    async (isOpenTransaction = false) => {
      getTransactionDataRequest.data = APIHandler.payment_cart_payment(
        siteId,
        cartId,
      );
      try {
        const response = await getTransactionDataRequest.promise();
        // console.log(response, siteId, cartId);
        if (response) {
          if (response.status === STATUS_SUCCESS) {
            if (response.data) {
              setTransactionData(response.data);
              if (isActiveWebview(response.data) && isOpenTransaction) {
                handleOpenTransaction(response.data);
              }
            }
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('api.error.message'),
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('api.error.message'),
          });
        }
      } catch (error) {
        console.log('get_transaction_data', error);
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isPaid],
  );

  const handleSavePhoto = async (dataURL) => {
    await saveImage(undefined, dataURL, 'png');
    setImageSavingLoading(false);
  };

  const onSaveQRCode = async () => {
    if (refQRCode.current) {
      const granted = await (appConfig.device.isIOS
        ? PhotoLibraryPermission.request()
        : PhotoLibraryPermission.requestWriteExternalAndroid());
      console.log(granted);
      if (granted) {
        setImageSavingLoading(true);
        refQRCode.current.toDataURL(async (dataURL) => {
          handleSavePhoto(dataURL);
        });
      } else {
        PhotoLibraryPermission.openPermissionAskingModal();
      }
    }
  };

  const handleBack = () => {
    setBackType(BACK_TYPE.POP);
    if (!isPaid) {
      openPopUp();
    } else {
      confirmPopUp(BACK_TYPE.POP);
    }
  };

  const handleBackHome = () => {
    setBackType(BACK_TYPE.BACK_HOME);
    if (!isPaid) {
      openPopUp();
    } else {
      confirmPopUp(BACK_TYPE.BACK_HOME);
    }
  };

  const openPopUp = () => {
    if (refPopup.current) {
      refPopup.current.open();
    }
  };

  const closePopUp = () => {
    if (refPopup.current) {
      refPopup.current.close();
    }
  };

  const confirmPopUp = (type = backType) => {
    closePopUp();

    switch (type) {
      case BACK_TYPE.POP:
        onPop();
        pop();
        break;
      case BACK_TYPE.BACK_HOME:
        store.resetCartData();
        replace(appConfig.routes.homeTab);
        break;
    }
  };

  const handleOpenTransaction = useCallback(
    (transData = transactionData) => {
      if (transData.url) {
        switch (transData?.payment_method?.gateway) {
          case PAYMENT_METHOD_GATEWAY.VNPAY:
            const vnPayMerchant = new VNPayMerchant();
            vnPayMerchant.show({
              isSandbox: !!transData.isSandbox,
              paymentUrl: transData.url,
              tmn_code: JSON.parse(
                store?.store_data?.config_vnpay_payment || '{}',
              )?.terminal_id,
            });
            break;
          default:
            push(
              appConfig.routes.modalWebview,
              {
                title: t('screen.transaction.mainTitle'),
                url: transData.url,
              },
              theme,
            );
            break;
        }
      } else {
        Alert.alert(t('payment:transaction.noPaymentInformation'));
      }
    },
    [transactionData],
  );

  const copyAccountNumber = (accountNumber) => {
    copyToClipboard(accountNumber);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTransactionData();
  };

  const renderQRCode = () => {
    return (
      !!transactionData?.data_qrcode && (
        <View style={styles.qrImageContainer}>
          <QRPayFrame>
            <QRCode
              value={transactionData.data_qrcode}
              size={appConfig.device.width * 0.5}
              getRef={refQRCode}
              quietZone={20}
              backgroundColor={theme.color.surface}
              color={theme.color.onSurface}
            />
          </QRPayFrame>
          <AppFilledButton
            typoProps={saveQRBtnTypoProps}
            hitSlop={HIT_SLOP}
            rounded={ButtonRoundedType.EXTRA_SMALL}
            style={styles.saveQRBtnContainer}
            onPress={onSaveQRCode}>
            {t('payment:transaction.saveQRCodeTitle')}
          </AppFilledButton>
        </View>
      )
    );
  };

  const renderTransactionInfo = () => {
    return transactionData.details.map((info, index) => {
      const tempInfo = {...info};
      tempInfo.rightTextStyle = styles.value;

      if (tempInfo.title_highlight) {
        tempInfo.titleStyle = {...tempInfo.titleStyle, ...styles.highlight};
      }
      if (tempInfo.title_special) {
        tempInfo.titleStyle = {...tempInfo.titleStyle, ...styles.special};
      }
      if (tempInfo.value_highlight) {
        tempInfo.rightTextStyle = {
          ...tempInfo.rightTextStyle,
          ...styles.highlight,
        };
      }
      if (tempInfo.value_special) {
        tempInfo.rightTextStyle = {
          ...tempInfo.rightTextStyle,
          ...styles.special,
        };
      }
      tempInfo.value = info.value_view;
      return (
        <HorizontalInfoItem
          key={index}
          containerStyle={infoContainerStyle}
          data={tempInfo}
        />
      );
    });
  };

  const renderPaymentInfo = () => {
    return transactionData.data_va.map((info, index) => {
      if (info.copy) {
        info.renderRight = (titleStyle) => {
          return (
            <AppFilledTonalButton
              rounded={ButtonRoundedType.SMALL}
              typoProps={copyInfoBtnTypoProps}
              style={styles.infoButtonContainer}
              onPress={() => copyAccountNumber(info.value)}>
              {info.value}
            </AppFilledTonalButton>
          );
        };
      }

      return (
        <HorizontalInfoItem
          key={index}
          containerStyle={infoContainerStyle}
          data={info}
        />
      );
    });
  };

  const renderBlockInfo = (title, renderChild = () => {}) => {
    return (
      <>
        <Typography type={TypographyType.LABEL_MEDIUM} style={infoTitleStyle}>
          {title}
        </Typography>
        {renderChild()}
      </>
    );
  };

  const renderNote = () => {
    return (
      !!transactionData?.note && (
        <Typography
          type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
          style={styles.note}>
          {transactionData.note}
        </Typography>
      )
    );
  };

  const renderStatusIcon = (titleStyle) => {
    return isError || isPaid ? (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name={isError ? 'exclamationcircle' : 'checkcircle'}
        style={[titleStyle, styles.statusIcon]}
      />
    ) : (
      <ActivityIndicator size="small" color={theme.color.white} />
    );
  };

  const renderPaidStatus = () => {
    return (
      <View style={{backgroundColor: theme.color.white}}>
        <Shimmer
          pauseDuration={3000}
          opacity={1}
          animationOpacity={0.6}
          highlightLength={0.5}
          animating
          style={{marginBottom: appConfig.device.isIOS ? -3 : 0}}>
          <Typography>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: isError
                    ? theme.color.danger
                    : isPaid
                    ? theme.color.success
                    : theme.color.warning,
                },
              ]}>
              <Typography
                onPrimary
                type={TypographyType.LABEL_SEMI_HUGE}
                style={styles.statusTitle}
                renderIconBefore={renderStatusIcon}>
                {isError
                  ? t('payment:transaction.statusErrorTitlet')
                  : isPaid
                  ? t('payment:transaction.statusSuccessTitle')
                  : t('payment:transaction.statusInProgressTitle')}
              </Typography>
            </View>
          </Typography>
        </Shimmer>
      </View>
    );
  };

  const backHomeBtnContainerStyle = useMemo(() => {
    return mergeStyles(styles.btnContainer, {
      ...(appConfig.device.isIOS && theme.layout.shadow),
      shadowColor: theme.color.shadow,
      borderTopWidth: appConfig.device.isAndroid
        ? theme.layout.borderWidthPixel
        : 0,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const infoContainerStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    };
  }, [theme]);

  const infoTitleStyle = useMemo(() => {
    return mergeStyles(styles.infoTitle, {
      backgroundColor: theme.color.contentBackgroundWeak,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      <NavBar onClose={handleBack} navigation={props} />

      {isLoading || (isImageSavingLoading && <Loading center />)}
      <Container flex noBackground>
        {renderPaidStatus()}

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {renderQRCode()}

          {!!transactionData?.data_va?.length &&
            renderBlockInfo(
              t('payment:transaction.paymentInformationTitle'),
              renderPaymentInfo,
            )}
          {!!transactionData?.details?.length &&
            renderBlockInfo(
              t('payment:transaction.transactionInformationTitle'),
              renderTransactionInfo,
            )}
          {renderNote()}
        </ScrollView>

        <Container
          safeLayout
          noBackground
          row
          style={backHomeBtnContainerStyle}>
          <Button
            containerStyle={styles.confirmBtn}
            onPress={handleBackHome}
            title={t('payment:transaction.backHomeTitle')}
          />
          {!!isActiveWebview() && (
            <Button
              containerStyle={styles.confirmBtn}
              onPress={() => handleOpenTransaction()}
              title={t('payment:transaction.openWebviewTitle')}
            />
          )}
        </Container>
      </Container>
      <PopupConfirm
        ref_popup={(ref) => (refPopup.current = ref)}
        title={t('payment:transaction.cancelTransactionWarningTitle')}
        type="warning"
        noConfirm={closePopUp}
        yesConfirm={() => confirmPopUp()}
      />
    </ScreenWrapper>
  );
};

export default React.memo(Transaction);
