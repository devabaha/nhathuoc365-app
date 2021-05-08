import {THEMES_TYPE, THEMES} from './constants';

class Themes {
  themesList = Object.values(THEMES_TYPE);
  currentThemeType = undefined;
  currentTheme = {};

  setCurrentTheme(themeType) {
    this.currentThemeType = themeType;
    this.currentTheme = THEMES.find((theme) => theme.type === themeType) || {};
  }

  get styles() {
      return this.currentTheme.styles
  }
}

export default new Themes();
