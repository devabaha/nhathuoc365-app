
import React, {
  PropTypes,
} from 'react';

import {
  Platform,
  Animated,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  TextInput,
  Keyboard
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import _drawerImage from '../images/menu_burger.png';
import _backButtonImage from '../images/back_chevron.png';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: TITLE_HEADER_COLOR,
    fontSize: 18,
    width: 180,
    alignSelf: 'center',
  },
  titleImage: {
    width: 180,
    alignSelf: 'center',
  },
  titleWrapper: {
    marginTop: 10,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 5,
      },
      windows: {
        top: 5,
      },
    }),
    left: 0,
    right: 0,
  },
  header: {
    backgroundColor: HEADER_BGR,
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 54,
      },
      windows: {
        height: 54,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#cccccc",
    position: 'absolute'
  },
  backButton: {
    height: 37,
    minWidth: 44,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 22,
      },
      android: {
        top: 10,
      },
      windows: {
        top: 8,
      },
    }),
    left: 2,
    padding: 8,
    flexDirection: 'row',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  rightButton: {
    height: 37,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 22,
      },
      android: {
        top: 10,
      },
      windows: {
        top: 8,
      },
    }),
    right: 2,
    padding: 8,
  },
  leftButton: {
    height: 37,
    minWidth: 44,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 20,
      },
      android: {
        top: 8,
      },
      windows: {
        top: 8,
      },
    }),
    left: 2,
    padding: 8,
  },
  barRightButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'right',
    fontSize: 17,
  },
  barBackButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 6,
  },
  barLeftButtonText: {
    color: 'rgb(0, 122, 255)',
    textAlign: 'left',
    fontSize: 17,
  },
  backButtonImage: {
    width: 13,
    height: 21,
  },
  defaultImageStyle: {
    height: 24,
    resizeMode: 'contain',
  },
});

const propTypes = {
  navigationState: PropTypes.object,
  backButtonImage: Image.propTypes.source,
  wrapBy: PropTypes.any,
  component: PropTypes.any,
  backButtonTextStyle: Text.propTypes.style,
  leftButtonStyle: ViewPropTypes.style,
  leftButtonIconStyle: Image.propTypes.style,
  getTitle: PropTypes.func,
  titleWrapperStyle: Text.propTypes.style,
  titleStyle: Text.propTypes.style,
  titleOpacity: PropTypes.number,
  titleProps: PropTypes.any,
  position: PropTypes.object,
  navigationBarStyle: ViewPropTypes.style,
  navigationBarBackgroundImage: Image.propTypes.source,
  navigationBarBackgroundImageStyle: Image.propTypes.style,
  navigationBarTitleImage: Image.propTypes.source,
  navigationBarTitleImageStyle: Image.propTypes.style,
  navigationBarShowImageSelection: PropTypes.bool,
  navigationBarSelecionStyle: ViewPropTypes.style,
  renderTitle: PropTypes.any,

  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  showSearchBar: PropTypes.bool,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  searchValue: PropTypes.string,
  onSearchCancel: PropTypes.func,
  onFocus: PropTypes.func,
  onCleanSearch: PropTypes.func,
  inputAnimate: PropTypes.bool,
  cancelIsPop: PropTypes.bool,
  searchOnpress: PropTypes.func,
  smallSearch: PropTypes.bool
};

const contextTypes = {
  drawer: PropTypes.object
};

const defaultProps = {
  drawerImage: _drawerImage,
  backButtonImage: _backButtonImage,
  titleOpacity: 1,
};

class NavBar extends React.Component {

