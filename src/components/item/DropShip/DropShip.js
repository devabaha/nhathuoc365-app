import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {TypographyType} from 'src/components/base';
// custom components
import NumberSelection from 'src/components/stores/NumberSelection';
import {Container, Input, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  row: {
    paddingVertical: 12,
  },
  newPriceTitleContainer: {
    flex: 1,
  },
  title: {
    letterSpacing: 0.5,
    flex: 1,
    paddingRight: 10,
  },
  note: {
    fontStyle: 'italic',
    marginTop: 2,
  },
  value: {
    maxWidth: '50%',
  },
  quantityLabel: {
    flex: undefined,
  },
  quantityWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quantityContainer: {
    width: null,
    maxWidth: undefined,
  },
  quantityTxtContainer: {
    minWidth: 70,
    flex: undefined,
  },
  price: {
    fontWeight: '500',
    letterSpacing: 1,
  },
  newPriceContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newPriceInput: {
    minWidth: 113,
    textAlign: 'right',
    padding: 0,
  },
});

const DropShip = ({
  max,
  min = 1,
  disabled,
  price,
  priceView,
  currency = 'đ',
  quantity,
  listPrice,
  onChangeQuantity = () => {},
  onChangeNewPrice = () => {},
  onMinus = () => {},
  onPlus = () => {},
  onQuantityBlur = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('product');

  const priceFormatter = (price) => {
    const originPrice = Number(String(price).replace(/(?!\d+|-)\D*/g, ''));
    return numberFormat(originPrice);
  };

  const isFixDropShipPrice = () =>
    isConfigActive(CONFIG_KEY.FIX_DROPSHIP_PRICE_KEY);

  const getNewPrice = () => {
    return isFixDropShipPrice() ? listPrice : newPrice;
  };

  const calculateOriginGrossProfit = () => {
    let grossProfit = 0;

    try {
      grossProfit =
        Number(quantity) * (Number(getNewPrice()) - Number(price)) || 0;
    } catch (err) {
      console.log('calculate_gross_profit', err);
    }

    return grossProfit;
  };

  const calculateGrossProfit = () => {
    return priceFormatter(calculateOriginGrossProfit()) + currency;
  };

  const [newPriceView, setNewPriceView] = useState('0');
  const [newPrice, setNewPrice] = useState('0');
  const [totalProfit, setTotalProfit] = useState(calculateOriginGrossProfit());

  const handleChangePrice = (price) => {
    const originPrice = Number(String(price).replace(/(?!\d+|-)\D*/g, ''));
    setNewPrice(originPrice);
    setNewPriceView(price);
    onChangeNewPrice(originPrice);
    setTotalProfit(calculateOriginGrossProfit());
  };

  const renderNewPrice = () => {
    return isFixDropShipPrice() ? (
      <Typography style={[styles.newPriceInput, totalProfitStyle]}>
        {priceFormatter(listPrice)}
      </Typography>
    ) : (
      <Input
        style={[styles.newPriceInput, totalProfitStyle]}
        keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
        onChangeText={handleChangePrice}
        value={priceFormatter(newPriceView)}
        editable={true}
      />
    );
  };

  const totalProfitStyle = useMemo(() => {
    return mergeStyles(styles.price, {
      color: getNewPrice() < price ? theme.color.danger : theme.color.success,
    });
  }, [theme]);

  const newPriceTypingContainerStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    };
  }, [theme]);

  return (
    <Container
      pointerEvents={disabled ? 'none' : 'auto'}
      style={disabled && styles.disabled}
      padding={15}>
      <Container row style={[styles.row, {width: '100%'}]}>
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={[styles.title, styles.quantityLabel]}>
          {t('dropShip.quantity')}
        </Typography>
        <View style={styles.quantityWrapper}>
          <NumberSelection
            containerStyle={[styles.value, styles.quantityContainer]}
            textContainer={styles.quantityTxtContainer}
            value={quantity}
            min={min}
            max={max}
            onChangeText={onChangeQuantity}
            onMinus={onMinus}
            onPlus={onPlus}
            onBlur={onQuantityBlur}
            // disabled={disabled}
          />
        </View>
      </Container>
      <Container row style={styles.row}>
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={styles.title}>
          {t('dropShip.price')}
        </Typography>
        <Typography
          type={TypographyType.LABEL_LARGE}
          style={[styles.value, styles.price]}>
          {priceView}
        </Typography>
      </Container>
      <Container row style={styles.row}>
        <View style={styles.newPriceTitleContainer}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.title}>
            {t('dropShip.wishingPrice')}
          </Typography>
          <Typography
            type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
            style={styles.note}>
            {t('dropShip.errorWishingPrice')}
          </Typography>
        </View>

        <View
          style={[
            styles.value,
            styles.newPriceContainer,
            !isFixDropShipPrice() && newPriceTypingContainerStyle,
          ]}>
          {renderNewPrice()}
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={totalProfitStyle}>
            {currency}
          </Typography>
        </View>
      </Container>
      <Container row style={styles.row}>
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={styles.title}>
          {t('dropShip.grossProfit')}
        </Typography>
        <Typography style={[styles.value, styles.price]}>
          {calculateGrossProfit(totalProfit)}
        </Typography>
      </Container>
    </Container>
  );
};

export default DropShip;
