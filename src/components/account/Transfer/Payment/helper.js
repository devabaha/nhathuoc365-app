export const formatMoney = text => {
  try {
    text = Number(text)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
      .split('.')[0]
      .replace(/,/g, '.');
  } catch (e) {
    Toast.show('Sai định dạng!');
    console.log(e);
  }
  return text;
};
