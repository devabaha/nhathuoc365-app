import React, {useEffect, useRef, useState, useMemo} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
// helpers
import {isDarkTheme, mergeStyles} from 'src/Themes/helper';
import {hexToRgba} from 'app-helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import {Typography, Container} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  maskContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  mask: {
    flex: 1,
  },
  maskHighlight: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: [{scale: 1.5}],
  },
  titleWrapper: {
    paddingTop: 12,
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
    fontWeight: '600',
    flex: 1,
  },
});

const PaymentMethodSection = ({
  isUnpaid,
  cartData,
  onPressChange = () => {},
}) => {
  const {theme} = useTheme();

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

  const maskThemeStyle = useMemo(() => {
    return mergeStyles(styles.mask, {
      backgroundColor: hexToRgba(
        theme.color.primaryHighlight,
        isDarkTheme(theme) ? 0.15 : 0.05,
      ),
      borderColor: theme.color.primaryHighlight,
      borderTopWidth: theme.layout.borderWidth,
      borderBottomWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  const maskHighlightStyle = useMemo(() => {
    return mergeStyles(styles.maskHighlight, {
      backgroundColor: hexToRgba(theme.color.primaryHighlight, 0.2),
    });
  }, [theme]);

  const placeholderStyle = useMemo(() => {
    return {color: theme.color.placeholder};
  }, [theme]);

  return (
    <SectionContainer
      marginTop
      style={[styles.container, {backgroundColor: theme.color.surface}]}
      title={t('confirm.paymentMethod.title')}
      iconName="dollar-sign"
      actionBtnTitle={!!isUnpaid && t('confirm.change')}
      onPressActionBtn={onPressChange}>
      <View pointerEvents="none" style={styles.maskContainer}>
        <View style={maskThemeStyle} />
        <Container
          noBackground
          animated
          style={[maskHighlightStyle, maskStyle.current]}
        />
      </View>

      <View>
        <Container noBackground row style={styles.descriptionContainer}>
          {!!cartData ? (
            <View style={styles.paymentMethodContainer}>
              {!!cartData?.payment_method_detail?.image && (
                <Image
                  mutable
                  source={{
                    uri: cartData.payment_method_detail.image,
                  }}
                  style={styles.imagePaymentMethod}
                />
              )}
              {!!cartData?.payment_method?.name && (
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={[styles.descriptionTitle]}>
                  {cartData.payment_method.name}
                </Typography>
              )}
            </View>
          ) : (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={placeholderStyle}>
              {t('confirm.paymentMethod.unselected')}
            </Typography>
          )}
        </Container>
      </View>
    </SectionContainer>
  );
};

export default React.memo(PaymentMethodSection);
