import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  imgContainer: {
    width: 120,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderRadius: 8,
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
    fontSize: 16,
    marginBottom: appConfig.device.isIOS ? 3 : 0,
    color: '#444',
    fontWeight: '500',
  },
  subTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  highlight: {
    fontSize: 18,
    color: '#404040',
    fontWeight: 'bold',
    marginBottom: appConfig.device.isIOS ? 2 : -2,
  },
  description: {
    color: '#888',
    fontSize: 14,
    fontWeight: '400',
  },
  note: {
    color: '#888',
    fontSize: 14,
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
  imageContainerStyle = {},
  headerStyle = {},
}) => {
  const {t} = useTranslation('product');

  return (
    <>
      <View style={[styles.header, headerStyle]}>
        <View
          style={[
            styles.imgContainer,
            imageUri || {
              backgroundColor: '#eee',
            },
            imageContainerStyle
          ]}>
          <CachedImage mutable source={{uri: imageUri}} style={styles.image} />
        </View>

        <View style={styles.info}>
          <View style={{marginBottom: 10}}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={subTitleNumberOfLines} style={styles.note}>
              {subTitle}
            </Text>
          </View>
          <View>
            {!!discountPrice && (
              <Text style={[styles.note, styles.deleteText]}>
                {discountPrice}
              </Text>
            )}
            {!!price && (
              <Text style={styles.highlight}>
                {price}
                {!!unitName && (
                  <Text style={styles.description}>/ {unitName}</Text>
                )}
              </Text>
            )}
            {!!inventory && (
              <Text style={styles.note}>
                {`${t('attr.stock')}:`} <Text>{inventory}</Text>
              </Text>
            )}
            {extraInfoComponent}
          </View>
        </View>
      </View>
    </>
  );
};

export default React.memo(ProductInfo);
