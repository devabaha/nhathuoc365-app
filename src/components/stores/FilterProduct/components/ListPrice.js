import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {isEmpty, isEqual} from 'lodash';
import BlockFilterOption from './BlockFilterOption';

import appConfig from 'app-config';
import store from 'app-store';
import Container from 'src/components/Layout/Container';

const CURRENCY = '₫';

function ListPrice({
  title,
  onChangeValue,
  error,
  refScrollView,
  onChangePriceRange = () => {},
  defaultValue = {},
}) {
  const normalizeTags = (tags) => {
    Object.keys(tags).forEach((tagKey) => {
      tags[tagKey].tag = tagKey;
    });

    return tags;
  };

  const priceValueString = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const priceValue = normalizeTags(JSON.parse(priceValueString));

  const refInputs = useRef();

  useEffect(() => {
    onChangeValue?.(selectedPrice);
  }, [selectedPrice]);

  useEffect(() => {
    if (!!defaultValue.price) {
      setSelectedPrice({price: defaultValue['price']});
      setMinPrice(defaultValue['price']?.min_price);
      setMaxPrice(defaultValue['price']?.max_price);
    } else {
      setSelectedPrice({});
      setMinPrice('');
      setMaxPrice('');
    }
  }, [defaultValue]);

  const getRangePriceTagName = (from = minPrice, to = maxPrice) => {
    from = Number(from);
    to = Number(to);

    let tagName = '';
    if (!!from) {
      tagName = (!!to ? 'Từ ' : 'Tối thiểu ') + vndCurrencyFormat(from);
    }
    if (!!to) {
      tagName += from
        ? ' đến ' + vndCurrencyFormat(to)
        : 'Tối đa ' + vndCurrencyFormat(to);
    }

    return tagName;
  };

  const handleChangeText = (key) => (text) => {
    text = getNumberOnly(text);
    if (key === 'min_price') {
      setMinPrice(text);
      setSelectedPrice((prev) => ({
        price: {
          ...prev['price'],
          text: '',
          min_price: text,
          tag: getRangePriceTagName(text, prev['price']?.max_price),
        },
      }));
    } else {
      setMaxPrice(text);
      setSelectedPrice((prev) => ({
        price: {
          ...prev['price'],
          text: '',
          max_price: text,
          tag: getRangePriceTagName(prev['price']?.min_price, text),
        },
      }));
    }
  };

  const handleItem = (key, value) => () => {
    let nextSelectedPrice = {...selectedPrice};

    if (nextSelectedPrice['price']?.text === key) {
      nextSelectedPrice = {};
    } else {
      nextSelectedPrice['price'] = {
        text: key,
        ...value,
      };
    }

    if (isEmpty(nextSelectedPrice)) {
      setMinPrice('');
      setMaxPrice('');
    } else {
      setMinPrice(nextSelectedPrice['price']?.min_price || 0);
      setMaxPrice(nextSelectedPrice['price']?.max_price || 0);
    }

    setSelectedPrice(nextSelectedPrice);

    onChangePriceRange(
      nextSelectedPrice['price']?.min_price,
      nextSelectedPrice['price']?.max_price,
    );
  };

  const handleFocusInputPrice = () => {
    onChangePriceRange(minPrice, maxPrice);

    if (appConfig.device.isIOS) {
      if (refScrollView?.current && refInputs.current) {
        refInputs.current.measure((ox, oy, width, height, px, py) => {
          refScrollView?.current.scrollTo({
            y: py + store.keyboardTop + height,
          });
        });
      }
    }
  };

  const handleBlurInputPrice = () => {
    onChangePriceRange(minPrice, maxPrice);
  };

  const checkSelected = (tag, index) => {
    return !isEmpty(selectedPrice)
      ? isEqual(selectedPrice['price'].tag, tag.tag)
      : false;
  };

  const formatPriceView = (price) => {
    let priceInNumber = Number(price) || 0;
    if (priceInNumber) {
      return numberFormat(priceInNumber);
    }

    return price || '';
  };

  const renderFooter = () => {
    return (
      <View ref={refInputs}>
        <Text style={styles.priceText}>Nhập khoảng giá khác</Text>
        <View style={styles.textInputWrapper}>
          <Container
            flex
            row
            style={[styles.inputContainer, error && styles.errorInput]}>
            <TextInput
              value={formatPriceView(Number(minPrice))}
              onChangeText={handleChangeText('min_price')}
              style={styles.input}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder="Giá thấp nhất..."
              onBlur={handleBlurInputPrice}
              onFocus={handleFocusInputPrice}
            />
            <Text style={styles.currency}>{CURRENCY}</Text>
          </Container>
          <Text style={styles.currency}>-</Text>
          <Container
            flex
            row
            style={[styles.inputContainer]}>
            <TextInput
              value={formatPriceView(Number(maxPrice))}
              onChangeText={handleChangeText('max_price')}
              style={styles.input}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder="Giá cao nhất..."
              onBlur={handleBlurInputPrice}
              onFocus={handleFocusInputPrice}
            />
            <Text style={styles.currency}>{CURRENCY}</Text>
          </Container>
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BlockFilterOption
        title={title}
        tags={Object.values(priceValue)}
        customCheckSelected={checkSelected}
        onPressTag={(tag) => handleItem(tag.tag, priceValue[tag.tag])}
        renderExtraFooter={renderFooter}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  textInputWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ccc',
    flex: 1,
  },
  input: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flex: 1,
  },
  currency: {
    color: '#666',
    marginHorizontal: 7,
  },
  priceText: {
    marginTop: 10,
    color: '#777',
    fontSize: 12,
  },

  extraSpacing: {
    marginLeft: 5,
  },

  error: {
    fontSize: 12,
    color: appConfig.colors.status.danger,
    marginTop: 5,
  },
  errorInput: {
    borderColor: appConfig.colors.status.danger,
  },
});

export default React.memo(ListPrice);
