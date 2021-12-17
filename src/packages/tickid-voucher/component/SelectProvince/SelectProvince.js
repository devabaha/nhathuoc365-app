import React, {Component} from 'react';
import {View, Image, StyleSheet, Animated, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
// configs
import config from '../../config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// images
import iconSearch from '../../assets/images/icon_search.png';
import iconChecked from '../../assets/images/icon_checked.png';
// custom components
import {
  Container,
  Input,
  FlatList,
  BaseButton,
  Typography,
  TextButton,
} from 'src/components/base';
import Header from './Header';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class SelectProvince extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    provinceSelected: PropTypes.string,
    listCities: PropTypes.array,
    dataKey: PropTypes.string,
  };

  static defaultProps = {
    onClose: defaultListener,
    onSelect: defaultListener,
    provinceSelected: '',
    listCities: [],
    dataKey: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
      keyboardShow: false,
      keyboardHeight: 0,
      searchText: '',
    };
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.startAnimation(this.state.opacity, 1, ANIMATION_TIME);
    this.startAnimation(this.state.bottom, 0, ANIMATION_TIME);
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = (e) => {
    this.setState({
      keyboardShow: true,
      keyboardHeight: e.endCoordinates.height,
    });
    this.startAnimation(this.state.bottom, e.endCoordinates.height, 200);
  };

  keyboardWillHide = () => {
    this.setState({
      keyboardShow: false,
      keyboardHeight: 0,
    });
    this.startAnimation(this.state.bottom, 0, 200);
  };

  startAnimation(animation, toValue, duration) {
    Animated.timing(animation, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  }

  closing;

  onClose = () => {
    if (this.closing) return;
    this.closing = true;

    this.startAnimation(this.state.opacity, 0, ANIMATION_CLOSE_TIME);
    this.startAnimation(this.state.bottom, -20, ANIMATION_CLOSE_TIME);

    setTimeout(() => {
      this.props.onClose();
    }, ANIMATION_CLOSE_TIME);
  };

  onSelect = (province) => {
    this.onClose();

    setTimeout(() => {
      this.props.onSelect(province);
    }, ANIMATION_TIME);
  };

  renderProvince = ({item: province}) => {
    let displayProvince = this.props.dataKey
      ? province[this.props.dataKey]
      : province;
    const isActive = this.props.provinceSelected === displayProvince;
    return (
      <TextButton
        style={[
          this.provinceItemWrapStyle,
          {
            borderBottomWidth: this.props.last ? 0 : 1,
            backgroundColor: isActive
              ? this.theme.color.contentBackgroundWeak
              : this.theme.color.surface,
          },
        ]}
        type={TypographyType.LABEL_SEMI_LARGE}
        onPress={() => this.onSelect(province)}>
        <Typography style={[styles.provinceItem]}>{displayProvince}</Typography>

        {isActive && <Image style={styles.iconChecked} source={iconChecked} />}
      </TextButton>
    );
  };

  handleSearch = (searchText) => {
    this.setState({searchText});
  };

  get listCities() {
    const {searchText} = this.state;
    if (searchText) {
      return this.props.listCities.filter((city) => {
        let cityName = this.props.dataKey ? city[this.props.dataKey] : city;
        return cityName.toLowerCase().includes(searchText.toLowerCase());
      });
    }
    return this.props.listCities;
  }

  get hasResult() {
    return Array.isArray(this.listCities) && this.listCities.length > 0;
  }

  get defaultIndex() {
    if (this.hasResult) {
      let index = this.listCities.findIndex(
        (city) => city.name === this.props.provinceSelected,
      );
      index === -1 && (index = 0);
      return index;
    }

    return 0;
  }

  get containerStyle() {
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom,
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
    }
    return mergeStyles(containerStyle, {
      backgroundColor: this.theme.color.overlay30,
    });
  }

  get contentStyle() {
    const contentStyle = {};

    if (this.state.keyboardShow) {
      if (config.device.isIphoneX) {
        const iPhoneXBuffer =
          config.device.statusBarHeight + config.device.bottomSpace;
        contentStyle.height = Math.floor(
          config.device.height - this.state.keyboardHeight - iPhoneXBuffer,
        );
      } else {
        contentStyle.height = Math.floor(
          config.device.height -
            this.state.keyboardHeight -
            config.device.statusBarHeight,
        );
      }
    } else {
      contentStyle.height = 360;
      contentStyle.paddingBottom = config.device.bottomSpace;
    }

    return mergeStyles(contentStyle, {
      borderTopLeftRadius: this.theme.layout.borderRadiusSmall,
      borderTopRightRadius: this.theme.layout.borderRadiusSmall,
    });
  }

  get searchInputStyle() {
    return mergeStyles(styles.searchInput, {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
      borderRadius: this.theme.layout.borderRadiusSmall,
    });
  }

  get provinceItemWrapStyle() {
    return mergeStyles(styles.provinceItemWrap, {
      borderColor: this.theme.color.border,
    });
  }

  render() {
    const {t} = this.props;
    return (
      <Container animated style={[styles.container, this.containerStyle]}>
        <BaseButton
          containerStyle={styles.btnCloseTransparent}
          onPress={this.onClose}
        />

        <Container style={[styles.content, this.contentStyle]}>
          <Header
            closeTitle={t('modal.close')}
            title={t('modal.province.title')}
            onClose={this.onClose}
          />

          <View style={styles.searchWrapper}>
            <Image style={styles.searchIcon} source={iconSearch} />
            <Input
              style={this.searchInputStyle}
              placeholder={t('modal.province.placeholder')}
              onChangeText={this.handleSearch}
              value={this.state.searchText}
            />
          </View>

          {this.hasResult ? (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={this.listCities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderProvince}
              initialScrollIndex={this.defaultIndex}
              getItemLayout={(data, index) => {
                return {
                  length: 50,
                  offset: 50 * index,
                  index,
                };
              }}
            />
          ) : (
            <View style={styles.noResultWrapper}>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.noResult}>
                {t('modal.province.notFound', {
                  searchText: this.state.searchText,
                })}
              </Typography>
            </View>
          )}
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  btnCloseTransparent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 40,
    zIndex: 2,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    top: 26,
    left: 24,
    width: 20,
    height: 20,
  },
  searchInput: {
    marginVertical: 16,
    paddingVertical: 11,
    paddingLeft: 34,
    paddingRight: 8,
  },
  provinceItemWrap: {
    justifyContent: 'space-between',
    height: 50,
    flexDirection: 'row',
  },
  provinceItem: {
    fontWeight: '400',
    padding: 15,
    flex: 1,
  },
  iconChecked: {
    width: 20,
    height: 20,
    marginRight: 15,
    alignSelf: 'center',
  },
  noResultWrapper: {
    marginHorizontal: 16,
    paddingVertical: 20,
  },
  noResult: {
    fontWeight: '400',
  },
});

export default withTranslation('voucher')(SelectProvince);
