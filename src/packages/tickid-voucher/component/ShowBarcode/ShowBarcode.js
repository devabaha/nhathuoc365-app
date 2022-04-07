import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {useTranslation} from 'react-i18next';
import Barcode from 'react-native-barcode-builder';
// configs
import config from '../../config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import CampaignEntity from '../../entity/CampaignEntity';
// custom components
import {Card, ScreenWrapper, Typography} from 'src/components/base';
import Image from 'src/components/Image';

const BARCODE_FORMAT = 'CODE128';

function ShowBarcode({voucher, code}) {
  const {t} = useTranslation('voucher');

  const {theme} = useTheme();

  const barCodeWrapperStyle = useMemo(() => {
    return mergeStyles(styles.barCodeWrapper, {
      borderWidth: theme.layout.borderWidth,
      borderRadius: theme.layout.borderRadiusMedium,
      borderColor: theme.color.onSurface,
    });
  }, [theme]);

  const shopAvatarStyle = useMemo(() => {
    return mergeStyles(styles.shopAvatar, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  return (
    <ScreenWrapper style={styles.container}>
      <Card style={styles.cardWrapper}>
        <View style={styles.headerWrapper}>
          <Typography
            type={TypographyType.TITLE_MEDIUM}
            style={styles.shopName}>
            {voucher.data.shop_name}
          </Typography>
          <Image
            style={shopAvatarStyle}
            source={{uri: voucher.data.shop_logo_url}}
          />
        </View>

        <View style={barCodeWrapperStyle}>
          <Card noBackground style={styles.barCodeContainer}>
            <Barcode
              lineColor={theme.color.onSurface}
              background={theme.color.surface}
              width={2}
              height={60}
              value={code}
              format={BARCODE_FORMAT}
            />
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.barcodeValue}>
              {code}
            </Typography>
          </Card>
        </View>
      </Card>

      <View style={styles.guideWrapper}>
        <Typography
          type={TypographyType.LABEL_SEMI_LARGE}
          style={styles.guideText}>
          {t('voucher:detail.descriptionShowBarcode')}
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  cardWrapper: {
    width: config.device.width - 24,
    padding: 15,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  shopName: {
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 8,
  },
  shopAvatar: {
    width: 48,
    height: 48,
  },
  barCodeWrapper: {
    padding: 8,
  },
  barCodeContainer: {
    overflow: 'hidden',
    paddingTop: 8,
  },
  barcodeValue: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  guideWrapper: {
    paddingVertical: 15,
  },
  guideText: {
    fontWeight: '400',
    lineHeight: 22,
  },
});

ShowBarcode.propTypes = {
  code: PropTypes.string.isRequired,
  voucher: PropTypes.instanceOf(CampaignEntity).isRequired,
};

ShowBarcode.defaultProps = {
  code: undefined,
  voucher: undefined,
};

export default ShowBarcode;
