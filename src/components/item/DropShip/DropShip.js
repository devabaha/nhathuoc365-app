import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import NumberSelection from 'src/components/stores/NumberSelection';
import Container from '../../Layout/Container';
import appConfig from 'app-config';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  row: {
    // marginBottom: 15,
    paddingVertical: 12,
  },
  newPriceTitleContainer: {
    flex: 1,
  },
  title: {
    // textTransform: 'uppercase',
    color: '#666',
    letterSpacing: 0.5,
    flex: 1,
    paddingRight: 10,
  },
  note: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#888',
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
    color: '#444',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: 1,
  },
  newPriceContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newPriceTypingContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#d9d9d9',
  },
  newPriceInput: {
    minWidth: 113,
    textAlign: 'right',
    color: appConfig.colors.primary,
    padding: 0,
  },
  newPriceCurrency: {
    color: appConfig.colors.primary,
  },
  btnContainer: {
    marginHorizontal: -15,
    paddingHorizontal: 0,
    marginTop: 15,
    marginBottom: -15,
    alignSelf: 'center',
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

  const totalProfitValidateStyle = {
    color:
      getNewPrice() < price
        ? appConfig.colors.status.danger
        : appConfig.colors.status.success,
  };

  const renderNewPrice = () => {
    return isFixDropShipPrice() ? (
      <Text
        style={[styles.price, styles.newPriceInput, totalProfitValidateStyle]}>
        {priceFormatter(listPrice)}
      </Text>
    ) : (
      <TextInput
        style={[styles.price, styles.newPriceInput, totalProfitValidateStyle]}
        keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
        onChangeText={handleChangePrice}
        value={priceFormatter(newPriceView)}
        editable={!disabled}
      />
    );
  };

  return (
    <Container
      pointerEvents={disabled ? 'none' : 'auto'}
      style={disabled && styles.disabled}
      padding={15}>
      <Container row style={[styles.row, {width: '100%'}]}>
        <Text style={[styles.title, styles.quantityLabel]}>Số lượng</Text>
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
        <Text style={styles.title}>Giá bán</Text>
        <Text style={[styles.value, styles.price]}>{priceView}</Text>
      </Container>
      <Container row style={styles.row}>
        <View style={styles.newPriceTitleContainer}>
          <Text style={styles.title}>Giá muốn bán</Text>
          <Text style={styles.note}>* Phải cao hơn hoặc bằng giá bán</Text>
        </View>

        <View
          style={[
            styles.value,
            styles.newPriceContainer,
            !isFixDropShipPrice() && styles.newPriceTypingContainer,
          ]}>
          {renderNewPrice()}
          <Text
            style={[
              styles.price,
              styles.newPriceCurrency,
              totalProfitValidateStyle,
            ]}>
            {currency}
          </Text>
        </View>
      </Container>
      <Container row style={styles.row}>
        <Text style={styles.title}>Lợi nhuận gộp</Text>
        <Text style={[styles.value, styles.price]}>
          {calculateGrossProfit(totalProfit)}
        </Text>
      </Container>
    </Container>
  );
};

export default DropShip;
