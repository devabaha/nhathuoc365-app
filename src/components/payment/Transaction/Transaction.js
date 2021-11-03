import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Actions} from 'react-native-router-flux';
import Shimmer from 'react-native-shimmer';
import QRCode from 'react-native-qrcode-svg';

import appConfig from 'app-config';
import store from 'app-store';

import {PhotoLibraryPermission} from '../../../helper/permissionHelper';
import {CART_PAYMENT_STATUS} from '../../../constants/cart/types';

import {APIRequest} from '../../../network/Entity';

import HorizontalInfoItem from '../../../components/account/HorizontalInfoItem';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import Container from '../../../components/Layout/Container';
import PopupConfirm from '../../../components/PopupConfirm';
import QRPayFrame from './QRPayFrame';
import NavBar from './NavBar';
import {saveImage} from 'app-helper/image';
import VNPayMerchant from 'app-helper/VNPayMerchant/VNPayMerchant';
import {PAYMENT_METHOD_GATEWAY} from 'src/constants/payment/types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  statusContainer: {
    width: appConfig.device.width,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    color: '#fff',
    fontSize: 22,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 15,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  qrImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: appConfig.device.width * 0.4,
    height: appConfig.device.width * 0.4,
    margin: 20,
    maxWidth: 200,
    maxHeight: 200,
  },
  saveQRBtnContainer: {
    marginBottom: 30,
    borderRadius: 4,
    width: undefined,
    alignSelf: 'center',
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
  saveQRBtnContentContainer: {
    backgroundColor: appConfig.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 7,
    width: undefined,
    borderRadius: 4,
  },
  saveQRBtnContent: {
    paddingVertical: 0,
    textAlign: 'center',
  },
  saveQRCodeIcon: {
    color: '#fff',
    fontSize: 14,
    marginRight: 7,
  },
  saveQRBtnTitle: {
    color: '#fff',
    fontSize: 12,
  },

  infoContainer: {
    borderBottomWidth: Util.pixel,
    borderColor: '#ccc',
    // backgroundColor: '#fafafa',
  },
  infoTitle: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 3,
    color: '#333',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
    color: '#242424',
    padding: 15,
    fontStyle: 'italic',
    fontSize: 13,
  },

  btnContainer: {
    backgroundColor: '#fff',
    backgroundColor: '#fff',
    ...(appConfig.device.isIOS && elevationShadowStyle(7)),
    paddingVertical: 10,
    borderTopWidth: appConfig.device.isAndroid ? appConfig.device.pixel : 0,
    borderColor: appConfig.colors.border,
  },
  confirmBtn: {
    flex: 1,
    width: undefined,
  },
  backHomeContainer: {
    backgroundColor: '#e5e5e5',
  },
  backHomeTitle: {
    color: '#333',
  },
});

const SAVE_QR_CODE_TITLE = 'Lưu ảnh mã QR';

const STATUS_SUCCESS_TITLE = 'Thanh toán thành công';
const STATUS_INPROGRESS_TITLE = 'Đang chờ thanh toán...';
const STATUS_ERROR_TITLE = 'Lỗi kiểm tra giao dịch';

const OPEN_WEBVIEW_TITLE = 'Mở thanh toán';
const BACK_HOME_TITLE = 'Về trang chủ';

const CANCEL_TRANSACTION_WARNING_TITLE =
  'Bạn có chắc chắn muốn thanh toán giao dịch này vào lúc khác?';

const BACK_TYPE = {
  POP: 0,
  BACK_HOME: 1,
};

