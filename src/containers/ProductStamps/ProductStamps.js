import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {push, pop} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {
  ScreenWrapper,
  Container,
  Typography,
  Icon,
  FlatList,
  RefreshControl,
} from 'src/components/base';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import ProductStamp from './ProductStamp';

const styles = StyleSheet.create({
  getVoucherWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  getVoucherBtn: {
    flex: 1,
  },
  getVoucherTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  btnContentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
});

const ProductStamps = ({navigation}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const getProductStampsRequest = new APIRequest();
  const requests = [getProductStampsRequest];
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [productStamps, setProductStamps] = useState([]);

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

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
      console.log('res', response);
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
    push(appConfig.routes.item, {
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
    push(
      appConfig.routes.qrBarCodeInputable,
      {
        title: t('screen.qrBarCode.scanTitle'),
        isVisibleBtnEnterCode: true,
        index: 1,
        refreshMyVoucher: () => {
          this.getProductStamps();
        },
        onCloseEnterCode: () => {
          if (isEnterCode) {
            pop();
          }
        },
      },
      theme,
    );
  };

  const enterCodeProduct = ({onSendCode}) => {
    push(
      appConfig.routes.qrBarCodeInputable,
      {
        title: t('screen.qrBarCode.scanTitle'),
        isVisibleBtnEnterCode: true,
        index: 1,
        isEnterCode: true,
        refreshMyVoucher: () => {
          this.getProductStamps();
        },
        onCloseEnterCode: () => {
          pop();
        },
        onSendCode: (code) => {
          setTimeout(() => {
            pop();
            setTimeout(() => onSendCode(code), 0);
          }, 0);
        },
      },
      theme,
    );
  };

  const renderTitleBtnEnterCode = (titleStyle) => {
    return (
      <View style={styles.btnContentContainer}>
        <Icon
          bundle={BundleIconSetName.MATERIAL_ICONS}
          name="text-fields"
          style={[titleStyle, styles.icon]}
        />
        <Typography
          type={TypographyType.TITLE_MEDIUM}
          style={[styles.getVoucherTitle, titleStyle]}>
          {t('common:screen.qrBarCode.enterCode')}
        </Typography>
      </View>
    );
  };

  const renderTitleBtnScanCode = (titleStyle) => {
    return (
      <View style={styles.btnContentContainer}>
        <Icon
          bundle={BundleIconSetName.IONICONS}
          name="scan"
          style={[titleStyle, styles.icon]}
        />
        <Typography
          type={TypographyType.TITLE_MEDIUM}
          style={[styles.getVoucherTitle, titleStyle]}>
          {t('common:screen.qrBarCode.scanCode')}
        </Typography>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}
      <FlatList
        data={productStamps || []}
        renderItem={renderProductStamp}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          !isLoading && (
            <NoResult
              iconName="package-variant"
              message={t('productStamp:noResult')}
            />
          )
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
      <Container safeLayout style={styles.getVoucherWrapper}>
        <Button
          containerStyle={styles.getVoucherBtn}
          onPress={enterCodeProduct}
          renderTitleComponent={renderTitleBtnEnterCode}
        />
        <Button
          containerStyle={styles.getVoucherBtn}
          onPress={goToScanQR}
          renderTitleComponent={renderTitleBtnScanCode}
        />
      </Container>
    </ScreenWrapper>
  );
};

export default withTranslation(['productStamp', 'common'])(ProductStamps);
