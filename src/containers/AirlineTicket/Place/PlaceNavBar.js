import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {NavBar, TextButton, Input, IconButton, Icon} from 'src/components/base';

class PlaceNavBar extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onChangeText: PropTypes.func,
  };

  static defaultProps = {
    onChangeText: (value) => value,
  };

  state = {
    keyword: '',
  };

  get theme() {
    return getTheme(this);
  }

  onChangeTextValue = (value) => {
    this.setState(
      {
        keyword: value,
      },
      () => {
        this.props.onChangeText(value);
      },
    );
  };

  clearKeyWork = () => {
    return this.setState(
      {
        keyword: '',
      },
      () => {
        this.props.onChangeText('');
      },
    );
  };

  renderNavBar = () => {
    return (
      <View style={this.containerStyle}>
        <View style={this.middleContainerStyle}>
          <Icon
            neutral
            bundle={BundleIconSetName.FONT_AWESOME}
            style={styles.searchIcon}
            name="search"
          />
          <Input
            type={TypographyType.LABEL_MEDIUM}
            style={[styles.searchInput, this.searchInputStyle]}
            placeholder={this.props.t('placeholder')}
            placeholderTextColor={this.placeholderTextColor}
            onChangeText={this.onChangeTextValue}
            value={this.state.keyword}
            numberOfLines={1}
            autoFocus={this.props.autoFocus}
          />

          {this.state.keyword != '' && (
            <IconButton
              style={styles.clearWrapper}
              iconStyle={[styles.clearSearchIcon]}
              onPress={this.clearKeyWork}
              name="times-circle"
              bundle={BundleIconSetName.FONT_AWESOME}
            />
          )}
        </View>
        <TextButton
          style={styles.cancelButton}
          typoProps={{type: TypographyType.LABEL_LARGE}}
          titleStyle={this.rightButtonTitleStyle}
          onPress={() => {
            Keyboard.dismiss();
            pop();
          }}>
          {this.props.t('voucher:modal.close')}
        </TextButton>
      </View>
    );
  };

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

  get searchInputStyle() {
    return {
      color: this.theme.color.onOverlay,
    };
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderBottomColor: this.theme.color.border,
    });
  }

  render() {
    return (
      <NavBar
        navigation={this.props.navigation}
        renderHeader={() => this.renderNavBar()}
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
    fontSize: 16,
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

export default withTranslation(['airlineTicket', 'voucher'])(PlaceNavBar);
