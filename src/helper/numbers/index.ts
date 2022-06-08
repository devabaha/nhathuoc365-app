import {getLocales, getCountry} from 'react-native-localize';

export const getLanguageTag = () => {
    return (
      getLocales().find((locale) => locale.countryCode === getCountry())
        ?.languageTag || getCountry()
    );
  };
  
  export const getDecimalSeparator = () => {
    return new Intl.NumberFormat(getLanguageTag()).format(1.1).replace(/\d/g, '');
  };
  
  export const getThousandsSeparator = () => {
    return new Intl.NumberFormat(getLanguageTag())
      .format(1000)
      .replace(/\d/g, '');
  };
  
  export const formatNumber = (value) => {
    value = String(value);
    const decimalSeparator = getDecimalSeparator();
    return (
      new Intl.NumberFormat(getLanguageTag(), {
        // style: 'currency',
        // currency: 'VND',
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }).format(value) +
      (value.charAt(value.length - 1) === '.' ? decimalSeparator : '')
    );
  };
  
  export const isFormattedNumber = (value) => {
    const thousandsSeparator = getThousandsSeparator();
    return (
      !value.startsWith(thousandsSeparator) &&
      !value.endsWith(thousandsSeparator) &&
      !isNaN(Number(value.replaceAll(thousandsSeparator, '')))
    );
  };
  
  export const getRawFromFormattedNumber = (value) => {
    let temp = value;
    const thousandsSeparator = getThousandsSeparator();
    const decimalSeparator = getDecimalSeparator();
    const thousandsRegex = new RegExp(
      thousandsSeparator === '.' ? '\\.' : thousandsSeparator,
    );
  
    if (temp !== '') {
      temp = temp.replaceAll(thousandsRegex, '');
      if (decimalSeparator !== '.') {
        temp = temp.replaceAll(decimalSeparator, '.');
      }
    }
  
    return temp;
  };
  