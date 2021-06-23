import store from 'app-store';

const getOptionType = type => {
  return Object.keys(store.packageOptions).find(key => key === type);
};

export const getPackageOptionValue = (type) => {
  return !!Number(store.packageOptions[type]) 
}

export const isActivePackageOptionConfig = (...types) => {
  let isActive = store.isHomeLoaded;
  types.forEach(type => {
    const optionKey = getOptionType(type);

    if (store.packageOptions && optionKey) {
      isActive =
        types.length > 1
          ? isActive || !!Number(store.packageOptions[optionKey])
          : !!Number(store.packageOptions[optionKey]);
    }
  });

  // default option
  return isActive;
};
