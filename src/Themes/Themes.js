import React from 'react';
import {SvgXml} from 'react-native-svg';
import FastImage from 'react-native-fast-image';

import basicSales from './basicSales';
import {ASSETS_TYPE, BUNDLE_ICON_SETS, THEMES_TYPE} from './constants';

export const THEMES = [
  {
    type: THEMES_TYPE.BASIC_SALES,
    ...basicSales,
  },
];

class Themes {
  currentTheme = {};

  constructor() {
    this.setCurrentTheme(THEMES_TYPE.BASIC_SALES);
  }

  setCurrentTheme(themeType) {
    const currentTheme = THEMES.find((theme) => theme.type === themeType);
    if (currentTheme) {
      currentTheme.assets = this.createAssets(currentTheme.assets);
    } else {
      currentTheme = {};
    }

    this.currentTheme = currentTheme;
  }

  getNameSpace(nameSpaces) {
    if (Array.isArray(nameSpaces)) {
      nameSpaces = [nameSpaces];
    }

    const styles = {};
    const nameSpaceKeys = Object.keys(this.styles).filter((key) =>
      nameSpaces.includes(key),
    );
    nameSpaceKeys.forEach((key) => {
      styles[key] = this.styles[key];
    });

    const themesInNamespace = {
      ...this.currentTheme,
      assets: this.assets,
      styles,
    };

    return (styleString) => {
      let namespace = '',
        dataKey = styleString;

      if (styleString.includes(':')) {
        [namespace, dataKey] = styleString.split(':');
      }
      let temp = themesInNamespace;

      let rootKey;
      dataKey.split('.').forEach((data, index) => {
        const temp2 = Object.keys(temp).find((key) => key === data);
        if (index === 0) {
          rootKey = data;
        }
        if (temp2) {
          temp = temp[temp2];
        } else {
          temp = {};
          switch (rootKey) {
            case 'styles':
              temp = {};
              break;
            case 'assets':
              temp = null;
              break;
          }
        }
      });

      return temp;
    };
  }

  createAssets = (assets) => {
    Object.keys(assets).forEach((key) => {
      let data = assets[key];
      switch (data.type) {
        case ASSETS_TYPE.SVG:
          const SvgComponent = data.value;
          class ThemeSvg extends React.Component {
            render() {
              return <SvgComponent {...this.props} />;
            }
          }

          data = ThemeSvg;
          break;
        case ASSETS_TYPE.SVG_XML:
          const xml = data.value;

          class ThemeSvgXml extends React.Component {
            render() {
              return <SvgXml xml={xml} {...this.props} />;
            }
          }

          data = ThemeSvgXml;
          break;
        case ASSETS_TYPE.IMAGE:
          const uri = data.value;
          console.log(uri);
          class ThemeImage extends React.Component {
            render() {
              return <FastImage source={{uri}} {...this.props} />;
            }
          }

          data = ThemeImage;
          break;
        case ASSETS_TYPE.ICON:
          const IconComponent = BUNDLE_ICON_SETS[data.value.bundle];
          const iconName = data.value.name;
          class ThemeIcon extends React.Component {
            render() {
              return <IconComponent {...this.props} name={iconName} />;
            }
          }
          data = ThemeIcon;
          break;
      }

      assets[key] = data;
    });

    return assets;
  };

  mergeStyles = (base, others) => {
    Object.keys(base).forEach(key => {
      base[key] = {...base[key], ...others[key]}
    });

    return base;
  }

  get styles() {
    return this.currentTheme.styles;
  }

  get assets() {
    return this.currentTheme.assets;
  }
}

export default new Themes();
