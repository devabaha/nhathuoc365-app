import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Easing,
  StatusBar,
} from 'react-native';
// 3-party libs
import Modal from 'react-native-modalbox';
import Loading from '@tickid/tickid-rn-loading';
import {observer} from 'mobx-react';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'src/helper/EventTracker';
import {isConfigActive} from 'src/helper/configKeyHandler';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {LIST_TYPE} from 'app-packages/tickid-modern-list';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {ORDER_TYPES} from 'src/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import ModernList from 'app-packages/tickid-modern-list';
import NumberSelection from '../NumberSelection';
import Button from 'src/components/Button';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import DropShip from 'src/components/item/DropShip';
import ProductInfo from './ProductInfo';
import {
  Container,
  IconButton,
  ScreenWrapper,
  ScrollView,
  Typography,
} from 'src/components/base';

const ATTR_LABEL_KEY = 'attrLabelKey';
const ATTR_KEY = 'attrKey';
const LABEL_KEY = 'label';
const VALUE_KEY = 'value';
const ACTIVE_KEY = 'active';
const DISABLE_KEY = 'disabled';
const MIN_QUANTITY = 1;

class ItemAttribute extends PureComponent {
  static contextType = ThemeContext;

  static defaultProps = {
    product: {},
    onClosed: () => {},
  };

  getBaseData = (attrs = {}, models = {}) => {
    attrs || (attrs = {});
    models || (models = {});

    const viewData = [];
    const selectedAttrs = [];
    attrs = Object.entries(attrs);

    attrs.forEach((attr, index) => {
      selectedAttrs.push({
        [ATTR_KEY]: '',
      });
      const attrKey = attr[0];
      const attrValue = attr[1];
      const label = attrKey || '';
      let data = attrValue || [];

      data = data.map((attr, i) => {
        let disabled = false;

        if (
          attrs.length === 1 &&
          (!isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) ||
            !!(this.state?.product || this.props.product)?.sale_in_stock)
        ) {
          // disable if empty inventory ONLY IF product has only 1 attr.
          disabled = !!!Object.values(models).find(
            (model) => model.name === attr,
          )?.inventory;
        }

        return {
          [VALUE_KEY]: attr,
          [ACTIVE_KEY]: false,
          [DISABLE_KEY]: disabled,
          [LABEL_KEY]: label,
          [ATTR_KEY]: i,
          [ATTR_LABEL_KEY]: index,
        };
      });

      viewData.push({
        label,
        data,
      });
    });

