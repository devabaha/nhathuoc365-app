import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput} from 'react-native';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import ButtonTag from './ButtonTag';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {isEmpty, isEqual} from 'lodash';

function ListPrice({title, onChangeValue}) {
  const priceValueString = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const priceValue = JSON.parse(priceValueString);

  useEffect(() => {
    if (!isEmpty(selectedPrice)) {
      onChangeValue?.(selectedPrice);
    }
  }, [selectedPrice]);

  const handleItem = (item) => () => {
    setSelectedPrice((prev) => {
      if (isEqual(prev['price'], item)) {
        return {};
      }
      return {
        ...prev,
        price: item,
      };
    });
  };

  const renderPriceItem = ({item}) => {
    const isChecked = !isEmpty(selectedPrice)
      ? isEqual(selectedPrice['price'], item)
      : false;
    return (
      <View style={styles.itemContainer}>
        <ButtonTag
          text={`${vndCurrencyFormat(item.min_price)} - ${vndCurrencyFormat(
            item.max_price,
          )}`}
          onPress={handleItem(item)}
          checked={isChecked}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={Object.values(priceValue)}
        numColumns={2}
        keyExtractor={(_, index) => `min_max_price_${index}`}
        renderItem={renderPriceItem}
      />
      <View style={styles.textInputWrapper}>
        <TextInput
          value={minPrice}
          onChangeText={handleChangeText('min_price')}
          style={styles.input}
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
  },
});

export default ListPrice;
