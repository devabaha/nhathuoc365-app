import React, {useMemo, useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {isEmpty, isEqual} from 'lodash';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
// custom components
import {Container, Typography, Input} from 'src/components/base';
import BlockFilterOption from './BlockFilterOption';

const CURRENCY = '₫';

function ListPrice({
  title,
  onChangeValue,
  error,
  refScrollView,
  onChangePriceRange = () => {},
  defaultValue = {},
}) {
  const {theme} = useTheme();

  const {t} = useTranslation('filterProduct');

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
      tagName =
        (!!to ? t('toPrice') + ' ' : t('minimum') + ' ') +
        vndCurrencyFormat(from);
    }
    if (!!to) {
      tagName += from
        ? ' ' + t('fromPrice') + ' ' + vndCurrencyFormat(to)
        : t('maximum') + ' ' + vndCurrencyFormat(to);
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
          refScrollView?.current.scrollToEnd();
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
        <Typography
          type={TypographyType.LABEL_SMALL_TERTIARY}
          style={styles.priceText}>
          {t('titleInput')}
        </Typography>
        <View style={styles.textInputWrapper}>
          <Container
            flex
            row
            style={[inputContainerStyle, error && errorInputStyle]}>
            <Input
              value={formatPriceView(Number(minPrice))}
              onChangeText={handleChangeText('min_price')}
              style={styles.input}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder={t('minPrice')}
              onBlur={handleBlurInputPrice}
              onFocus={handleFocusInputPrice}
            />
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.currency}>
              {CURRENCY}
            </Typography>
          </Container>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.currency}>
            -
          </Typography>
          <Container
            flex
            row
            style={[styles.inputContainer, inputContainerStyle]}>
            <Input
              value={formatPriceView(Number(maxPrice))}
              onChangeText={handleChangeText('max_price')}
              style={styles.input}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder={t('maxPrice')}
              onBlur={handleBlurInputPrice}
              onFocus={handleFocusInputPrice}
            />
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.currency}>
              {CURRENCY}
            </Typography>
          </Container>
        </View>
        {!!error && (
          <Typography type={TypographyType.LABEL_SMALL} style={errorStyle}>
            {error}
          </Typography>
        )}
      </View>
    );
  };

  const inputContainerStyle = useMemo(() => {
    return mergeStyles(styles.inputContainer, {
      borderWidth: theme.layout.borderWidthSmall,
      borderRadius: theme.layout.borderRadiusExtraSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const errorInputStyle = useMemo(() => {
    return mergeStyles(styles.errorInput, {borderColor: theme.color.danger});
  }, [theme]);

  const errorStyle = useMemo(() => {
    return mergeStyles(styles.error, {color: theme.color.danger});
  }, [theme]);

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
    flex: 1,
  },
  input: {
    paddingHorizontal: 5,
    paddingVertical: appConfig.device.isIOS ? 10 : 5,
    flex: 1,
  },
  currency: {
    marginHorizontal: 7,
  },
  priceText: {
    marginTop: 10,
  },

  extraSpacing: {
    marginLeft: 5,
  },

  error: {
    marginTop: 5,
  },
  errorInput: {},
});

export default React.memo(ListPrice);
