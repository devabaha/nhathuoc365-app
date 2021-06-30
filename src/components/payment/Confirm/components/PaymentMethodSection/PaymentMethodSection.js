import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import SectionContainer from '../SectionContainer';

import appConfig from 'app-config';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1,
  },
  container: {
    paddingTop: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  mask: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.1),
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{scale: 1.5}],
  },
  contentContainer: {
    paddingTop: 0,
    paddingRight: 0,
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.05),
    borderColor: appConfig.colors.primary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  titleWrapper: {
    paddingTop: 12,
  },
  titleContainer: {},
  icon: {
    width: 15,
    color: '#999',
    fontSize: 15,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  actionTitle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  btnAction: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  changeTitle: {
    color: appConfig.colors.primary,
    fontSize: 12,
  },

  descriptionContainer: {
    marginTop: 12,
    marginLeft: 22,
  },
  imagePaymentMethod: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 7,
    marginRight: 10,
  },
  descriptionTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },

  placeholder: {
    color: '#999999',
  },
});

const PaymentMethodSection = ({
  isUnpaid,
  cartData,
  onPressChange = () => {},
}) => {
  const {t} = useTranslation('orders');
  const [animatedShow] = useState(new Animated.Value(0));
  const maskStyle = useRef({
    transform: [
      {
        scaleY: animatedShow.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
    opacity: animatedShow.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1, 0],
    }),
  });

  useEffect(() => {
    Animated.timing(animatedShow, {
      toValue: 1,
      delay: 200,
      duration: 300,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={styles.wrapper}>
      <Animated.View style={[styles.mask, maskStyle.current]} />

      <View style={styles.container}>
        <SectionContainer
          style={styles.contentContainer}
          title={t('confirm.paymentMethod.title')}
          iconName="dollar-sign"
          actionBtnTitle={!!isUnpaid && t('confirm.change')}
          onPressActionBtn={onPressChange}>
          <View>
            <Container row style={styles.descriptionContainer}>
              {!!cartData ? (
                <View style={styles.paymentMethodContainer}>
                  {!!cartData?.payment_method_detail?.image && (
                    // <CachedImage
                    //   mutable
                    //   source={{uri: cart_data.payment_method.image}}
                    //   style={styles.imagePaymentMethod}
                    // />
                    <CachedImage
                      mutable
                      source={{
                        uri: cartData.payment_method_detail.image,
                      }}
                      style={styles.imagePaymentMethod}
                    />
                  )}
                  {!!cartData?.payment_method?.name && (
                    <Text style={[styles.descriptionTitle]}>
                      {cartData.payment_method.name}
                    </Text>
                  )}
                  {/* {!!cartData?.payment_method_detail?.image && (
                        <CachedImage
                          mutable
                          source={{
                            uri: cartData?.payment_method_detail?.image,
                          }}
                          style={[
                            styles.imagePaymentMethod,
                            styles.imagePaymentMethodDetail,
                          ]}
                        />
                      )} */}
                </View>
              ) : (
                <Text style={styles.placeholder}>
                  {t('confirm.paymentMethod.unselected')}
                </Text>
              )}
            </Container>
          </View>
        </SectionContainer>
      </View>
    </Animated.View>
  );
};

export default React.memo(PaymentMethodSection);
