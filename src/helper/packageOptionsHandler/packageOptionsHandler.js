import store from 'app-store';

const getOptionType = type => {
  return Object.keys(store.packageOptions).find(key => key === type);
};

export const isActivePackageOptionConfig = type => {
  const optionKey = getOptionType(type);
  if (store.packageOptions && optionKey) {
    const isActive = store.packageOptions[optionKey];

    return !!isActive;
  }

  // default option
  return store.isHomeLoaded;
};
