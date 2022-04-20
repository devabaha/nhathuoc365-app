export * from './getBase64Image';
export * from './asyncLoop';
export * from './state';
export * from './logger';

export const getColorTheme = (theme) => {
  if (!theme) return {};
  return {
    focusColor: theme.color.accent2,
    blurColor: theme.color.iconInactive,
  };
};
