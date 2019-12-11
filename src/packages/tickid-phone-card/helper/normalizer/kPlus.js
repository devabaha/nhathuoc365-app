export function normalize(data) {
  let temp = {};
  let kPlusData = [],
    discounts = [],
    optionsData = [];
  tempData = [...data.data];
  const options = Object.keys({ ...data.options });
  // console.log(data)

  options.forEach(optKey => {
    optionsData.push({
      [optKey]: data.options[optKey],
      label: data.options[optKey],
      type: String(data.options[optKey])
    });
    tempData.forEach((d, index) => {
      const seperateData = d.discount_labels[optKey].split('|');
      const hasSeperate = seperateData.length > 1;
      discounts.push({
        times: d.times,
        subLabel: d.sub_label,
        cashbackLabel: seperateData[0],
        cashbackValue: hasSeperate ? seperateData.slice(1).join('') : '',
        price: d.prices[optKey],
        type: String(index),
        label: d.prices[optKey],
        total_price: d.total_prices[optKey]
      });
    });

    temp.key = optKey;
    temp.data = {
      ...data,
      ...tempData[0],
      discounts
    };
    kPlusData.push(temp);
    temp = {};
    discounts = [];
  });

  return { kPlusData, optionsData };
}

export function denormalize(data) {}
