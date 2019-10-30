export default function vi2en(viString) {
  viString = viString.toLowerCase();
  viString = viString.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  viString = viString.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  viString = viString.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  viString = viString.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  viString = viString.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  viString = viString.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  return viString.replace(/đ/gi, 'd');
}
