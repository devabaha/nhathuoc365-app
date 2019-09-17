export default function addHttp(url) {
  return url.indexOf('://') === -1 ? 'http://' + url : url;
}
