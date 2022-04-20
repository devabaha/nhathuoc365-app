import {Style, Theme} from 'src/Themes/interface';

export const getThemes = (theme: Theme) => {
  return {
    colors: {
      background: theme.color.background as string,
      primary: theme.color.white as string,
      highlight: theme.color.primary as string,
      secondary: theme.color.iconInactive as string,
      overlay: theme.color.overlay60 as string,
    },
  };
};
