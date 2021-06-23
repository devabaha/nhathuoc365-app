import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import APIHandler from '../../network/APIHandler';
import {APIRequest} from '../../network/Entity';
import appConfig from 'app-config';
import Loading from '../../components/Loading';
import ProductStamp from './ProductStamp';
import {Actions} from 'react-native-router-flux';
import NoResult from '../../components/NoResult';
import Button from 'react-native-button';
import IonicsIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  getVoucherWrapper: {
    backgroundColor: appConfig.colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7.5,
    paddingTop: 10,
    paddingBottom: appConfig.device.bottomSpace + 10,
  },
  getVoucherBtn: {
    flex: 1,
    backgroundColor: appConfig.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 7.5,
    paddingHorizontal: 12,
  },
  getVoucherTitle: {
    color: appConfig.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
  btnContentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: appConfig.colors.white,
    marginRight: 10,
  },
});

const ProductStamps = () => {
  const getProductStampsRequest = new APIRequest();
  const requests = [getProductStampsRequest];
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [productStamps, setProductStamps] = useState([]);
  const {t} = useTranslation();

  useEffect(() => {
    getProductStamps();

    return () => {
      cancelRequests(requests);
    };
  }, []);

  const getProductStamps = async () => {
    getProductStampsRequest.data = APIHandler.user_get_product_stamps();
    try {
      const response = await getProductStampsRequest.promise();

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          setProductStamps(response.data || []);
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
    } catch (err) {
      console.log('get_product_stamps', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePressProductStamp = (product) => {
    Actions.push(appConfig.routes.item, {
      item: product,
      title: product?.name,
      preventUpdate: true,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getProductStamps();
  };

  const renderProductStamp = ({item: product, index}) => {
    return (
      <ProductStamp
        onPress={() => handlePressProductStamp(product)}
        name={product?.name}
        activeTime={product?.stamp?.active_time}
        qrcode={product?.stamp?.qrcode}
        image={product?.image}
      />
    );
  };

  const goToScanQR = () => {
    Actions.push(appConfig.routes.qrBarCodeInputable, {
      title: t('screen.qrBarCode.scanTitle'),
      isVisibleBtnEnterCode: true,
      index: 1,
      refreshMyVoucher: () => {
        this.getProductStamps();
      },
      onCloseEnterCode: () => {
        if (isEnterCode) {
          Actions.pop();
        }
      },
    });
  };

  const enterCodeProduct = ({onSendCode}) => {
    Actions.push(appConfig.routes.qrBarCodeInputable, {
      title: t('screen.qrBarCode.scanTitle'),
      isVisibleBtnEnterCode: true,
      index: 1,
      isEnterCode: true,
      refreshMyVoucher: () => {
        this.getProductStamps();
      },
      onCloseEnterCode: () => {
        Actions.pop();
      },
      onSendCode: (code) => {
        setTimeout(() => {
          Actions.pop();
          setTimeout(() => onSendCode(code), 0);
        }, 0);
      },
    });
  };

  return (
    <>
      {isLoading && <Loading center />}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{flexGrow: 1}}
        data={productStamps || []}
        renderItem={renderProductStamp}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          !isLoading && (
            <NoResult
              iconName="package-variant"
              message="Bạn chưa nhận sản phẩm nào"
            />
          )
        }
      />
      <View style={styles.getVoucherWrapper}>
        <Button
          containerStyle={styles.getVoucherBtn}
          style={styles.getVoucherTitle}
          icon
          onPress={enterCodeProduct}>
          <View style={styles.btnContentContainer}>
            <MaterialIcons name="text-fields" style={styles.icon} />
            <Text style={styles.getVoucherTitle}>
              {t('common:screen.qrBarCode.enterCode')}
            </Text>
          </View>
        </Button>
        <Button
          containerStyle={styles.getVoucherBtn}
          style={styles.getVoucherTitle}
          onPress={goToScanQR}>
          <View style={styles.btnContentContainer}>
            <IonicsIcon name="scan" style={styles.icon} />
            <Text style={styles.getVoucherTitle}>
              {t('common:screen.qrBarCode.scanCode')}
            </Text>
          </View>
        </Button>
      </View>
    </>
  );
};

export default ProductStamps;
