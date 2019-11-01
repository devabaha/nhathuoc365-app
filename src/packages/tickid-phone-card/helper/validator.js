/**
 * Check is valid `latitude`
 * @param {*} value
 */
export function isLatitude(lat) {
  if (lat != 0 && lat !== '' && !lat) return false;
  return isFinite(lat) && Math.abs(lat) <= 90;
}

/**
 * Check is valid `longitude`
 * @param {*} value
 */
export function isLongitude(lng) {
  if (lng != 0 && lng !== '' && !lng) return false;
  return isFinite(lng) && Math.abs(lng) <= 180;
}
