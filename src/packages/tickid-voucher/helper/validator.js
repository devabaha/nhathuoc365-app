/**
 * Check is valid `latitude` or `longitude`
 * @param {*} value
 */
export const isLongLat = value => {
  const reg = new RegExp('^-?([1-8]?[1-9]|[1-9]0).{1}d{1,6}');
  return reg.exec(value);
};
