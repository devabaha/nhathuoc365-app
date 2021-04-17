import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Actions} from 'react-native-router-flux';
import CameraRoll from '@react-native-community/cameraroll';
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
import Loading, {BlurFilter} from '../../../components/Loading';
import Container from '../../../components/Layout/Container';
import PopupConfirm from '../../../components/PopupConfirm';
import QRCodeFrame from './QRCodeFrame/QRCodeFrame';

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
    backgroundColor: '#fafafa',
  },
  title: {},
  value: {
    //   color: '#444'
  },
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
    ...elevationShadowStyle(7),
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

const DELAY_REQUEST_TIME = 2000;
const MAX_ERROR_REQUEST_TIME = 3;

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
  const {t} = useTranslation();
  const test_data = [
    {
      title: 'Số tiền',
      value: '32.000đ',
      value_highlight: true,
      value_special: true,
    },
    {
      title: 'Mã giao dịch',
      value: 'cjzivubalDNJCnjciIUNC-VJDA',
      title_highlight: true,
    },
    {
      title: 'Phương thức',
      value: 'Thẻ ATM nội địa',
    },
    {
      title: 'Tên ngân hàng',
      value: 'MBBank',
    },
    {
      title: 'Số tài khoản',
      value: '8859207534753234',
    },
    {
      title: 'Tên tài khoản',
      value: 'Nguyễn Hoàng Minh',
    },
  ];
  const image =
    'https://i.pinimg.com/originals/f8/0b/e9/f80be9fd0d57a07357d551e87e97e34b.jpg';
  const note =
    'Chú ý: Quý khách vui lòng chuyển khoản đúng số tiền trên. Chuyển sai số tiền ngân hàng sẽ báo kết nối lỗi.';

  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPaid, setPaid] = useState(false);
  const [isError, setError] = useState(false);

  const [transactionData, setTransactionData] = useState();

  const [backType, setBackType] = useState(BACK_TYPE.POP);
  const [isImageSavingLoading, setImageSavingLoading] = useState(false);

  const checkPaymentStatusRequest = new APIRequest();
  const getTransactionDataRequest = new APIRequest();
  const requests = [checkPaymentStatusRequest, getTransactionDataRequest];
  const intervalUpdater = useRef();
  const errorRequestTime = useRef(1);
  const refPopup = useRef(null);
  const refQRCode = useRef();

  useEffect(() => {
    Actions.refresh({
      onBack: handleBack,
    });
  }, [isPaid]);

  useEffect(() => {
    getTransactionData();
    checkPaymentStatus();

    return () => {
      clearTimeout(intervalUpdater.current);
      cancelRequests(requests);
    };
  }, []);

  const handleRemakeRequest = (time = 1) => {
    errorRequestTime.current = time;

    checkPaymentStatusRequest.cancel();
    clearTimeout(intervalUpdater.current);

    if (errorRequestTime.current <= MAX_ERROR_REQUEST_TIME) {
      intervalUpdater.current = setTimeout(() => {
        checkPaymentStatus();
      }, DELAY_REQUEST_TIME);
    } else {
      setError(true);
    }
  };

  const getTransactionData = async () => {
    getTransactionDataRequest.data = APIHandler.payment_cart_payment(
      siteId,
      cartId,
    );

    try {
      const response = await getTransactionDataRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setTransactionData(response.data);
            if (response.data.url) {
              // handleOpenTransaction(response.data.url);
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
  };

  const checkPaymentStatus = async () => {
    checkPaymentStatusRequest.data = APIHandler.cart_payment_status(
      siteId,
      cartId,
    );
    try {
      const response = await checkPaymentStatusRequest.promise();

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            // if (response.data.cart) {
            //   store.setCartData(response.data.cart);
            // }
            switch (response.data.status) {
              case CART_PAYMENT_STATUS.PAID:
                if (
                  Actions.currentScene === `${appConfig.routes.modalWebview}_1`
                ) {
                  Actions.pop();
                }
                setPaid(true);
                break;
              case CART_PAYMENT_STATUS.CANCEL:
                setError(true);
                break;
              default:
                setLoading(false);
                break;
            }
          }
          // handleRemakeRequest();
          // return;
          setError(false);
        } else {
          setError(true);

          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        setError(true);

        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
      // handleRemakeRequest(errorRequestTime.current++);
    } catch (err) {
      console.log('check_payment_status', err);
      // handleRemakeRequest(errorRequestTime.current++);
      setError(true);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      handleRemakeRequest();
    }
  };

  const onSaveQRCode = async () => {
    if (refQRCode.current) {
      const granted = await PhotoLibraryPermission.request();
      if (granted) {
        setImageSavingLoading(true);
        refQRCode.current.toDataURL((dataURL) => {
          console.log(dataURL);
          CameraRoll.save('data:image/png;base64,' + dataURL, {type: 'photo'})
            .then((res) => {
              console.log(res);
              if (res) {
                flashShowMessage({
                  type: 'success',
                  message: 'Lưu ảnh thành công',
                });
              }
            })
            .catch((err) => {
              flashShowMessage({
                type: 'danger',
                message: t('api.error.message'),
              });
              console.log('err_save_qr_code', err);
            })
            .finally(() => {
              setImageSavingLoading(false);
            });
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

  const handleOpenTransaction = (url = transactionData?.url) => {
    if (url) {
      Actions.push(appConfig.routes.modalWebview, {
        title: t('screen.transaction.mainTitle'),
        url,
      });
    } else {
      Alert.alert('Chưa có link thanh toán');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTransactionData();
  };

  const renderQRCode = () => {
    return (
      !!transactionData?.data_qrcode && (
        <View style={styles.qrImageContainer}>
          <QRCodeFrame>
            <QRCode
              value={transactionData.data_qrcode}
              size={appConfig.device.width * 0.5}
              getRef={refQRCode}
              quietZone={20}
            />
          </QRCodeFrame>
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
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {renderPaidStatus()}
        {renderQRCode()}
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
        {!isPaid && (
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
  );
};

export default React.memo(Transaction);
