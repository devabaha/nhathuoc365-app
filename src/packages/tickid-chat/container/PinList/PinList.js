import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ViewPropTypes,
  TouchableOpacity,
  Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IMAGE_ICON_TYPE } from '../../constants';

const MAX_PIN = 9;

class PinList extends Component {
  static propTypes = {
    data: PropTypes.array,
    services: PropTypes.array,
    pinList: PropTypes.array,
    pinListNotify: PropTypes.object,
    onPinPress: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    visible: PropTypes.bool,
    baseViewHeight: PropTypes.number,
    itemsPerRow: PropTypes.number
  };

  static defaultProps = {
    visible: false,
    baseViewHeight: 0,
    itemsPerRow: 4,
    data: [],
    services: [],
    pinList: [],
    pinListNotify: {},
    containerStyle: {},
    onPinPress: () => {
      Alert.alert('Coming soon!', 'Chức năng đang được phát triển');
    }
  };

  state = {};
  refPinList = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible !== this.props.visible && !nextProps.visible) {
      if (this.refPinList.current) {
        this.refPinList.current.scrollToOffset({ animated: false, offset: 0 });
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.visible !== this.props.visible ||
      nextProps.pinList !== this.props.pinList ||
      nextProps.pinListNotify !== this.props.pinListNotify ||
      nextProps.itemsPerRow !== this.props.itemsPerRow ||
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
      nextProps.containerStyle !== this.props.containerStyle
    ) {
      return true;
    }

    return false;
  }

  renderPin({ pin, notify, onPress }) {
    const handleOnPress = () => {
      onPress(pin);
    };
    const extraStyle = {
      width: `${100 / this.props.itemsPerRow}%`
    };

    return (
      <TouchableOpacity
        onPress={handleOnPress}
        style={[styles.buttonWrapper, extraStyle]}
      >
        <View style={styles.itemWrapper}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: pin.bgrColor
              }
            ]}
          >
            {pin.iconType === IMAGE_ICON_TYPE ? (
              <Image style={styles.icon} source={{ uri: pin.icon }} />
            ) : (
              <MaterialCommunityIcons name={pin.icon} color="#fff" size={32} />
            )}
          </View>
          <Text style={styles.title}>{pin.title}</Text>

          {!!notify && (
            <View style={styles.notifyWrapper}>
              <Text style={styles.notify}>
                {notify > MAX_PIN ? `${notify}+` : notify}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('^^^^^^^ render pinlist');
    const extraProps = {
      zIndex: this.props.visible ? 1 : 0,
      height: this.props.baseViewHeight
    };

    return (
      <Animated.View
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        onStartShouldSetPanResponderCapture={() => !this.props.visible}
        style={[styles.container, extraProps, this.props.containerStyle]}
      >
        <FlatList
          ref={this.refPinList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          data={this.props.pinList}
          extraData={this.props.notify}
          renderItem={({ item: pin }) => {
            let notify = Object.keys(this.props.pinListNotify).find(
              type => pin.type === type
            );
            notify = notify ? this.props.pinListNotify[notify] : 0;

            return this.renderPin({
              pin,
              notify,
              onPress: this.props.onPinPress
            });
          }}
          keyExtractor={item => item.type}
          numColumns={this.props.itemsPerRow}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 12,
    position: 'absolute',
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  itemWrapper: {
    alignItems: 'center'
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#333',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 45,
    height: 45
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
    marginTop: 6
  },
  notifyWrapper: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: 'red',
    top: -10,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10
  },
  notify: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default PinList;
