import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

import appConfig from 'app-config';

import ModernList, {LIST_TYPE} from 'app-packages/tickid-modern-list';

import {AttributeSelectionProps} from '.';

const ATTR_LABEL_KEY = 'attrLabelKey';
const ATTR_KEY = 'attrKey';
const LABEL_KEY = 'label';
const VALUE_KEY = 'value';
const ACTIVE_KEY = 'active';
const DISABLE_KEY = 'disabled';
const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
  label: {
    color: '#444',
    fontSize: 16,
  },
  containerDisabled: {
    backgroundColor: '#f1f1f1',
  },
  titleDisabled: {
    color: '#bababa',
  },
  separate: {
    height: 0.5,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },

  active: {
    backgroundColor: appConfig.colors.primary,
  },
  textActive: {
    color: appConfig.colors.white,
  },
});

export class AttributeSelection extends PureComponent<AttributeSelectionProps> {
  static propTypes = {
    onSelectAttr: PropTypes.func,
    viewData: PropTypes.arrayOf(
      PropTypes.shape({
        [LABEL_KEY]: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            [LABEL_KEY]: PropTypes.string,
            [VALUE_KEY]: PropTypes.string,
            [ACTIVE_KEY]: PropTypes.bool,
            [DISABLE_KEY]: PropTypes.bool,
          }),
        ),
      }),
    ),
  };
  static defaultProps = {
    onSelectAttr: () => {},
    models: {
      '0-0': {
        name: 'S,Ô xám trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 0,
        sold: 4,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
      '1-0': {
        name: 'M,Ô xám trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 98,
        sold: 2,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
      '2-0': {
        name: 'L,Ô xám trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 94,
        sold: 6,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
      '0-1': {
        name: 'S,Ô hồng trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 100,
        sold: 0,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
      '1-1': {
        name: 'M,Ô hồng trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 99,
        sold: 1,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
      '2-1': {
        name: 'L,Ô hồng trắng',
        product_code: '',
        barcode: '',
        price_before_discount: '625.000đ',
        price: '312.500đ',
        inventory: 95,
        sold: 5,
        origin_price: 312500,
        price_view: '312.500đ',
        price_before_discount_view: '625.000đ',
        price_in_number: 312500,
      },
    },
    viewData: [
      {
        label: 'Kích thước ',
        data: [
          {
            value: 'S',
            active: false,
            disabled: true,
            label: 'Kích thước ',
            attrKey: 0,
            attrLabelKey: 0,
          },
          {
            value: 'M',
            active: false,
            disabled: false,
            label: 'Kích thước ',
            attrKey: 1,
            attrLabelKey: 0,
          },
          {
            value: 'L',
            active: false,
            disabled: false,
            label: 'Kích thước ',
            attrKey: 2,
            attrLabelKey: 0,
          },
        ],
      },
      {
        label: 'Nhóm màu ',
        data: [
          {
            value: 'Ô xám trắng',
            active: false,
            disabled: false,
            label: 'Nhóm màu ',
            attrKey: 0,
            attrLabelKey: 1,
          },
          {
            value: 'Ô hồng trắng',
            active: false,
            disabled: false,
            label: 'Nhóm màu ',
            attrKey: 1,
            attrLabelKey: 1,
          },
        ],
      },
    ],
  };

  state = {
    viewData: this.props.viewData,
    models: this.props.models,
    selectedAttrs: [],
  };

  getSelectedAttrsViewData(numberSelectedAttrs) {
    return this.state.selectedAttrs.map((sAttr, index) =>
      sAttr.value
        ? sAttr.value + (index < numberSelectedAttrs - 1 ? ' - ' : '')
        : '',
    );
  }

  getNumberSelectedAttrs(selectedAttrs) {
    return selectedAttrs.filter((sAttr) => sAttr[ATTR_KEY] !== '').length;
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

    this.props.onSelectAttr(
      selectedAttrs,
      this.getSelectedAttrsViewData(numberSelectedAttrs),
    );
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
        if (!models[key].inventory) {
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

  render() {
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
            activeStyle={styles.active}
            activeTextStyle={styles.textActive}
            disabledStyle={styles.containerDisabled}
            disabledTextStyle={styles.titleDisabled}
          />
        </View>
      );
    });
  }
}

export default AttributeSelection;
