import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';

/**
 * A group of functions to handler rada's jobs.
 * @author Nguyễn Hoàng Minh <minhnguyenit14@gmail.com>
 *
 * @module radaHandler
 *
 * @typedef {Object} Category - rada category information
 * @typedef {Object} Service - rada service information
 * @typedef {Object} I18n - i18n data
 */

/**
 * Route to list service when category selected.
 *
 * @method
 * @param {Category} item
 * @param {I18n} t
 */
export function handleCategoryPress(item, t) {
  Actions.push(appConfig.routes.tickidRadaListService, {
    category: item,
    title: item.name,
    onPressItem: item => {
      handleServicePress(item, t);
    },
    onPressCartImage: item => {
      handleCartImagePress(item, t);
    }
  });
}

/**
 * Route to order history when history pressed.
 *
 * @method
 * @param {Category} item
 * @param {I18n} t
 */
export function handleOrderHistoryPress(item, t) {
  Actions.push('tickidRadaOrderHistory', {
    category: item,
    title: t('common:screen.radaOrderHistory.mainTitle')
  });
}

/**
 * Route to service detail when service pressed.
 *
 * @method
 * @param {Service} item
 * @param {I18n} t
 */
export function handleServicePress(item, t) {
  Actions.push(appConfig.routes.tickidRadaServiceDetail, {
    service: item,
    title: item.name,
    onPressOrder: item => {
      handleOrderButtonPress(item, t);
    }
  });
}

export function handleCartImagePress(item, t) {
  handleOrderButtonPress(item, t);
}

export function handleOrderButtonPress(service, t) {
  Actions.push(appConfig.routes.tickidRadaBooking, {
    service: service,
    title: service.name || '',
    customerName: '',
    phone: '',
    address: '',
    onBookingSuccess: response => {
      handleBookingSuccess(response, t);
    },
    onBookingFail: err => {
      handleBookingFail(err, t);
    },
    onCallWebHookSuccess: response => {
      handleCallWebHookSuccess(response, t);
    },
    onCallWebHookFail: err => {
      handleCallWebHookFail(err, t);
    }
  });
}

export function handleBookingSuccess(response, t) {
  return Alert.alert(
    t('booking.success.title'),
    t('booking.success.message'),
    [{ text: t('booking.success.accept'), onPress: () => Actions.homeTab() }],
    { cancelable: false }
  );
}

function handleBookingFail(err, t) {
  if (err && err.data) {
    if (err.data.customer.length != 0) {
      return Alert.alert(
        t('booking.fail.title'),
        err.data.customer[0],
        [{ text: t('booking.fail.accept') }],
        { cancelable: false }
      );
    } else {
      return Alert.alert(
        t('booking.fail.title'),
        err.message || '',
        [{ text: t('booking.fail.accept') }],
        { cancelable: false }
      );
    }
  } else if (err.message) {
    return Alert.alert(
      t('booking.fail.title'),
      err.message,
      [{ text: t('booking.fail.accept') }],
      {
        cancelable: false
      }
    );
  } else {
    return Alert.alert(
      t('booking.fail.title'),
      t('booking.fail.message'),
      [{ text: t('booking.fail.accept') }],
      { cancelable: false }
    );
  }
}

function handleCallWebHookSuccess(response, t) {
  return Alert.alert(
    t('web.success.title'),
    t('web.success.message'),
    [{ text: t('web.success.accept'), onPress: () => Actions.homeTab() }],
    { cancelable: false }
  );
}

function handleCallWebHookFail(err, t) {
  if (err && err.data) {
    if (err.data.customer.length != 0) {
      return Alert.alert(
        t('web.fail.title'),
        err.data.customer[0],
        [{ text: t('web.fail.accept') }],
        { cancelable: false }
      );
    } else {
      return Alert.alert(
        t('web.fail.title'),
        err.message || '',
        [{ text: t('web.fail.accept') }],
        { cancelable: false }
      );
    }
  } else if (err.message) {
    return Alert.alert(
      t('web.fail.title'),
      err.message,
      [{ text: t('web.fail.accept') }],
      {
        cancelable: false
      }
    );
  } else {
    return Alert.alert(
      t('web.fail.title'),
      t('web.fail.message'),
      [{ text: t('web.fail.accept') }],
      { cancelable: false }
    );
  }
}
