import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  Animated,
  Keyboard
} from 'react-native';
import Header from './Header';
import iconSearch from '../../assets/images/icon_search.png';
import iconChecked from '../../assets/images/icon_checked.png';

const ANIMATION_TIME = 250;
const ANIMATION_CLOSE_TIME = 150;

const defaultListener = () => {};

class SelectProvince extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    provinceSelected: PropTypes.string,
    listCities: PropTypes.array
  };

  static defaultProps = {
    onClose: defaultListener,
    onSelect: defaultListener,
    provinceSelected: '',
    listCities: []
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
      keyboardShow: false,
      keyboardHeight: 0,
      searchText: ''
    };
  }

  componentDidMount() {
    this.startAnimation(this.state.opacity, 1, ANIMATION_TIME);
    this.startAnimation(this.state.bottom, 0, ANIMATION_TIME);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = e => {
    this.setState({
      keyboardShow: true,
      keyboardHeight: e.endCoordinates.height
    });
    this.startAnimation(this.state.bottom, e.endCoordinates.height, 200);
  };

  keyboardWillHide = () => {
    this.setState({
      keyboardShow: false,
      keyboardHeight: 0
    });
    this.startAnimation(this.state.bottom, 0, 200);
  };

  startAnimation(animation, toValue, duration) {
    Animated.timing(animation, { toValue, duration }).start();
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

  onSelect = province => {
    this.onClose();

    setTimeout(() => {
      this.props.onSelect(province);
    }, ANIMATION_TIME);
  };

  renderProvince = ({ item: province }) => {
    const isActive = this.props.provinceSelected === province;
    return (
      <Button
        containerStyle={[
          styles.provinceItemWrap,
          {
            borderBottomWidth: this.props.last ? 0 : 1,
            backgroundColor: isActive ? '#f7f6fb' : config.colors.white
          }
        ]}
        style={styles.provinceItem}
        onPress={() => this.onSelect(province)}
      >
        <Text style={styles.provinceItem}>{province}</Text>
        {isActive && <Image style={styles.iconChecked} source={iconChecked} />}
      </Button>
    );
  };

  get containerStyle() {
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
    }
    return containerStyle;
  }

  get contentStyle() {
    const contentStyle = {};

    if (this.state.keyboardShow) {
      if (config.device.isIphoneX) {
        const iPhoneXBuffer =
          config.device.statusBarHeight + config.device.bottomSpace;
        contentStyle.height = Math.floor(
          config.device.height - this.state.keyboardHeight - iPhoneXBuffer
        );
      } else {
        contentStyle.height = Math.floor(
          config.device.height - this.state.keyboardHeight
        );
      }
    } else {
      contentStyle.height = 360;
      contentStyle.marginBottom = config.device.bottomSpace;
    }
    return contentStyle;
  }

  handleSearch = searchText => {
    this.setState({ searchText });
  };

  get listCities() {
    const { searchText } = this.state;
    if (searchText) {
      return this.props.listCities.filter(cityName => {
        return cityName.toLowerCase().includes(searchText.toLowerCase());
      });
    }
    return this.props.listCities;
  }

  get hasResult() {
    return Array.isArray(this.listCities) && this.listCities.length > 0;
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.containerStyle]}>
        <Button
          containerStyle={styles.btnCloseTransparent}
          onPress={this.onClose}
        />

        <View style={[styles.content, this.contentStyle]}>
          <Header onClose={this.onClose} />

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.searchWrapper}>
              <Image style={styles.searchIcon} source={iconSearch} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm"
                onChangeText={this.handleSearch}
                value={this.state.searchText}
              />
            </View>

            {this.hasResult ? (
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={this.listCities}
                keyExtractor={item => item}
                renderItem={this.renderProvince}
              />
            ) : (
              <View style={styles.noResultWrapper}>
                <Text style={styles.noResult}>
                  Không có kết quả phù hợp cho "{this.state.searchText}"
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  btnCloseTransparent: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  },
  content: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: config.colors.white,
    minHeight: 40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: 2
  },
  searchWrapper: {
    paddingHorizontal: 16,
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    top: 26,
    left: 24,
    width: 20,
    height: 20
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 16,
    paddingVertical: 11,
    paddingLeft: 34,
    paddingRight: 8,
    fontSize: 14,
    color: '#666'
  },
  provinceItemWrap: {
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderColor: '#fafafa',
    paddingHorizontal: 16
  },
  provinceItem: {
    fontSize: 15,
    fontWeight: '400',
    color: '#444'
  },
  iconChecked: {
    width: 20,
    height: 20
  },
  noResultWrapper: {
    marginHorizontal: 16,
    paddingVertical: 20
  },
  noResult: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400'
  }
});

export default SelectProvince;
