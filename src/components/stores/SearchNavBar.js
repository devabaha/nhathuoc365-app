import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Platform, StyleSheet, View} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {NavBar, TextButton, Icon, Input, IconButton} from 'src/components/base';

const defaultListener = () => {};

class SearchNavBar extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string,
  };

  static defaultProps = {
    onCancel: defaultListener,
    onSearch: defaultListener,
    onClearText: defaultListener,
    placeholder: '',
    searchValue: '',
  };

  get theme() {
    return getTheme(this);
  }

  get rightButtonTitleStyle() {
    return {color: this.theme.color.onNavBarBackground};
  }

  get middleContainerStyle() {
    return [
      styles.searchWrapper,
      {
        backgroundColor: this.theme.color.overlay60,
      },
    ];
  }

  get placeholderTextColor() {
    return this.theme.color.onOverlay;
  }

  get clearWrapperStyle() {
    return [
      styles.clearWrapper,
      {
        backgroundColor: this.theme.color.neutral,
      },
    ];
  }

  get searchInputStyle() {
    return {
      color: this.theme.color.onOverlay,
    };
  }

  renderRight = () => {
    return (
      <TextButton
        style={styles.cancelButton}
        typoProps={{type: TypographyType.LABEL_LARGE}}
        titleStyle={this.rightButtonTitleStyle}
        onPress={() => {
          pop();
          this.props.onCancel();
        }}>
        {this.props.t('cancel')}
      </TextButton>
    );
  };

  renderMiddle = () => {
    return (
      <View style={this.middleContainerStyle}>
        <Icon
          neutral
          bundle={BundleIconSetName.IONICONS}
          style={styles.searchIcon}
          name="ios-search"
        />
        <Input
          type={TypographyType.LABEL_MEDIUM}
          style={[styles.searchInput, this.searchInputStyle]}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.placeholderTextColor}
          onChangeText={this.props.onSearch}
          value={this.props.searchValue}
          numberOfLines={1}
          autoFocus={this.props.autoFocus}
        />

        {!!this.props.searchValue && (
          <IconButton
            style={this.clearWrapperStyle}
            iconStyle={styles.clearSearchIcon}
            onPress={this.props.onClearText}
            name="ios-close"
            bundle={BundleIconSetName.IONICONS}
          />
        )}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.container}>
        {this.renderMiddle()}
        {this.renderRight()}
      </View>
    );
  };

  render() {
    return (
      <NavBar
        navigation={this.props.navigation}
        renderHeader={this.renderHeader}
        back={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  cancelButton: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  searchIcon: {
    fontSize: 20,
  },
  clearWrapper: {
    width: 16,
    height: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearSearchIcon: {
    fontSize: 13,
  },
  searchWrapper: {
    flex: 1,
    paddingLeft: 10,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: Platform.OS === 'ios' ? 6 : 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default withTranslation()(SearchNavBar);
