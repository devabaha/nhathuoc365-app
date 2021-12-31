import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import Image from 'src/components/Image';
import {Container, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  imgContainer: {
    width: 120,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  info: {
    justifyContent: 'space-between',
    marginRight: 15,
    flex: 1,
  },
  title: {
    marginBottom: appConfig.device.isIOS ? 3 : 0,
    fontWeight: '500',
  },
  highlight: {
    fontWeight: 'bold',
    marginBottom: appConfig.device.isIOS ? 2 : -2,
  },
  description: {
    fontWeight: '400',
  },
  deleteText: {
    textDecorationLine: 'line-through',
    marginTop: 4,
    marginBottom: appConfig.device.isIOS ? 2 : 0,
  },
});

const ProductInfo = ({
  imageUri,
  title,
  subTitle,
  subTitleNumberOfLines = 1,
  discountPrice,
  price,
  unitName,
  inventory,
  extraInfoComponent = null,
  imageContainerStyle: imageContainerStyleProp = {},
  headerStyle: headerStyleProp = {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('product');

  const imageContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.imgContainer,
        imageUri || {
          backgroundColor: theme.color.contentBackground,
        },
      ],
      imageContainerStyleProp,
    );
  }, [theme, imageContainerStyleProp, imageUri]);

  const headerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.header,
        {
          borderBottomWidth: theme.layout.borderWidth,
          borderColor: theme.color.border,
        },
      ],
      headerStyleProp,
    );
  }, [theme, headerStyleProp]);

  return (
    <>
      <Container style={headerStyle}>
        <View style={imageContainerStyle}>
          <Image
            canTouch
            resizeMode="contain"
            source={{uri: imageUri}}
            style={styles.image}
          />
        </View>

        <View style={styles.info}>
          <View style={{marginBottom: 10}}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              numberOfLines={2}
              style={styles.title}>
              {title}
            </Typography>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM}
              numberOfLines={subTitleNumberOfLines}>
              {subTitle}
            </Typography>
          </View>
          <View>
            {!!discountPrice && (
              <Typography
                type={TypographyType.DESCRIPTION_MEDIUM}
                style={styles.deleteText}>
                {discountPrice}
              </Typography>
            )}
            {!!price && (
              <Typography
                type={TypographyType.LABEL_HUGE}
                style={styles.highlight}>
                {price}
                {!!unitName && (
                  <Typography
                    type={TypographyType.LABEL_MEDIUM_TERTIARY}
                    style={styles.description}>
                    / {unitName}
                  </Typography>
                )}
              </Typography>
            )}
            {!!inventory && (
              <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                {`${t('attr.stock')}:`} {inventory}
              </Typography>
            )}
            {extraInfoComponent}
          </View>
        </View>
      </Container>
    </>
  );
};

export default React.memo(ProductInfo);
