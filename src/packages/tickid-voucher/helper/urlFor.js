import config from '../config';

function encodeQueryData(params) {
  const ret = [];
  for (const d in params)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(params[d]));
  return ret.join('&');
}

export default function urlFor(url) {
  const timestamp = time();
  const hash_token = md5(
    [
      config.private.secretKey,
      config.private.appKey,
      config.device.appVersion,
      config.device.deviceId,
      config.device.deviceType,
      config.device.os,
      config.device.osVersion,
      config.device.store,
      timestamp
    ].join('')
  );
  const data = {
    app_key: config.private.appKey,
    app_version: config.device.appVersion,
    device_id: config.device.deviceId,
    device_type: config.device.deviceType,
    os: config.device.os,
    os_version: config.device.osVersion,
    store: config.device.store,
    timestamp,
    hash_token
  };
  const query_url = encodeQueryData(data);
  return url + (url.includes('?') ? '&' : '?') + query_url;
}
