import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import store from 'app-store';
import appConfig from 'app-config';
import Modal from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
import ModernList, { LIST_TYPE } from 'app-packages/tickid-modern-list';
import Icon from 'react-native-vector-icons/Ionicons';
import NumberSelection from './NumberSelection';
import Button from '../Button';
import Loading from '@tickid/tickid-rn-loading';

const ATTR_LABEL_KEY = 'attrLabelKey';
const ATTR_KEY = 'attrKey';
const LABEL_KEY = 'label';
const VALUE_KEY = 'value';
const ACTIVE_KEY = 'active';
const DISABLE_KEY = 'disabled';

class ItemOptions extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  state = {
    product: {},
    loading: false,
    animateAvoidKeyboard: new Animated.Value(0),
    viewData: [],
    models: [],
    selectedAttrs: [],
    selectedModel: {},
    quantity: 1
  };
  refModal = React.createRef();
  unmounted = false;

  componentDidMount() {
    this.getAttrs();
    Keyboard.addListener('keyboardDidShow', this.keyboardShowListener);
    Keyboard.addListener('keyboardDidHide', this.keyboardHideListener);
  }

  componentWillUnmount() {
    this.unmounted = true;
    Keyboard.removeListener('keyboardDidShow', this.keyboardShowListener);
    Keyboard.removeListener('keyboardDidHide', this.keyboardHideListener);
  }

  keyboardShowListener = e => {
    if (e.endCoordinates) {
      Animated.timing(this.state.animateAvoidKeyboard, {
        // toValue: e.endCoordinates.height,
        toValue: 30,
        useNativeDriver: true,
        duration: 300
      }).start();
    }
  };

  keyboardHideListener = e => {
    Animated.timing(this.state.animateAvoidKeyboard, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200
    }).start();
  };

  getAttrs = async () => {
    this.setState({ loading: true });

    try {
      const response = await APIHandler.site_product_attrs(
        store.store_data.id,
        this.props.itemId
      );
      console.log(response);
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS && response.data) {
          if (response.data.product) {
            this.setState({ product: response.data.product });
          }

          if (response.data.models) {
            console.log(response.data.models);
            this.setState({ models: response.data.models });
          }

          if (response.data.attrs) {
            const { viewData, selectedAttrs } = this.getBaseData(
              response.data.attrs
            );
            this.setState({ viewData, selectedAttrs });
          }
        }
      }
    } catch (e) {
      console.warn(e + ' site_product_attrs');
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  getBaseData = attrs => {
    const viewData = [];
    const selectedAttrs = [];
    attrs = Object.entries(attrs);

    attrs.forEach((attr, index) => {
      selectedAttrs.push({
        [ATTR_KEY]: ''
      });
      const attrKey = attr[0];
      const attrValue = attr[1];
      const label = attrKey || '';
      let data = attrValue || [];

      data = data.map((attr, i) => {
        return {
          [VALUE_KEY]: attr,
          [ACTIVE_KEY]: false,
          [DISABLE_KEY]: false,
          [LABEL_KEY]: label,
          [ATTR_KEY]: i,
          [ATTR_LABEL_KEY]: index
        };
      });

      viewData.push({
        label,
        data
      });
    });

    return { viewData, selectedAttrs };
  };

  getNumberSelectedAttrs(selectedAttrs) {
    return selectedAttrs.filter(sAttr => sAttr[ATTR_KEY] !== '').length;
  }

  handlePressProductAttr = attr => {
    const viewData = [...this.state.viewData];

    viewData.forEach(vData => {
      vData.data.forEach(vAttr => {
        vAttr[DISABLE_KEY] = false;
        if (vData[LABEL_KEY] === attr[LABEL_KEY]) {
          if (vAttr[VALUE_KEY] === attr[VALUE_KEY]) {
            vAttr[ACTIVE_KEY] = !attr[ACTIVE_KEY];
          } else {
            vAttr[ACTIVE_KEY] = false;
          }
        }
      });
    });

    const selectedAttrs = this.getUpdatedSelectedAttrs(attr);
    const numberSelectedAttrs = this.getNumberSelectedAttrs(selectedAttrs);

    if (numberSelectedAttrs >= selectedAttrs.length - 1) {
      this.checkModel(
        this.state.models,
        selectedAttrs,
        numberSelectedAttrs === selectedAttrs.length
      );
    }

    if (numberSelectedAttrs <= selectedAttrs.length - 1) {
      this.setState({ selectedModel: {} });
    }

    this.setState({ viewData, selectedAttrs });
  };

  getUpdatedSelectedAttrs = attr => {
    let selectedAttrs = [...this.state.selectedAttrs];

    this.state.selectedAttrs.forEach((selectedAttr, index) => {
      if (index === attr[ATTR_LABEL_KEY]) {
        if (selectedAttr[LABEL_KEY]) {
          if (selectedAttr[LABEL_KEY] === attr[LABEL_KEY]) {
            selectedAttrs[index] = {
              [ATTR_KEY]: ''
            };

            if (selectedAttr[VALUE_KEY] !== attr[VALUE_KEY]) {
              selectedAttrs[index] = attr;
            }
          }
        } else {
          selectedAttrs[index] = attr;
        }
      }
    });

    return selectedAttrs;
  };

  checkModel = (models, selectedAttrs, isFullChecked) => {
    const modelKey = this.getModelKey(selectedAttrs);
    const splitModelKey = modelKey.split('-');

    Object.keys(models).forEach(key => {
      let splitKey = key.split('-');
      let possible = true;
      let unPressKey = '-1';
      let unPressIndex = '-1';

      splitKey.forEach((key, index) => {
        if (splitModelKey[index]) {
          if (key != splitModelKey[index]) {
            possible = false;
            return;
          }
        } else {
          unPressKey = key;
          unPressIndex = index.toString();
        }
      });

      if (possible) {
        if (!models[key].inventory) {
          let viewData = [...this.state.viewData];
          viewData.forEach((vData, index) => {
            if (index.toString() === unPressIndex) {
              vData.data.forEach(vAttr => {
                if (vAttr[ATTR_KEY].toString() === unPressKey) {
                  vAttr[DISABLE_KEY] = true;
                }
              });
            }
          });
          console.log(viewData);

          this.setState({ viewData });
        }
      }
    });

    if (isFullChecked) {
      this.setState({
        selectedModel: models[Object.keys(models).find(key => key === modelKey)]
      });
      splitModelKey.forEach((spKey, index) => {
        const temp = [...selectedAttrs];
        temp[index] = {
          [ATTR_KEY]: ''
        };
        this.checkModel(models, temp, false);
      });
    }
  };

  getModelKey = selectedAttrs => {
    const modelKeyMap = selectedAttrs.map(attr => attr[ATTR_KEY]);
    return modelKeyMap.join('-');
  };

  handleClose = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    } else {
      Actions.pop();
    }
  };

  handleChangeQuantity = (quantity, min, max) => {
    if (quantity >= min && quantity <= max) {
      this.setState({ quantity });
    }
  };

  renderOptions() {
    return this.state.viewData.map((attr, indx) => {
      return (
        <View key={indx}>
          {indx > 0 && <View style={styles.separate} />}
          <ModernList
            data={attr.data}
            mainKey={VALUE_KEY}
            type={LIST_TYPE.TAG}
            headerTitle={attr.label}
            onPressItem={this.handlePressProductAttr}
            headerTitleStyle={styles.label}
            activeStyle={{ backgroundColor: DEFAULT_COLOR }}
            activeTextStyle={{ color: '#fff' }}
            disabledStyle={styles.containerDisabled}
            disabledTextStyle={styles.titleDisabled}
          />
        </View>
      );
    });
  }

  render() {
    const animateAvoidKeyboard = {
      transform: [
        {
          translateY: Animated.multiply(this.state.animateAvoidKeyboard, -1)
        }
      ]
    };
    const numberSelectedAttrs = this.getNumberSelectedAttrs(
      this.state.selectedAttrs
    );
    const disabled =
      numberSelectedAttrs === 0 ||
      Object.keys(this.state.selectedModel).length !== numberSelectedAttrs;

    const btnProps = disabled && {
      btnContainerStyle: styles.containerDisabled,
      titleStyle: styles.titleDisabled,
      disabled
    };

    const image = this.state.selectedModel.image
      ? this.state.selectedModel.image
      : this.state.product.image;

    const price = this.state.selectedModel.price
      ? this.state.selectedModel.price
      : this.state.product.total_price_view;

    const inventory = this.state.selectedModel.inventory
      ? this.state.selectedModel.inventory
      : this.state.product.total_inventory;

    return this.state.loading ? (
      <Loading loading />
    ) : (
      <Modal
        ref={this.refModal}
        isOpen
        style={styles.container}
        position={'bottom'}
        onClosed={() => Actions.pop()}
        swipeToClose={false}
        style={[styles.modal]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[styles.optionListContainer, animateAvoidKeyboard]}
          >
            <View style={styles.header}>
              <View style={styles.imgContainer}>
                <CachedImage
                  mutable
                  source={{ uri: image }}
                  style={styles.image}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.text}>{price}</Text>
                <Text style={styles.subText}>
                  Kho: <Text>{inventory}</Text>
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

            <ScrollView
              style={{
                maxHeight: appConfig.device.height * 0.5
              }}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="always"
            >
              <View onStartShouldSetResponder={() => true}>
                {this.renderOptions()}
              </View>
            </ScrollView>

            <View style={styles.quantity}>
              <Text style={styles.label}>Số lượng</Text>
              <NumberSelection
                value={this.state.quantity}
                min={1}
                max={inventory}
                onChangeText={text =>
                  this.handleChangeQuantity(text, 1, inventory)
                }
                onMinus={() => {
                  this.setState({ quantity: this.state.quantity - 1 });
                }}
                onPlus={() => {
                  this.setState({ quantity: this.state.quantity + 1 });
                }}
                disabled={disabled}
              />
            </View>

            <Button
              title="Thêm vào giỏ hàng"
              onPress={() => {}}
              containerStyle={{ marginBottom: 15 }}
              {...btnProps}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  modal: {
    maxHeight: appConfig.device.height * 0.8
  },
  optionListContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    width: '100%',
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
    marginHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  info: {
    alignSelf: 'flex-end',
    marginLeft: 5
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
  },
  containerDisabled: {
    backgroundColor: '#f1f1f1'
  },
  titleDisabled: {
    color: '#bababa'
  }
});

export default ItemOptions;
