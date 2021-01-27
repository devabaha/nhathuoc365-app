import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import NumberSelection from 'src/components/stores/NumberSelection';
import Container from '../../Layout/Container';
import appConfig from 'app-config';

const styles = StyleSheet.create({
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
  quantityContainer: {
    width: null,
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
    borderBottomWidth: 0.5,
    borderColor: '#d9d9d9',
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  onChangeQuantity = () => {},
  onChangeNewPrice = () => {},
  onMinus = () => {},
  onPlus = () => {},
  onQuantityBlur = () => {},
}) => {
  const [newPriceView, setNewPriceView] = useState('0');
  const [newPrice, setNewPrice] = useState('0');

  const handleChangePrice = (price) => {
    const originPrice = Number(String(price).replace(/(?!\d+|-)\D*/g, ''));
    setNewPrice(originPrice);
    setNewPriceView(price);
    onChangeNewPrice(originPrice);
  };

  const valueExecutorHighPrice = (price) => {
    originPrice = Number(String(price).replace(/(?!\d+|-)\D*/g, ''));
    return numberFormat(originPrice);
  };

  const calculateGrossProfit = () => {
    let grossProfit = 0;
    try {
      grossProfit = Number(quantity) * Number(newPrice) - Number(price) || 0;
    } catch (err) {
      console.log('calculate_gross_profit', err);
    }
    return valueExecutorHighPrice(grossProfit) + currency;
  };

  return (
    <Container padding={15}>
      <Container row style={styles.row}>
        <Text style={styles.title}>Số lượng</Text>
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
          disabled={disabled}
        />
      </Container>
      <Container row style={styles.row}>
        <Text style={styles.title}>Giá bán</Text>
        <Text style={[styles.value, styles.price]}>{priceView}</Text>
      </Container>
      <Container row style={styles.row}>
        <View style={styles.newPriceTitleContainer}>
          <Text style={styles.title}>Giá muốn bán</Text>
          <Text style={styles.note}>* Phải cao hơn giá bán</Text>
        </View>

        <View style={[styles.value, styles.newPriceContainer]}>
          <TextInput
            style={[styles.price, styles.newPriceInput]}
            keyboardType="number-pad"
            onChangeText={handleChangePrice}
            value={valueExecutorHighPrice(newPriceView)}
          />
          <Text style={[styles.price, styles.newPriceCurrency]}>
            {currency}
          </Text>
        </View>
      </Container>
      <Container row style={styles.row}>
        <Text style={styles.title}>Lợi nhuận gộp</Text>
        <Text style={[styles.value, styles.price]}>
          {calculateGrossProfit()}
        </Text>
      </Container>
    </Container>
  );
};

export default DropShip;
