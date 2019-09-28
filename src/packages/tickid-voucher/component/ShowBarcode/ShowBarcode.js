import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import CampaignEntity from '../../entity/CampaignEntity';
import Barcode from 'react-native-barcode-builder';

const BARCODE_FORMAT = 'CODE128';

function ShowBarcode({ voucher, code }) {
  const [barCodeBorderColor] = useState(new Animated.Value(0));
  let toggle = true;

  const startAnimation = () => {
    if (toggle) {
      toggle = false;
    } else {
      toggle = true;
    }
    Animated.timing(barCodeBorderColor, {
      toValue: toggle ? 150 : 0,
      duration: 1500
    }).start(startAnimation);
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const interpolateColor = barCodeBorderColor.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgb(255, 255, 255)', 'rgb(48, 62, 93)']
  });
  const animatedStyle = {
    borderColor: interpolateColor
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.shopName}>{voucher.data.shop_name}</Text>
          <Image
            style={styles.shopAvatar}
            source={{ uri: voucher.data.shop_logo_url }}
          />
        </View>

        <Animated.View style={[styles.barCodeWrapper, animatedStyle]}>
          <View style={styles.barCodeContainer}>
            <Barcode
              width={2}
              height={60}
              value={code}
              format={BARCODE_FORMAT}
            />
            <Text style={styles.barcodeValue}>{code}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.guideWrapper}>
        <Text style={styles.guideText}>
          Đưa mã Barcode cho nhân viên cửa hàng để nhận khuyến mại.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.white,
    marginBottom: config.device.bottomSpace
  },
  cardWrapper: {
    width: config.device.width - 24,
    marginTop: 26,
    marginHorizontal: 12,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#1f2b45'
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 8
  },
  shopName: {
    color: config.colors.white,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 8
  },
  shopAvatar: {
    width: 48,
    height: 48,
    borderRadius: 3
  },
  barCodeWrapper: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8
  },
  barCodeContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: config.colors.white,
    paddingTop: 8
  },
  barcodeValue: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12
  },
  guideWrapper: {
    padding: 16,
    marginTop: 4
  },
  guideText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#333',
    lineHeight: 22
  }
});

ShowBarcode.propTypes = {
  code: PropTypes.string.isRequired,
  voucher: PropTypes.instanceOf(CampaignEntity).isRequired
};

ShowBarcode.defaultProps = {
  code: undefined,
  voucher: undefined
};

export default ShowBarcode;
