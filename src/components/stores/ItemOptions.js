import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import store from 'app-store';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
import ModernList, { LIST_TYPE } from 'app-packages/tickid-modern-list';
import Icon from 'react-native-vector-icons/Ionicons';
import NumberSelection from './NumberSelection';
import Button from '../Button';

class ItemOptions extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    product: PropTypes.object
  };

  static defaultProps = {
    options: [
      {
        key: 'Dung lượng',
        values: [
          {
            key: '16gb',
            value: '16 GB'
          },
          {
            key: '32gb',
            value: '32 GB'
          }
        ]
      },
      {
        key: 'Màu sắc',
        values: [
          {
            key: 'red',
            value: 'Đỏ'
          },
          {
            key: 'orange',
            value: 'Cam'
          },
          {
            key: 'yellow',
            value: 'Vàng'
          },
          {
            key: 'green',
            value: 'Lục'
          },
          {
            key: 'blue',
            value: 'Lam'
          },
          {
            key: 'indigo',
            value: 'Chàm'
          },
          {
            key: 'purple',
            value: 'Tím'
          }
        ]
      }
    ],
    product: {
      image:
        'https://cdn.tgdd.vn/Products/Images/42/200533/iphone-11-pro-max-green-600x600.jpg',
      price: '30 triệu'
    }
  };

  state = {
    product: {},
    options: this.props.options || store.cart_data.options
  };
  refModal = React.createRef();

  componentDidMount() {
    console.log(store);
  }

  handleClose = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    } else {
      Actions.pop();
    }
  };

  renderOptions() {
    return this.props.options.map((opt, indx) => {
      const extraProps =
        indx > 0 &&
        {
          // containerStyle: styles.separate
        };

      return (
        <View key={opt.key}>
          {indx > 0 && <View style={styles.separate} />}
          <ModernList
            key={opt.key}
            data={opt.values}
            mainKey="value"
            type={LIST_TYPE.TAG}
            headerTitle={opt.key}
            onPressItem={item => console.log(item)}
            headerTitleStyle={styles.label}
            // {...extraProps}
          />
        </View>
      );
    });
  }

  render() {
    return (
      <Modal
        ref={this.refModal}
        isOpen
        style={styles.container}
        position="bottom"
        onClosed={() => Actions.pop()}
        swipeToClose={false}
      >
        <View style={styles.optionListStyle}>
          <View style={styles.header}>
            <View style={styles.imgContainer}>
              <CachedImage
                mutable
                source={{ uri: this.props.product.image }}
                style={styles.image}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>{this.props.product.price}</Text>
              <Text style={styles.subText}>
                Kho: <Text>1000</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.close}
              onPress={this.handleClose}
              hitSlop={HIT_SLOP}
            >
              <Icon name="ios-close" style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          {this.renderOptions()}
          <View style={styles.quantity}>
            <Text style={styles.label}>Số lượng</Text>
            <NumberSelection
              value="1"
              min={1}
              max={99}
              onMinus={() => {}}
              onPlus={() => {}}
              // disabled
            />
          </View>

          <Button title="Thêm vào giỏ hàng" onPress={() => {}} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  optionListStyle: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  imgContainer: {
    width: 120,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  info: {
    alignSelf: 'flex-end'
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  closeIcon: {
    fontSize: 34,
    color: DEFAULT_COLOR
  },
  text: {
    fontSize: 18,
    color: '#404040',
    fontWeight: 'bold',
    marginBottom: 5
  },
  subText: {
    color: '#999',
    fontSize: 14
  },
  separate: {
    height: 0.5,
    backgroundColor: '#eee',
    marginHorizontal: 10
  },
  quantity: {
    flexDirection: 'row',
    borderColor: '#eee',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  label: {
    color: '#444',
    fontSize: 16
  }
});

export default ItemOptions;
