import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

import AttributeSelection from 'src/components/stores/ItemAttribute/AttributeSelection';
import ProductInfo from 'src/components/stores/ItemAttribute/ProductInfo';
import NumberSelection from 'src/components/stores/NumberSelection';
import {BookingProductInfoProps} from '.';

const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
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
    borderColor: '#eee',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: appConfig.colors.white,
  },
  label: {
    color: '#444',
    fontSize: 16,
  },
  description: {
    color: '#666',
  },

  quantityViewOnlyWrapper: {
    position: 'absolute',
    bottom: -20,
    right: -22,
  },
  quantityViewOnlyContainer: {
    // borderRadius: 15,
    padding: 2,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
  },
  quantityViewOnly: {
    fontSize: 12,
    color: appConfig.colors.text,
  },
});

class BookingProductInfo extends Component<BookingProductInfoProps> {
  static defaultProps = {
    product: {},
    editable: true,
    onSelectAttr: () => {},
    onChangeQuantity: () => {},
  };

  state = {
    selectedAttr: {},
    selectedAttrViewData: [],
    model: '',
    quantity: this.props.product?.quantity || MIN_QUANTITY,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.quantity !== this.state.quantity) {
      this.props.onChangeQuantity(nextState.quantity);
    }

    return true;
  }

  handleSelectAttr = (selectedAttr, selectedAttrViewData, model) => {
    this.props.onSelectAttr(selectedAttr, model);
    this.setState({selectedAttrViewData});
  };

  handleChangeQuantity = (quantity, min, max = undefined) => {
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

  handleMinus = () => {
    this.setState((prevState: any) => ({quantity: prevState.quantity - 1}));
  };

  handlePlus = () => {
    this.setState((prevState: any) => ({quantity: prevState.quantity + 1}));
  };

  handleQuantityBlur = () => {
    if (!this.state.quantity) {
      this.setState({quantity: MIN_QUANTITY});
    }
  };

  render() {
    const product = this.props.product || {};
    const selectedAttrViewData = this.state.selectedAttrViewData;

    return (
      <View pointerEvents={this.props.editable ? 'auto' : 'none'}>
        <ProductInfo
          imageUri={product.image}
          title={product.name}
          subTitle={
            selectedAttrViewData?.length
              ? selectedAttrViewData
              : product.classification
          }
          subTitleNumberOfLines={this.props.editable ? undefined : 5}
          discountPrice={product.discount}
          price={product.price_view}
          unitName={product.unit_name}
          inventory={product.inventory}
          imageContainerStyle={{alignSelf: 'center'}}
          extraInfoComponent={
            !this.props.editable && (
              <View style={styles.quantityViewOnlyWrapper}>
                <View style={styles.quantityViewOnlyContainer}>
                  <Text style={styles.quantityViewOnly}>
                    x {this.state.quantity}
                  </Text>
                </View>
              </View>
            )
          }
        />

        {this.props.editable && (
          <AttributeSelection
            ignoreInventory
            attrs={this.props.attrs}
            models={this.props.models}
            defaultSelectedModel={this.props.defaultSelectedModel}
            onSelectAttr={this.handleSelectAttr}
          />
        )}

        {this.props.editable && (
          <View style={styles.quantity}>
            <Text style={styles.label}>{this.props.t('attr.quantity')}</Text>
            <View style={styles.quantityWrapper}>
              <NumberSelection
                containerStyle={[styles.quantityContainer]}
                textContainer={styles.quantityTxtContainer}
                value={this.state.quantity}
                min={MIN_QUANTITY}
                onChangeText={(quantity) =>
                  this.handleChangeQuantity(quantity, MIN_QUANTITY)
                }
                onMinus={this.handleMinus}
                onPlus={this.handlePlus}
                onBlur={this.handleQuantityBlur}
                // disabled={disabled}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

// @ts-ignore
export default withTranslation('product')(BookingProductInfo);
