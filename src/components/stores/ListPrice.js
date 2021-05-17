import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput} from 'react-native';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import ButtonTag from './ButtonTag';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {isEmpty, isEqual} from 'lodash';

function ListPrice({title, onChangeValue, defaultValue = {}}) {
  const priceValueString = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [type, setType] = useState('select');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const priceValue = JSON.parse(priceValueString);

  useEffect(() => {
    onChangeValue?.(selectedPrice);
  }, [selectedPrice]);

  useEffect(() => {
    console.log('mounted price');
    return () => {
      console.log('unmounted price');
    };
  }, []);

  useEffect(() => {
    if (!!defaultValue.price) {
      setSelectedPrice({price: defaultValue['price']});
      setMinPrice(vndCurrencyFormat(defaultValue['price']?.min_price));
      setMaxPrice(vndCurrencyFormat(defaultValue['price']?.max_price));
    }
  }, [defaultValue]);

  const handleChangeText = (key) => (text) => {
    setType('change_text');
    if (key === 'min_price') {
      setMinPrice(text);
      setSelectedPrice((prev) => ({
        price: {...prev['price'], min_price: parseInt(text)},
      }));
    } else {
      setMaxPrice(text);
      setSelectedPrice((prev) => ({
        price: {...prev['price'], max_price: parseInt(text)},
      }));
    }
  };

  useEffect(() => {
    if (type === 'select') {
      if (isEmpty(selectedPrice)) {
        setMinPrice('');
        setMaxPrice('');
      } else {
        setMinPrice(vndCurrencyFormat(selectedPrice['price']?.min_price));
        setMaxPrice(vndCurrencyFormat(selectedPrice['price']?.max_price));
      }
    }
  }, [selectedPrice, type]);

  const handleItem = (key, value) => () => {
    setSelectedPrice((prev) => {
      console.log({prev, value});
      if (isEqual(prev['price'], {...value, text: key})) {
        return {};
      }
      return {
        ...prev,
        ['price']: {
          text: key,
          ...value,
        },
      };
    });
  };

  const renderPriceItem = ({item}) => {
    const isChecked = !isEmpty(selectedPrice)
      ? isEqual(selectedPrice['price'].text, item)
      : false;
    return (
      <View style={styles.itemContainer}>
        <ButtonTag
          text={item}
          onPress={handleItem(item, priceValue[item])}
          checked={isChecked}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={Object.keys(priceValue)}
        numColumns={2}
        keyExtractor={(_, index) => `min_max_price_${index}`}
        renderItem={renderPriceItem}
      />
      <Text style={styles.priceText}>Hoặc nhập ô giá ở đây</Text>
      <View style={styles.textInputWrapper}>
        <TextInput
          value={minPrice}
          onChangeText={handleChangeText('min_price')}
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Từ 0 đ"
        />
        <TextInput
          value={maxPrice}
          onChangeText={handleChangeText('max_price')}
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Đến 10,000,000,000 đ"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  itemContainer: {
    flex: 0.5,
    padding: 5,
  },
  title: {
    fontSize: 16,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  textInputWrapper: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    width: '50%',
    height: 40,
    marginHorizontal: 7,
    paddingLeft: 4,
  },
  priceText: {
    marginVertical: 7,
    marginLeft: 10,
  },
});

export default ListPrice;
