export default function toUnicode(string) {
  var result = '';
  for (var i = 0; i < string.length; i++) {
    result += '\\u' + ('000' + string[i].charCodeAt(0).toString(16)).substr(-4);
  }
  return result;
}