  constructor(props) {
    super(props);

    this.renderRightButton = this.renderRightButton.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.renderLeftButton = this.renderLeftButton.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderImageTitle = this.renderImageTitle.bind(this);
    this._enableSearch = this._enableSearch.bind(this);

    this.state = {
      search_width: Util.size.width * 0.75,
      search_left: Util.size.width * 0.25 / 2,
      autoFocus: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this._searchFocus(nextProps);
  }

  _searchFocus(nextProps) {
    if (nextProps.searchValue == this.props.searchValue) {
      return;
    }

    if (nextProps.autoFocus) {
      setTimeout(() => {
        if (this.refs_search_input) {
          this.refs_search_input.focus();
        }
      }, 450);
    }
  }

  renderBackButton() {
    const state = this.props.navigationState;
    const childState = state.children[state.index];
    const BackButton = (childState.component && childState.component.backButton) || state.backButton
      || childState.backButton;
    const textButtonStyle = [
      styles.barBackButtonText,
      this.props.backButtonTextStyle,
      state.backButtonTextStyle,
      childState.backButtonTextStyle,
    ];
    const style = [
      styles.backButton,
      this.props.leftButtonStyle,
      state.leftButtonStyle,
      childState.leftButtonStyle,
    ];

    if (state.index === 0 && (!state.parentIndex || state.parentIndex === 0)) {
      return null;
    }

    if (BackButton) {
      return (
        <BackButton
          testID="backNavButton"
          textButtonStyle={textButtonStyle}
          {...childState}
          style={style}
        />
      );
    }
    const buttonImage = childState.backButtonImage ||
      state.backButtonImage || this.props.backButtonImage;
    let onPress = childState.onBack || childState.component.onBack;
    if (onPress) {
      onPress = onPress.bind(null, state);
    } else {
      onPress = Actions.pop;
    }

    const text = childState.backTitle ?
      (<Text style={textButtonStyle}>
        {childState.backTitle}
      </Text>)
      : null;

    return (
      <TouchableOpacity
        testID="backNavButton"
        style={style}
        onPress={onPress}
      >
        {buttonImage && !childState.hideBackImage &&
          <Image
            source={buttonImage}
            style={[
              styles.backButtonImage,
              this.props.leftButtonIconStyle,
              state.barButtonIconStyle,
              state.leftButtonIconStyle,
              childState.leftButtonIconStyle,
            ]}
          />
        }
        {text}
      </TouchableOpacity>
    );
  }

  renderRightButton(navProps) {
    const self = this;
    const drawer = this.context.drawer;
    function tryRender(state, wrapBy) {
      if (!state) {
        return null;
      }

      let onPress = state.onRight;
      let buttonImage = state.rightButtonImage;
      let menuIcon = state.drawerIcon;
      const style = [styles.rightButton, self.props.rightButtonStyle, state.rightButtonStyle];
      const textStyle = [styles.barRightButtonText, self.props.rightButtonTextStyle,
        state.rightButtonTextStyle];
      const rightButtonStyle = [styles.defaultImageStyle, state.rightButtonIconStyle];
      const rightTitle = state.getRightTitle ? state.getRightTitle(navProps) : state.rightTitle;

      if (state.rightButton) {
        let Button = state.rightButton;
        if (wrapBy) {
          Button = wrapBy(Button);
        }
        return (
          <Button
            {...self.props}
            {...state}
            key={'rightNavBarBtn'}
            testID="rightNavButton"
            style={style}
            textButtonStyle={textStyle}
          />
        );
      }

      if (!onPress && !!drawer && typeof drawer.toggle === 'function' && drawer.props.side === 'right') {
        buttonImage = state.drawerImage;
        if (buttonImage || menuIcon) {
          onPress = drawer.toggle;
        }
        if (!menuIcon) {
          menuIcon = (
            <Image
              source={buttonImage}
              style={rightButtonStyle}
            />
          );
        }
      }

      if (onPress && (rightTitle || buttonImage)) {
        onPress = onPress.bind(null, state);
        return (
          <TouchableOpacity
            key={'rightNavBarBtn'}
            testID="rightNavButton"
            style={style}
            onPress={onPress}
          >
            {rightTitle &&
              <Text style={textStyle}>
                {rightTitle}
              </Text>
            }
            {buttonImage &&
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                {menuIcon || <Image
                  source={buttonImage}
                  style={state.rightButtonIconStyle || styles.defaultImageStyle}
                />
                }
              </View>
            }
          </TouchableOpacity>
        );
      }
      if ((!!state.onRight ^ !!(typeof (rightTitle) !== 'undefined'
        || typeof (buttonImage) !== 'undefined'))) {
        console.warn(
          `Both onRight and rightTitle/rightButtonImage
            must be specified for the scene: ${state.name}`,
        );
      }
      return null;
    }
    return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
  }

  renderLeftButton(navProps) {
    const self = this;
    const drawer = this.context.drawer;
    function tryRender(state, wrapBy) {
      let onPress = state.onLeft;
      let buttonImage = state.leftButtonImage;
      let menuIcon = state.drawerIcon;
      const style = [styles.leftButton, self.props.leftButtonStyle, state.leftButtonStyle];
      const textStyle = [styles.barLeftButtonText, self.props.leftButtonTextStyle,
        state.leftButtonTextStyle];
      const leftButtonStyle = [styles.defaultImageStyle, state.leftButtonIconStyle];
      const leftTitle = state.getLeftTitle ? state.getLeftTitle(navProps) : state.leftTitle;

      if (state.leftButton) {
        let Button = state.leftButton;
        if (wrapBy) {
          Button = wrapBy(Button);
        }
        return (
          <Button
            {...self.props}
            {...state}
            key={'leftNavBarBtn'}
            testID="leftNavButton"
            style={style}
            textStyle={textStyle}
          />
        );
      }

      if (!onPress && !!drawer && typeof drawer.toggle === 'function' && drawer.props.side === 'left') {
        buttonImage = state.drawerImage;
        if (buttonImage || menuIcon) {
          onPress = drawer.toggle;
        }
        if (!menuIcon) {
          menuIcon = (
            <Image
              source={buttonImage}
              style={leftButtonStyle}
            />
          );
        }
      }

      if (onPress && (leftTitle || buttonImage)) {
        onPress = onPress.bind(null, state);
        return (
          <TouchableOpacity
            key={'leftNavBarBtn'}
            testID="leftNavButton"
            style={style}
            onPress={onPress}
          >
            {leftTitle &&
              <Text style={textStyle}>
                {leftTitle}
              </Text>
            }
            {buttonImage &&
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                {menuIcon || <Image
                  source={buttonImage}
                  style={state.leftButtonIconStyle || styles.defaultImageStyle}
                />
                }
              </View>
            }
          </TouchableOpacity>
        );
      }
      if ((!!state.onLeft ^ !!(leftTitle || buttonImage))) {
        console.warn(
          `Both onLeft and leftTitle/leftButtonImage
            must be specified for the scene: ${state.name}`,
        );
      }
      return null;
    }
    return tryRender(this.props.component, this.props.wrapBy) || tryRender(this.props);
  }

  _enableSearch() {
    Actions.refresh({
      rightTitle: "Huỷ",
      onRight: () => {
        Keyboard.dismiss();

        if (this.props.onSearchCancel) {
          this.props.onSearchCancel();
        }

        if (this.props.cancelIsPop) {
          return Actions.pop();
        }

        Actions.refresh({
          searchValue: ''
        });
      },
      rightButtonTextStyle: {
        color: "#ebebeb",
        fontSize: 14,
        marginTop: isIOS ? 1 : 1,
        marginRight: 2
      },
      // hideBackImage: this.props.inputAnimate ? true : false
    });

    // if (this.props.inputAnimate) {
    //   layoutAnimation();
    //
    //   this.setState({
    //     search_width: Util.size.width * 0.85
    //   });
    // }
  }

  renderTitle(childState, index:number) {
    let title = this.props.getTitle ? this.props.getTitle(childState) : childState.title;
    if (title === undefined && childState.component && childState.component.title) {
      title = childState.component.title;
    }
    if (typeof (title) === 'function') {
      title = title(childState);
    }

    if (this.props.showSearchBar) {
      return (
        <Animated.View
          key={childState.key}
          style={[
            styles.titleWrapper,
            this.props.titleWrapperStyle,
            {
              height: 34,
              width: Util.size.width,
              alignItems: 'flex-end'
            }
          ]}
        >
          <Animated.View
            lineBreakMode="tail"
            numberOfLines={1}
            {...this.props.titleProps}
            style={[
              {
                opacity: this.props.position.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0, this.props.titleOpacity, 0],
                }),
                left: this.props.position.interpolate({
                  inputRange: [index - 1, index + 1],
                  outputRange: [200, -200],
                }),
                right: this.props.position.interpolate({
                  inputRange: [index - 1, index + 1],
                  outputRange: [-200, 200],
                }),
                backgroundColor: "rgba(0,0,0,0.6)",
                width: this.props.smallSearch ? (this.state.search_width - Util.size.width * 0.25 / 2) : this.state.search_width,
                marginRight: this.props.smallSearch ? (Util.size.width * 0.25) : (Util.size.width * 0.25 / 2),
                height: isIOS ? 28 : 32,
                top: isIOS ? -3 : -2,
                borderRadius: 3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }
            ]}
          >
            <Icon
              style={{
                marginLeft: 8
              }}
              name="search" size={12} color="#999999" />

            {this.props.searchOnpress ? (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  width: this.state.search_width - (Util.size.width * 0.25 / 2),
                  height: '100%'
                }}
                onPress={this.props.searchOnpress}
                returnKeyType="search"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent">

                  <Text
                    style={{
                    fontSize: 14,
                    color: "#999999",
                    paddingHorizontal: 4,
                    paddingVertical: 0
                  }}>{sub_string(this.props.placeholder, 20) || "Tìm kiếm"}</Text>

                </TouchableOpacity>
            ) : (
              <TextInput
                ref={ref => this.refs_search_input = ref}
                placeholder={this.props.placeholder || "Tìm kiếm"}
                returnKeyType="search"
                placeholderTextColor="#999999"
                underlineColorAndroid="transparent"
                selectTextOnFocus
                style={{
                  fontSize: 14,
                  color: "#ffffff",
                  paddingHorizontal: 4,
                  paddingVertical: 0,
                  width: this.state.search_width - (Util.size.width * 0.25 / 2),
                  height: '100%'
                }}
                value={this.props.searchValue}
                onChangeText={this.props.onChangeText}
                onSubmitEditing={this.props.onSubmitEditing}
                autoFocus={this.state.autoFocus}
                onFocus={() => {
                  this._enableSearch();

                  if (this.props.onFocus) {
                    this.props.onFocus();
                  }
                }}
                onBlur={() => {
                  var hideBackBtn = this.props.hideBackBtn === true;

                  Actions.refresh({
                    rightTitle: undefined,
                    onRight: undefined,
                    // hideBackImage: hideBackBtn ? true : false
                  });

                  // if (!hideBackBtn) {
                  //   layoutAnimation();
                  //
                  //   this.setState({
                  //     search_width: Util.size.width * 0.75
                  //   });
                  // }
                }}
               />
            )}

            {this.props.searchValue != '' && this.props.searchValue != null ? (
              <TouchableOpacity
                underlayColor="transparent"
                onPress={() => {
                  Actions.refresh({
                    searchValue: ''
                  });
                  if (this.props.onCleanSearch) {
                    this.props.onCleanSearch();
                  }
                  if (this.refs_search_input) {
                    this.refs_search_input.focus();
                  }
                }}>
                <Icon
                  style={{
                    marginLeft: 8
                  }}
                  name="times-circle" size={14} color="#999999" />
              </TouchableOpacity>
            ) : this.props.renderIconInput ? (
              this.props.renderIconInput()
            ) : null}
          </Animated.View>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          key={childState.key}
          style={[
            styles.titleWrapper,
            this.props.titleWrapperStyle,
          ]}
        >
          <Animated.Text
            lineBreakMode="tail"
            numberOfLines={1}
            {...this.props.titleProps}
            style={[
              styles.title,
              this.props.titleStyle,
              this.props.navigationState.titleStyle,
              childState.titleStyle,
              {
                opacity: this.props.position.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [0, this.props.titleOpacity, 0],
                }),
                left: this.props.position.interpolate({
                  inputRange: [index - 1, index + 1],
                  outputRange: [200, -200],
                }),
                right: this.props.position.interpolate({
                  inputRange: [index - 1, index + 1],
                  outputRange: [-200, 200],
                }),
              },
            ]}
          >
            {title}
          </Animated.Text>
        </Animated.View>
      );
    }
  }

  renderImageTitle() {
    const state = this.props.navigationState;
    const navigationBarTitleImage = this.props.navigationBarTitleImage ||
      state.navigationBarTitleImage;
    const navigationBarTitleImageStyle = this.props.navigationBarTitleImageStyle ||
      state.navigationBarTitleImageStyle;
    const navigationBarShowImageSelection = this.props.navigationBarShowImageSelection ||
      state.navigationBarShowImageSelection || false;
    const navigationBarSelecionStyle = this.props.navigationBarSelecionStyle ||
      state.navigationBarSelecionStyle || {};
    return (
      <Animated.View
        style={[
          styles.titleWrapper,
          this.props.titleWrapperStyle,
        ]}
      >
        <Animated.Image
          style={[styles.titleImage, navigationBarTitleImageStyle]}
          source={navigationBarTitleImage}
        />
        {navigationBarShowImageSelection && <Animated.View style={navigationBarSelecionStyle} />}
      </Animated.View>
    );
  }

  render() {
    let state = this.props.navigationState;
    let selected = state.children[state.index];
    while ({}.hasOwnProperty.call(selected, 'children')) {
      state = selected;
      selected = selected.children[selected.index];
    }
    const navProps = { ...this.props, ...selected };

    const wrapByStyle = (component, wrapStyle) => {
      if (!component) { return null; }
      return props => <View style={wrapStyle}>{component(props)}</View>;
    };

    const leftButtonStyle = [styles.leftButton, { alignItems: 'flex-start' }, this.props.leftButtonStyle, state.leftButtonStyle];
    const rightButtonStyle = [styles.rightButton, { alignItems: 'flex-end' }, this.props.rightButtonStyle, state.rightButtonStyle];

    const renderLeftButton = wrapByStyle(selected.renderLeftButton, leftButtonStyle) ||
      wrapByStyle(selected.component.renderLeftButton, leftButtonStyle) ||
      this.renderLeftButton;
    const renderRightButton = wrapByStyle(selected.renderRightButton, rightButtonStyle) ||
      wrapByStyle(selected.component.renderRightButton, rightButtonStyle) ||
      this.renderRightButton;
    const renderBackButton = wrapByStyle(selected.renderBackButton, leftButtonStyle) ||
      wrapByStyle(selected.component.renderBackButton, leftButtonStyle) ||
      this.renderBackButton;
    const renderTitle = selected.renderTitle ||
      selected.component.renderTitle ||
      this.props.renderTitle;
    const navigationBarBackgroundImage = this.props.navigationBarBackgroundImage ||
      state.navigationBarBackgroundImage;
    const navigationBarBackgroundImageStyle = this.props.navigationBarBackgroundImageStyle ||
      state.navigationBarBackgroundImageStyle;
    const navigationBarTitleImage = this.props.navigationBarTitleImage ||
      state.navigationBarTitleImage;
    let imageOrTitle = null;
    if (navigationBarTitleImage) {
      imageOrTitle = this.renderImageTitle();
    } else {
      imageOrTitle = renderTitle ? renderTitle(navProps)
      : state.children.map(this.renderTitle, this);
    }
    const contents = (
      <View>
        {imageOrTitle}
        {renderBackButton(navProps) || renderLeftButton(navProps)}
        {renderRightButton(navProps)}
      </View>
    );
    return (
      <Animated.View
        style={[
          styles.header,
          this.props.navigationBarStyle,
          state.navigationBarStyle,
          selected.navigationBarStyle,
        ]}
      >
        {navigationBarBackgroundImage ? (
          <Image style={navigationBarBackgroundImageStyle} source={navigationBarBackgroundImage}>
            {contents}
          </Image>
        ) : contents}
      </Animated.View>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.contextTypes = contextTypes;
NavBar.defaultProps = defaultProps;

export default NavBar;
