// Theme.context.tsx
import React, {useEffect} from 'react';
// import {DARK_THEME, DARK_THEME_ID} from './Theme.dark';
import {BASE_LIGHT_THEME, BASE_LIGHT_THEME_ID} from './Theme.light';
import {Theme} from './interface';
import {BASE_DARK_THEME, BASE_DARK_THEME_ID} from './Theme.dark';
import EventEmitter from 'eventemitter3';

const themeChangingListener = new EventEmitter();

const THEME_CHANGING_EVENT_NAME = 'theme_changing';

// Our context provider will provide this object shape
export interface ThemeProvidedValue {
  theme: Theme;
  toggleTheme: () => void;
}
// Creating our context
// Important: the defined object here is only received by the
// consumer components when there is no rendered context provider
// in the view hierarchy, so basically it will provide
// a fallback object
export const ThemeContext = React.createContext<ThemeProvidedValue>({
  theme: BASE_LIGHT_THEME,
  toggleTheme: () => {
    console.log('ThemeProvider is not rendered!');
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
  const ToggleThemeCallback = React.useCallback(() => {
    setTheme((currentTheme) => {
      if (currentTheme.id === BASE_LIGHT_THEME_ID) {
        return BASE_DARK_THEME;
      }
      if (currentTheme.id === BASE_DARK_THEME_ID) {
        return BASE_LIGHT_THEME;
      }
      return currentTheme;
    });
  }, []);
  // Building up the provided object
  // We're using the React.useMemo hook for optimization
  const MemoizedValue = React.useMemo(() => {
    const value: ThemeProvidedValue = {
      theme,
      toggleTheme: ToggleThemeCallback,
    };
    return value;
  }, [theme, ToggleThemeCallback]);
  // emit an event whenever the theme is changed.
  useEffect(() => {
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
export const getTheme: Theme | {} = (scope: {context: {theme: Theme}}) => {
  if (scope !== undefined) {
    return scope.context?.theme;
  }
  return {};
};

export const addThemeChangingListener = (listener) => {
  themeChangingListener.addListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const removeThemeChangingListener = (listener) => {
  themeChangingListener.removeListener(THEME_CHANGING_EVENT_NAME, listener);
};

export const updateNavbarTheme = (navigation, currentTheme) => {
  const listener = (theme) => {
    navigation.setParams({
      headerStyle: {
        backgroundColor: theme.color.primary,
      },
    });
  };

  listener(currentTheme);

  addThemeChangingListener(listener);

  return () => removeThemeChangingListener(listener);
};
