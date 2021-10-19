import React, {Component} from 'react';
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
const MODEL_SEPARATOR = '-';

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

export class AttributeSelection extends Component<AttributeSelectionProps> {
  static propTypes = {
    onSelectAttr: PropTypes.func,
    models: PropTypes.object,
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
    defaultSelectedModel: '',
    onSelectAttr: () => {},
    attrs: {},
    models: {},
  };

  state = {
    viewData: [],
    models: this.props.models,
    selectedAttrs: [],
    selectedModel: {},
    selectedModelKey: '',
  };

  componentDidMount() {
    this.updateData(this.props.attrs, this.props.models, () => {
      if (this.props.defaultSelectedModel) {
        const modelKeys = this.props.defaultSelectedModel.split(
          MODEL_SEPARATOR,
        );

        this.setDefaultAttrs(modelKeys);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.attrs !== this.props.attrs ||
      nextProps.models !== this.props.models
    ) {
      this.updateData(nextProps.attrs, nextProps.models);
    }

    return true;
  }

  async setDefaultAttrs(modelKeys) {
    for (let index = 0; index < this.state.viewData.length; index++) {
      const keyViewData = this.state.viewData[index];
      const attrViewData = keyViewData.data[modelKeys[index]];

      if (attrViewData) {
        await new Promise((resolve) => {
          this.handlePressProductAttr(attrViewData, () => {
            resolve('');
          });
        });
      }
    }
  }

  updateData = (attrs, models, callback = () => {}) => {
    const {viewData, selectedAttrs} = this.getBaseData(attrs, models);

    this.setState(
      {
        viewData,
        selectedAttrs,
      },
      () => {
        if (!this.props.defaultSelectedModel) {
          const hasOnlyOneOption =
            Object.keys(attrs)?.length === 1 &&
            //@ts-ignore
            Object.values(attrs)[0]?.length === 1;

          if (hasOnlyOneOption && this.state.viewData?.[0]?.data?.[0]) {
            this.handlePressProductAttr(this.state.viewData[0].data[0]);
          }
        }

        callback();
      },
    );
  };

  getBaseData = (attrs, models) => {
    const viewData = [];
    const selectedAttrs = this.state.selectedAttrs;
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

        if (!this.props.ignoreInventory && attrs.length === 1) {
          // disable if empty inventory ONLY IF product has only 1 attr.
          disabled = !!!Object.values(models).find(
            //@ts-ignore
            (model) => model.name === attr,
            //@ts-ignore
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

  handlePressProductAttr = (attr, callback = () => {}) => {
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

    this.setState(
      {
        viewData,
        selectedAttrs,
        quantity: MIN_QUANTITY,
      },
      () => {
        callback();
        this.props.onSelectAttr(
          selectedAttrs,
          this.getSelectedAttrsViewData(
            this.getNumberSelectedAttrs(selectedAttrs),
          ),
          numberSelectedAttrs === selectedAttrs.length
            ? this.getModelKey(selectedAttrs)
            : '',
        );
      },
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
    const splitModelKey = modelKey.split(MODEL_SEPARATOR);

    Object.keys(models).forEach((key) => {
      let splitKey = key.split(MODEL_SEPARATOR);
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
        if (!this.props.ignoreInventory && !models[key].inventory) {
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
    return modelKeyMap.join(MODEL_SEPARATOR);
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
