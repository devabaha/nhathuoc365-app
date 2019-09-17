import fromMoneyFormat from './fromMoneyFormat';

/**
 * @param integer v: value of money
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
export default function toMoneyFormat(v, n, x) {
  v = fromMoneyFormat(v);
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return v.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
}
