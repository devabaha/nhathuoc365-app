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
    provinceSelected: PropTypes.object
  };

  static defaultProps = {
    onClose: defaultListener,
    onSelect: defaultListener,
    provinceSelected: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(-20),
      keyboardHeight: 0,
      keyboardShow: false
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
  };

  keyboardWillHide = () => {
    this.setState({
      keyboardHeight: 0
    });
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
    const isActive =
      (this.props.provinceSelected && this.props.provinceSelected.id) ===
      province.id;
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
        <Text style={styles.provinceItem}>{province.name}</Text>
        {isActive && <Image style={styles.iconChecked} source={iconChecked} />}
      </Button>
    );
  };

  render() {
    const containerStyle = {
      opacity: this.state.opacity,
      bottom: this.state.bottom
    };
    if (this.state.keyboardShow) {
      containerStyle.top = 0;
      containerStyle.bottom = this.state.keyboardHeight;
    }
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Button
          containerStyle={styles.btnCloseTransparent}
          onPress={this.onClose}
        />

        <View style={styles.content}>
          <Header onClose={this.onClose} />

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.searchWrapper}>
              <Image style={styles.searchIcon} source={iconSearch} />
              <TextInput style={styles.searchInput} placeholder="Tìm kiếm" />
            </View>

            <FlatList
              keyboardShouldPersistTaps="handled"
              data={[
                { id: 1, name: 'Toàn quốc' },
                { id: 2, name: 'Hà Nội' },
                { id: 3, name: 'Hồ Chí Minh' }
              ]}
              keyExtractor={item => `${item.id}`}
              renderItem={this.renderProvince}
            />
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
  }
});

export default SelectProvince;
