import Validator from 'validator';

export const toInt = value => Validator.toInt(value);

export const isEmpty = (value = '') => {
  return Validator.isEmpty(value);
};

export const isNotEmpty = (value = '') => {
  return !isEmpty(value);
};

export const isRequired = (value = '') => {
  if (typeof value === 'number') {
    value = value.toString();
  }
  return isNotEmpty(value) ? undefined : 'Vui lòng nhập trường này!';
};

export const isEmail = (value = '') => {
  const isEmail = Validator.isEmail(value);
  return isEmpty(value) || isEmail ? undefined : 'Vui lòng nhập email!';
};
