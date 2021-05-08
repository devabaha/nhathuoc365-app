import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import APIHandler from '../../network/APIHandler';
import {APIRequest} from '../../network/Entity';
import appConfig from 'app-config';
import Loading from '../../components/Loading';
import ProductStamp from './ProductStamp';
import {Actions} from 'react-native-router-flux';
import NoResult from '../../components/NoResult';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  btnScanQrProduct: {
    backgroundColor: appConfig.colors.white,
    justifyContent: 'center',
  },
  iconScanQrProduct: {
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
    Actions.push(appConfig.routes.qrBarCode, {
      title: t('screen.qrBarCode.scanTitle'),
      index: 1,
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
        <Button
          containerStyle={styles.btnScanQrProduct}
          onPress={goToScanQR}
          title="Quét mã sản phẩm"
          iconLeft={
            <Icon
              name="scan"
              color="white"
              size={24}
              style={styles.iconScanQrProduct}
            />
          }
        />
    </>
  );
};

export default ProductStamps;
