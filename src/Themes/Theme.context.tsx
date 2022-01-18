// Theme.context.tsx
import React, {useEffect} from 'react';
import EventEmitter from 'eventemitter3';
import i18n from 'i18next';
import store from 'app-store';
import {
  BASE_LIGHT_THEME,
  BASE_LIGHT_THEME_ID,
  CUSTOM_LIGHT_THEME_1,
} from './Theme.light';
import {Theme} from './interface';
import {BASE_DARK_THEME, BASE_DARK_THEME_ID} from './Theme.dark';
import {CUSTOM_LIGHT_THEME_1_ID} from './constants';

export const themeChangingListener = new EventEmitter();

export const THEME_CHANGING_EVENT_NAME = 'theme_changing';

// Our context provider will provide this object shape
export interface ThemeProvidedValue {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
  updateTheme: (updatedTheme: Theme) => void;
}
// Creating our context
// Important: the defined object here is only received by the
// consumer components when there is no rendered context provider
// in the view hierarchy, so basically it will provide
// a fallback object
export const ThemeContext = React.createContext<ThemeProvidedValue>({
  theme: BASE_LIGHT_THEME,
  toggleTheme: (BASE_LIGHT_THEME) => {
    console.log('ThemeProvider is not rendered!');
  },
  updateTheme: (updatedTheme) => {
    console.log(updatedTheme);
  },
});
// Because our stateful context provider will be a React component
// we can define some props for it too
interface Props {
  initial: Theme;
  children?: React.ReactNode;
}
// Creating our stateful context provider
// We are using React.memo for optimization
export const ThemeProvider = React.memo<Props>((props) => {
  // Store the actual theme as an internal state of the provider
  const [theme, setTheme] = React.useState<Theme>(props.initial);
  // Implement a method for toggling the Theme
  // We're using the React.useCallback hook for optimization
  const toggleTheme = React.useCallback((callback = () => {}) => {
    setTheme((currentTheme) => {
      let nextTheme = BASE_LIGHT_THEME;
      switch (currentTheme.id) {
        case BASE_LIGHT_THEME_ID:
          nextTheme = CUSTOM_LIGHT_THEME_1;
          break;
        case CUSTOM_LIGHT_THEME_1_ID:
          nextTheme = BASE_DARK_THEME;
          break;
        case BASE_DARK_THEME_ID:
          nextTheme = BASE_LIGHT_THEME;
          break;
      }

      nextTheme.name = i18n.getFixedT(undefined, 'theme')(nextTheme.id);

      callback(nextTheme);
      return nextTheme;
    });
  }, []);
  // update theme
  const updateTheme = React.useCallback((updatedTheme) => {
    setTheme(updatedTheme);
  }, []);
  // Building up the provided object
  // We're using the React.useMemo hook for optimization
  const MemoizedValue = React.useMemo(() => {
    const value: ThemeProvidedValue = {
      theme,
      toggleTheme,
      updateTheme,
    };

    return value;
  }, [theme, toggleTheme, updateTheme]);
  // emit an event whenever the theme is changed.
  useEffect(() => {
    store.setTheme(theme);

    themeChangingListener.emit(THEME_CHANGING_EVENT_NAME, theme);
  }, [theme]);
  // Render our context provider by passing it the value to provide
  return (
    <ThemeContext.Provider value={MemoizedValue}>
      {props.children}
    </ThemeContext.Provider>
  );
});
// Creating a custom context consumer hook for function components
export const useTheme = () => React.useContext(ThemeContext);
export const getTheme: (scope: {context: {theme: Theme}}) => Theme = (
  scope,
) => {
  return scope.context?.theme;
};
