export default function fromMoneyFormat(money, separate = ',', replace = '') {
  if (typeof money !== 'string') {
    return money;
  }
  return Number(money.replace(new RegExp(separate, 'g'), replace));
}
