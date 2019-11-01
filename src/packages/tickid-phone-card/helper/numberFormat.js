export default function numberFormat(target, n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\,' : '$') + ')';
  return target.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
}
