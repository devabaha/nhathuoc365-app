export function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
}

export const empty = e => {
  switch (e) {
    case '':
    case 0:
    case '0':
    case null:
    case false:
    case typeof this == 'undefined':
      return true;
    default:
      return false;
  }
};
