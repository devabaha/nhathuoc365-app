import React, {Component} from 'react';
import {StyleSheet, Animated, Easing, View} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import {hexToRgba} from 'app-helper';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Input,
  Icon,
  Container,
  TextButton,
  BaseButton,
  NavBar,
} from 'src/components/base';

const defaultListener = () => {};
const DURATION_FADE = 300;

class SearchNavBar extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onRight: PropTypes.func,
    onChangeSearch: PropTypes.func,
    onClearText: PropTypes.func,
    rightTitle: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchValue: PropTypes.string,
  };

  static defaultProps = {
    onRight: defaultListener,
    onChangeSearch: defaultListener,
    onClearText: defaultListener,
    searchValue: '',
  };

  state = {
    focus: false,
    fadeAnimation: new Animated.Value(0),
  };
  refInput = null;

  rightTitleTypoProps = {
    onPrimary: true,
  };

  get theme() {
    return getTheme(this);
  }

  handleFocusInput() {
    this.setState({focus: true});
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      easing: Easing.ease,
      duration: DURATION_FADE,
      useNativeDriver: false,
    }).start();
  }

  handleBlurInput() {
    this.setState({focus: false});
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0,
      easing: Easing.ease,
      duration: DURATION_FADE,
      useNativeDriver: false,
    }).start();
  }

  toggleSearch() {
    if (this.state.focus) {
      if (this.refInput) {
        this.refInput._root.blur();
      } else {
        this.handleBlurInput();
      }
    } else {
      if (this.refInput) {
        this.refInput._root.focus();
      } else {
        this.handleFocusInput();
      }
    }
  }

  handleBack() {
    pop();
  }

  renderSearch = () => {
    const placeholder =
      this.props.searchPlaceholder || this.props.t('enterToSearch');

    const searchInputBackgroundColor = [
      hexToRgba(this.theme.color.coreOverlay, 0),
      hexToRgba(this.theme.color.coreOverlay, 0.4),
    ];

    return (
      <Container row noBackground style={styles.headerContainer}>
        <View style={styles.searchInput}>
          <Animated.View
            style={[
              styles.inputAnimatedWrapper,
              this.inputAnimatedWrapperStyle,
              {
                backgroundColor: this.state.fadeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: searchInputBackgroundColor,
                }),
              },
            ]}>
            <BaseButton onPress={this.toggleSearch.bind(this)}>
              <Animated.View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginRight: 8,
                }}>
                <Icon
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-search"
                  size={20}
                  style={[styles.searchIcon, this.searchIconStyle]}
                />
              </Animated.View>
            </BaseButton>
            <Input
              ref={(inst) => (this.refInput = inst)}
              placeholder={placeholder}
              onChangeText={this.props.onChangeSearch}
              onFocus={this.handleFocusInput.bind(this)}
              onBlur={this.handleBlurInput.bind(this)}
              autoFocus
              style={[styles.input, this.inputStyle]}
            />
          </Animated.View>
        </View>
        {this.renderCancelButton()}
      </Container>
    );
  };

  renderCancelButton = () => {
    const rightTitle = this.props.rightTitle || this.props.t('cancel');

    return (
      <TextButton
        typoProps={this.rightTitleTypoProps}
        style={styles.btnCancel}
        onPress={this.handleBack.bind(this)}>
        {rightTitle}
      </TextButton>
    );
  };

  get searchIconStyle() {
    return {
      color: this.theme.color.placeholder,
    };
  }

  get inputStyle() {
    return mergeStyles(this.theme.typography[TypographyType.LABEL_LARGE], {
      color: this.theme.color.onOverlay,
    });
  }

  get inputAnimatedWrapperStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }

  render() {
    return (
      <NavBar
        navigation={this.props.navigation}
        renderHeader={this.renderSearch}
        back={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: appConfig.device.isAndroid ? 8 : 6,
  },
  searchInput: {
    flex: 1,
  },
  btnCancel: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  inputAnimatedWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 0,
  },
  searchIcon: {
    fontSize: 22,
  },
});

export default withTranslation()(SearchNavBar);
