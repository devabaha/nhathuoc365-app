import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import {NavBar} from 'src/components/base';
import {BundleIconSetName, IconButton} from '../base';

const defaultListener = () => {};

class ListNavBar extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onRight: PropTypes.func,
    onChangeSearch: PropTypes.func,
    onClearText: PropTypes.func,
    rightTitle: PropTypes.string,
    searchValue: PropTypes.string,
  };

  static defaultProps = {
    onRight: defaultListener,
    onChangeSearch: defaultListener,
    onClearText: defaultListener,
    rightTitle: '',
    searchValue: '',
  };

  state = {
    focus: false,
  };
  refInput = null;

  get theme() {
    return getTheme(this);
  }

  handleSearch() {
    push(appConfig.routes.searchChat, {}, this.theme);
  }

  handleBack() {
    pop();
  }

  renderBack = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.IONICONS}
        name="ios-arrow-back"
        iconStyle={[styles.icon, this.iconStyle]}
        onPress={this.handleBack.bind(this)}
      />
    );
  };

  renderSearch = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.IONICONS}
        name="ios-search"
        iconStyle={[styles.icon, this.iconStyle]}
        onPress={this.handleSearch.bind(this)}
      />
    );
  };

  get containerStyle() {
    return this.props.navigationBarStyle;
  }

  get iconStyle() {
    return {color: this.props.navBarButtonColor};
  }

  render() {
    return (
      <NavBar
        navigation={this.props}
        title={this.props.title}
        renderLeft={this.renderBack}
        renderRight={this.renderSearch}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingHorizontal: 5,
    fontSize: 24,
  },
});

export default ListNavBar;
