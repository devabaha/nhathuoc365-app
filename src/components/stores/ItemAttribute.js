import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Easing,
  SafeAreaView
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
import KeyboardSpacer from 'react-native-keyboard-spacer';

const ATTR_LABEL_KEY = 'attrLabelKey';
const ATTR_KEY = 'attrKey';
const LABEL_KEY = 'label';
const VALUE_KEY = 'value';
const ACTIVE_KEY = 'active';
const DISABLE_KEY = 'disabled';
const MIN_QUANTITY = 1;

class ItemAttribute extends PureComponent {
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
    selectedModelKey: '',
    quantity: MIN_QUANTITY
  };
  refModal = React.createRef();
  unmounted = false;

  componentDidMount() {
    this.getAttrs();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getAttrs = async () => {
    this.setState({ loading: true });

    try {
      const response = await APIHandler.site_product_attrs(
        store.store_data.id,
        this.props.itemId
      );
      // console.log(response);
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS && response.data) {
          if (response.data.product) {
            this.setState({ product: response.data.product });
          }

          if (response.data.models) {
            // console.log(response.data.models);
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

  getSelectedAttrsViewData(numberSelectedAttrs) {
    return this.state.selectedAttrs.map((sAttr, index) =>
      sAttr.value
        ? sAttr.value + (index < numberSelectedAttrs - 1 ? ' - ' : '')
        : ''
    );
  }

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
      this.setState({
        selectedModel: {},
        selectedModelKey: ''
      });
    }

    this.setState({
      viewData,
      selectedAttrs,
      quantity: MIN_QUANTITY
    });
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
      let willDisabledAttrIndex = '-1';
      let willDisabledAttrGroupIndex = '-1';

      splitKey.forEach((key, index) => {
        if (splitModelKey[index]) {
          if (key != splitModelKey[index]) {
            possible = false;
            return;
          }
        } else {
          willDisabledAttrIndex = key;
          willDisabledAttrGroupIndex = index.toString();
        }
      });

      if (possible) {
        if (!models[key].inventory) {
          let viewData = [...this.state.viewData];
          viewData.forEach((vData, index) => {
            if (index.toString() === willDisabledAttrGroupIndex) {
              vData.data.forEach(vAttr => {
                if (vAttr[ATTR_KEY].toString() === willDisabledAttrIndex) {
                  vAttr[DISABLE_KEY] = true;
                }
              });
            }
          });
          // console.log(viewData);

          this.setState({ viewData });
        }
      }
    });

    if (isFullChecked) {
      this.setState({
        selectedModel:
          models[Object.keys(models).find(key => key === modelKey)],
        selectedModelKey: modelKey
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
    if ((quantity >= min && quantity <= max) || !quantity) {
      this.setState({ quantity: !quantity ? '' : Number(quantity) });
    }
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.quantity, this.state.selectedModelKey);
    this.handleClose();
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
    const numberSelectedAttrs = this.getNumberSelectedAttrs(
      this.state.selectedAttrs
    );
    const disabled =
      numberSelectedAttrs === 0 ||
      Object.keys(this.state.viewData).length !== numberSelectedAttrs;

    const btnProps = disabled && {
      btnContainerStyle: styles.containerDisabled,
      titleStyle: styles.titleDisabled,
      disabled
    };

    const imageUri = this.state.selectedModel.image
      ? this.state.selectedModel.image
      : this.state.product.image;

    const price = this.state.selectedModel.price
      ? this.state.selectedModel.price
      : this.state.product.total_price_view;

    const inventory = this.state.selectedModel.inventory
      ? this.state.selectedModel.inventory
      : this.state.product.total_inventory;

    const title = this.state.product.name;
    const subTitle =
      numberSelectedAttrs === 0
        ? '• Chưa chọn thuộc tính'
        : this.getSelectedAttrsViewData(numberSelectedAttrs);

    return this.state.loading ? (
      <Loading loading />
    ) : (
      <Modal
        ref={this.refModal}
        isOpen
        position="top"
        onClosed={() => Actions.pop()}
        swipeToClose={false}
        style={[styles.modal]}
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={[styles.safeView]}>
            <TouchableWithoutFeedback onPress={this.handleClose}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.optionListContainer]}>
              <View style={styles.header}>
                <View
                  style={[
                    styles.imgContainer,
                    imageUri || {
                      backgroundColor: '#eee'
                    }
                  ]}
                >
                  <CachedImage
                    mutable
                    source={{ uri: imageUri }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.info}>
                  <View>
                    <Text numberOfLines={2} style={styles.title}>
                      {title}
                    </Text>
                    <Text numberOfLines={1} style={styles.note}>
                      {subTitle}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.highlight}>{price}</Text>
                    <Text style={styles.note}>
                      Kho: <Text>{inventory}</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.close}
                onPress={this.handleClose}
                hitSlop={HIT_SLOP}
              >
                <Icon name="ios-close" style={styles.closeIcon} />
              </TouchableOpacity>

              <ScrollView
                style={{
                  maxHeight: appConfig.device.height * 0.5
                }}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
              >
                <View onStartShouldSetResponder={() => true}>
                  {this.renderOptions()}
                </View>
              </ScrollView>

              <View style={styles.quantity}>
                <Text style={styles.label}>Số lượng</Text>
                <NumberSelection
                  value={this.state.quantity}
                  min={MIN_QUANTITY}
                  max={inventory}
                  onChangeText={text =>
                    this.handleChangeQuantity(text, MIN_QUANTITY, inventory)
                  }
                  onMinus={() => {
                    this.setState({ quantity: this.state.quantity - 1 });
                  }}
                  onPlus={() => {
                    this.setState({ quantity: this.state.quantity + 1 });
                  }}
                  onBlur={() => {
                    if (!this.state.quantity) {
                      this.setState({ quantity: MIN_QUANTITY });
                    }
                  }}
                  disabled={disabled}
                />
              </View>

              <Button
                title="Thêm vào giỏ hàng"
                onPress={this.handleSubmit}
                {...btnProps}
              />
            </Animated.View>

            {appConfig.device.isIOS && <KeyboardSpacer />}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent'
  },
  safeView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  optionListContainer: {
    paddingVertical: 15,
    maxHeight: appConfig.device.height * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  imgContainer: {
    width: 120,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  info: {
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 35,
    flex: 1
  },
  title: {
    fontSize: 16,
    marginBottom: appConfig.device.isIOS ? 3 : 0,
    color: '#444',
    fontWeight: '500'
  },
  subTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400'
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 7
  },
  closeIcon: {
    fontSize: 34,
    color: DEFAULT_COLOR
  },
  highlight: {
    fontSize: 18,
    color: '#404040',
    fontWeight: 'bold',
    marginBottom: appConfig.device.isIOS ? 2 : -2
  },
  note: {
    color: '#888',
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

export default ItemAttribute;
