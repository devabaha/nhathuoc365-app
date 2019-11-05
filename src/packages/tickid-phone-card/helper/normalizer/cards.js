export function normalize(network) {
  return network.data.map(card => {
    const seperateData = card.discount_label.split('|');
    const hasSeperate = seperateData.length > 1;
    return {
      ...card,
      type: card.price,
      cashbackLabel: seperateData[0],
      cashbackValue: hasSeperate ? seperateData.slice(1).join('') : ''
    };
  });
}

export function denormalize(data) {}