const Transaction = ({
  siteId = store?.store_data?.id,
  cartId = store?.cart_data?.id,
  onPop = () => {},
}) => {
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

  const isActiveWebview = () => !transactionData?.data_qrcode && !isPaid;

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
                Actions.pop();
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

  const getTransactionData = useCallback(async (isOpenTransaction = false) => {
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
            if (
              !response.data.data_qrcode &&
              response.data.url &&
              isOpenTransaction
            ) {
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
  }, []);

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
        Actions.pop();
        break;
      case BACK_TYPE.BACK_HOME:
        store.resetCartData();
        Actions.replace(appConfig.routes.homeTab);
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
            Actions.push(appConfig.routes.modalWebview, {
              title: t('screen.transaction.mainTitle'),
              url: transData.url,
            });
            break;
        }
      } else {
        Alert.alert(t('transaction.noPaymentInformation'));
      }
    },
    [transactionData],
  );

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
            />
          </QRPayFrame>
          <Button
            hitSlop={HIT_SLOP}
            containerStyle={styles.saveQRBtnContainer}
            btnContainerStyle={styles.saveQRBtnContentContainer}
            onPress={onSaveQRCode}
            iconLeft={
              <AntDesignIcon name="download" style={styles.saveQRCodeIcon} />
            }
            renderTitleComponent={() => (
              <Text style={[styles.saveQRBtnTitle, styles.saveQRBtnContent]}>
                {SAVE_QR_CODE_TITLE}
              </Text>
            )}
          />
        </View>
      )
    );
  };

  const renderInfo = () => {
    return transactionData?.details?.map((info, index) => {
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
          containerStyle={styles.infoContainer}
          data={tempInfo}
        />
      );
    });
  };

  const renderNote = () => {
    return (
      !!transactionData?.note && (
        <Text style={styles.note}>{transactionData.note}</Text>
      )
    );
  };

  const renderPaidStatus = () => {
    return (
      <Shimmer
        pauseDuration={3000}
        opacity={1}
        animationOpacity={0.6}
        highlightLength={0.5}
        animating>
        <Text>
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: isError
                  ? appConfig.colors.status.danger
                  : isPaid
                  ? appConfig.colors.status.success
                  : appConfig.colors.status.warning,
              },
            ]}>
            {isError || isPaid ? (
              <AntDesignIcon
                name={isError ? 'exclamationcircle' : 'checkcircle'}
                style={styles.statusIcon}
              />
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
            <Text style={styles.statusTitle}>
              {isError
                ? STATUS_ERROR_TITLE
                : isPaid
                ? STATUS_SUCCESS_TITLE
                : STATUS_INPROGRESS_TITLE}
            </Text>
          </View>
        </Text>
      </Shimmer>
    );
  };

  return (
    <>
      <NavBar
        title={t('screen.transaction.paymentTitle')}
        onClose={handleBack}
      />

      <ScreenWrapper containerStyle={styles.container}>
        {/* <BlurFilter visible={isLoading} /> */}
        {isLoading ||
          (isImageSavingLoading && (
            <Loading
              center
              // highlight={isLoading}
              // message={isLoading && SAVE_IMAGE_MESSAGE}
            />
          ))}
        {renderPaidStatus()}

        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {renderQRCode()}

          <Text style={styles.infoTitle}>Thông tin giao dịch</Text>
          {renderInfo()}
          {renderNote()}
        </ScrollView>

        <Container row style={styles.btnContainer}>
          <Button
            containerStyle={styles.confirmBtn}
            btnContainerStyle={styles.backHomeContainer}
            titleStyle={styles.backHomeTitle}
            onPress={handleBackHome}
            title={BACK_HOME_TITLE}
          />
          {!!isActiveWebview() && (
            <Button
              containerStyle={styles.confirmBtn}
              onPress={() => handleOpenTransaction()}
              title={OPEN_WEBVIEW_TITLE}
            />
          )}
        </Container>

        <PopupConfirm
          ref_popup={(ref) => (refPopup.current = ref)}
          title={CANCEL_TRANSACTION_WARNING_TITLE}
          type="warning"
          noConfirm={closePopUp}
          yesConfirm={() => confirmPopUp()}
          isConfirm
        />
      </ScreenWrapper>
    </>
  );
};

export default React.memo(Transaction);