    return {viewData, selectedAttrs};
  };

  get initBaseData() {
    return this.getBaseData(
      this.props.product?.attrs,
      this.props.product?.models,
    );
  }

  state = {
    product: this.props.product,
    loading: false,
    viewData: this.initBaseData.viewData,
    models: this.props.product?.models || {},
    selectedAttrs: this.initBaseData.selectedAttrs,
    selectedModel: {},
    selectedModelKey: '',
    quantity: MIN_QUANTITY,
    dropShipPrice: 0,

    rawAttrs: {},
    rawModels: [],
  };
  refModal = React.createRef();
  unmounted = false;
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  get isDropShip() {
    return this.props.isDropShip;
  }

  get hasAttrs() {
    return Object.keys(this.state.models || {})?.length > 0;
  }

  get isDiscount() {
    return this.hasAttrs
      ? this.state.selectedModel?.price_before_discount !==
          this.state.selectedModel?.price
      : !!this.state.product?.discount_percent;
  }

  get listPrice() {
    return this.hasAttrs
      ? this.state.selectedModel?.origin_price || 0
      : this.state?.product?.origin_price;
  }

  get dropShipPrice() {
    return this.isDropShip && isConfigActive(CONFIG_KEY.FIX_DROPSHIP_PRICE_KEY)
      ? this.listPrice
      : this.state.dropShipPrice;
  }

  componentDidMount() {
    !this.hasAttrs && !this.isDropShip && this.getAttrs();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.props.onUnmounted && this.props.onUnmounted();
    this.eventTracker.clearTracking();
  }

  getAttrs = async () => {
    this.setState({loading: true});

    try {
      const response = await APIHandler.site_product_attrs(
        store.store_data.id,
        this.props.itemId,
      );

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          if (response.data) {
            if (response.data.product) {
              this.setState({product: response.data.product});
            }

            if (response.data.models) {
              this.setState({models: response.data.models});
            }

            if (response.data.attrs) {
              const {viewData, selectedAttrs} = this.getBaseData(
                response.data.attrs,
                response.data.models,
              );

              this.setState(
                {
                  viewData,
                  selectedAttrs,
                  rawAttrs: response.data.attrs,
                  rawModels: response.data.models,
                },
                () => {
                  const hasOnlyOneOption =
                    Object.keys(response.data.attrs)?.length === 1 &&
                    Object.values(response.data.attrs)[0]?.length === 1;

                  if (hasOnlyOneOption && this.state.viewData?.[0]?.data?.[0]) {
                    this.handlePressProductAttr(this.state.viewData[0].data[0]);
                  }
                },
              );
            }
          } else {
            if (this.isDropShip) {
              this.setState({product: this.props.product});
            } else {
              this.props.onSubmit();
              pop();
            }
          }
        }
      }
    } catch (e) {
      console.warn(e + ' site_product_attrs');
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  getSelectedAttrsViewData(numberSelectedAttrs) {
    return this.state.selectedAttrs.map((sAttr, index) =>
      sAttr.value
        ? sAttr.value + (index < numberSelectedAttrs - 1 ? ' - ' : '')
        : '',
    );
  }

  getNumberSelectedAttrs(selectedAttrs) {
    return selectedAttrs.filter((sAttr) => sAttr[ATTR_KEY] !== '')?.length || 0;
  }

  getInfoBySelectedAttrs() {
    const numberSelectedAttrs = this.getNumberSelectedAttrs(
      this.state.selectedAttrs,
    );
    let modelIncludedAttrs = {};
    if (numberSelectedAttrs) {
      const selectedAttrsInModelFormat = this.getSelectedAttrsViewData(
        numberSelectedAttrs,
      );

      modelIncludedAttrs =
        Object.values(this.state.models || {}).find((model) => {
          return selectedAttrsInModelFormat.every(
            (attr) => model.name && model.name.includes(attr),
          );
        }) || {};
    }

    return {...modelIncludedAttrs};
  }

  handlePressProductAttr = (attr) => {
    const viewData = [...this.state.viewData];

    viewData.forEach((vData) => {
      vData.data.forEach((vAttr) => {
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
        numberSelectedAttrs === selectedAttrs.length,
      );
    }

    if (numberSelectedAttrs <= selectedAttrs.length - 1) {
      this.setState({
        selectedModel: {},
        selectedModelKey: '',
      });
    }

    this.setState({
      viewData,
      selectedAttrs,
      quantity: MIN_QUANTITY,
    });
  };

  getUpdatedSelectedAttrs = (attr) => {
    let selectedAttrs = [...this.state.selectedAttrs];

    this.state.selectedAttrs.forEach((selectedAttr, index) => {
      if (index === attr[ATTR_LABEL_KEY]) {
        if (selectedAttr[LABEL_KEY]) {
          if (selectedAttr[LABEL_KEY] === attr[LABEL_KEY]) {
            selectedAttrs[index] = {
              [ATTR_KEY]: '',
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

    Object.keys(models).forEach((key) => {
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
        if (
          !models[key].inventory &&
          (!isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) ||
            !!this.state.product?.sale_in_stock)
        ) {
          let viewData = [...this.state.viewData];
          viewData.forEach((vData, index) => {
            if (index.toString() === willDisabledAttrGroupIndex) {
              vData.data.forEach((vAttr) => {
                if (vAttr[ATTR_KEY].toString() === willDisabledAttrIndex) {
                  vAttr[DISABLE_KEY] = true;
                }
              });
            }
          });

          this.setState({viewData});
        }
      }
    });

    if (isFullChecked) {
      this.setState({
        selectedModel:
          models[Object.keys(models).find((key) => key === modelKey)],
        selectedModelKey: modelKey,
      });
      splitModelKey.forEach((spKey, index) => {
        const temp = [...selectedAttrs];
        temp[index] = {
          [ATTR_KEY]: '',
        };
        this.checkModel(models, temp, false);
      });
    }
  };

  getModelKey = (selectedAttrs) => {
    const modelKeyMap = selectedAttrs.map((attr) => attr[ATTR_KEY]);
    return modelKeyMap.join('-');
  };

  handleClose = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    } else {
      this.handleClosed();
    }
  };

  handleClosed = () => {
    this.props.onClosed();
    pop();
  };

  handleChangeQuantity = (quantity, min, max) => {
    const hasMax = max !== null && max !== undefined;

    if (
      (Number(quantity) >= Number(min) && hasMax
        ? Number(quantity) <= Number(max)
        : true) ||
      !quantity
    ) {
      this.setState({quantity: !quantity ? '' : Number(quantity)});
    }
  };

  handleSubmit = () => {
    this.props.onSubmit(
      this.state.quantity,
      this.state.selectedModelKey,
      this.dropShipPrice,
    );
    this.handleClose();
  };

  renderOptions() {
    return this.state.viewData.map((attr, indx) => {
      return (
        <View key={indx}>
          {indx > 0 && <View style={this.separateStyle} />}
          <ModernList
            data={attr.data}
            mainKey={VALUE_KEY}
            type={LIST_TYPE.TAG}
            headerTitle={attr.label}
            onPressItem={this.handlePressProductAttr}
          />
        </View>
      );
    });
  }

  get optionListContainerStyle() {
    return [
      styles.optionListContainer,
      {
        borderTopLeftRadius: this.theme.layout.borderRadiusMedium,
        borderTopRightRadius: this.theme.layout.borderRadiusMedium,
      },
    ];
  }

  get separateStyle() {
    return [
      styles.separate,
      {
        height: this.theme.layout.borderWidthSmall,
        backgroundColor: this.theme.color.border,
      },
    ];
  }

  get quantityStyles() {
    return [
      styles.quantity,
      {
        borderTopWidth: this.theme.layout.borderWidth,
        borderColor: this.theme.color.border,
      },
    ];
  }

  render() {
    const {t} = this.props;
    const numberSelectedAttrs = this.getNumberSelectedAttrs(
      this.state.selectedAttrs,
    );

    const infoByAttrs = this.getInfoBySelectedAttrs();

    const imageUri = this.state.selectedModel.image
      ? this.state.selectedModel.image
      : infoByAttrs.image
      ? infoByAttrs.image
      : this.state.product?.image;

    const isDropShipDisabled =
      this.hasAttrs && !Object.keys(this.state.selectedModel).length;

    const discountPrice = this.hasAttrs
      ? this.state.selectedModel?.price_before_discount_view
      : this.state.product?.discount_view;

    const priceDropShip = this.hasAttrs
      ? this.state.selectedModel.price_in_number
        ? this.state.selectedModel.price_in_number
        : 0
      : this.state.product?.price || 0;

    const priceDropShipView = this.hasAttrs
      ? this.state.selectedModel.price
        ? this.state.selectedModel.price_view
        : '-'
      : this.state.product?.price_view || '-';

    const price =
      (typeof this.state.selectedModel.price === 'number'
        ? this.state.selectedModel.price_view
        : this.state.product.total_price_view) ||
      (this.isDropShip && this.state.product.price_view);

    const inventory =
      (this.state.selectedModel.inventory
        ? this.state.selectedModel.inventory
        : this.state.product?.total_inventory) ||
      (this.isDropShip && this.state.product.inventory);

    const title = this.state.product.name;
    const subTitle = this.isDropShip
      ? ''
      : numberSelectedAttrs === 0
      ? `??? ${t('attr.notChooseAttrYet')}`
      : this.getSelectedAttrsViewData(numberSelectedAttrs);

    const maxQuantity = isConfigActive(
      CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY,
    )
      ? null
      : inventory;

    const isInventoryVisible =
      !isConfigActive(CONFIG_KEY.ALLOW_SITE_SALE_OUT_INVENTORY_KEY) &&
      this.state.product?.order_type !== ORDER_TYPES.BOOKING;

    const unitName =
      this.state.product?.unit_name && this.state.product?.unit_name_view;

    const disabled =
      (this.isDropShip && priceDropShip > this.dropShipPrice) ||
      (this.hasAttrs && numberSelectedAttrs === 0) ||
      Object.keys(this.state.viewData).length !== numberSelectedAttrs;

    const btnProps = disabled && {
      btnContainerStyle: styles.containerDisabled,
      titleStyle: styles.titleDisabled,
      disabled,
    };

    return (
      <>
        {this.state.loading ? (
          <Loading loading />
        ) : (
          <Modal
            ref={this.refModal}
            isOpen
            position="top"
            onClosed={this.handleClosed}
            swipeToClose={false}
            style={styles.modal}
            easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}>
            <ScreenWrapper style={styles.safeView}>
              <TouchableWithoutFeedback onPress={this.handleClose}>
                <View style={{flex: 1}} />
              </TouchableWithoutFeedback>

              <Container
                safeLayout={!store.keyboardTop}
                style={this.optionListContainerStyle}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <ProductInfo
                    imageUri={imageUri}
                    title={title}
                    subTitle={subTitle}
                    discountPrice={
                      this.isDiscount && !!discountPrice && discountPrice
                    }
                    price={price}
                    unitName={unitName}
                    inventory={isInventoryVisible && inventory}
                    headerStyle={{paddingTop: 35}}
                  />
                </TouchableWithoutFeedback>

                <IconButton
                  neutral
                  bundle={BundleIconSetName.IONICONS}
                  style={styles.close}
                  onPress={this.handleClose}
                  hitSlop={HIT_SLOP}
                  name="ios-close"
                  iconStyle={styles.closeIcon}
                />

                <ScrollView
                  style={{
                    maxHeight: appConfig.device.height * 0.5,
                  }}
                  scrollEventThrottle={16}
                  keyboardShouldPersistTaps="handled"
                  // keyboardDismissMode="on-drag"
                  onStartShouldSetResponder={() => true}>
                  {/* <View onStartShouldSetResponder={() => true}> */}

                  {this.renderOptions()}

                  {this.isDropShip && (
                    <DropShip
                      disabled={isDropShipDisabled}
                      price={priceDropShip}
                      priceView={priceDropShipView}
                      quantity={this.state.quantity}
                      min={MIN_QUANTITY}
                      max={maxQuantity}
                      listPrice={this.listPrice}
                      onChangeNewPrice={(dropShipPrice) => {
                        this.setState({dropShipPrice});
                      }}
                      onChangeQuantity={(text) =>
                        this.handleChangeQuantity(
                          text,
                          MIN_QUANTITY,
                          maxQuantity,
                        )
                      }
                      onMinus={() => {
                        this.setState({quantity: this.state.quantity - 1});
                      }}
                      onPlus={() => {
                        this.setState({quantity: this.state.quantity + 1});
                      }}
                      onQuantityBlur={() => {
                        if (!this.state.quantity) {
                          this.setState({quantity: MIN_QUANTITY});
                        }
                      }}
                    />
                  )}
                  {/* </View> */}
                </ScrollView>

                {!this.isDropShip && (
                  <View style={this.quantityStyles}>
                    <Typography type={TypographyType.LABEL_LARGE}>
                      {t('attr.quantity')}
                    </Typography>
                    <Container style={styles.quantityWrapper}>
                      <NumberSelection
                        containerStyle={[styles.quantityContainer]}
                        textContainer={styles.quantityTxtContainer}
                        value={this.state.quantity}
                        min={MIN_QUANTITY}
                        max={maxQuantity}
                        onChangeText={(text) =>
                          this.handleChangeQuantity(
                            text,
                            MIN_QUANTITY,
                            maxQuantity,
                          )
                        }
                        onMinus={() => {
                          this.setState({quantity: this.state.quantity - 1});
                        }}
                        onPlus={() => {
                          this.setState({quantity: this.state.quantity + 1});
                        }}
                        onBlur={() => {
                          if (!this.state.quantity) {
                            this.setState({quantity: MIN_QUANTITY});
                          }
                        }}
                        disabled={disabled}
                      />
                    </Container>
                  </View>
                )}

                <Button
                  title={t('addToCart')}
                  onPress={this.handleSubmit}
                  disabled={disabled}
                  // {...btnProps}
                />
              </Container>

              {appConfig.device.isIOS && <KeyboardSpacer topSpacing={15} />}
            </ScreenWrapper>
          </Modal>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  safeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  optionListContainer: {
    paddingVertical: 15,
    maxHeight: appConfig.device.height * 0.8,
    overflow: 'hidden',
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 7,
  },
  closeIcon: {
    fontSize: 34,
  },
  separate: {
    marginHorizontal: 10,
  },
  quantityWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quantityContainer: {
    width: null,
    maxWidth: undefined,
  },
  quantityTxtContainer: {
    minWidth: 70,
    flex: undefined,
  },
  quantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  containerDisabled: {
    backgroundColor: '#f1f1f1',
  },
  titleDisabled: {
    color: '#bababa',
  },
});

export default withTranslation('product')(observer(ItemAttribute));
