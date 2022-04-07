import React, {Component} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// types
import {BookingProductInfoProps} from '.';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import AttributeSelection from 'src/components/stores/ItemAttribute/AttributeSelection';
import ProductInfo from 'src/components/stores/ItemAttribute/ProductInfo';
import NumberSelection from 'src/components/stores/NumberSelection';
import {Container, Typography} from 'src/components/base';

const MIN_QUANTITY = 1;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  quantityViewOnlyWrapper: {
    position: 'absolute',
    bottom: -20,
    right: 0,
  },
  quantityViewOnlyContainer: {
    padding: 2,
    paddingHorizontal: 12,
  },
});

class BookingProductInfo extends Component<BookingProductInfoProps> {
  static contextType = ThemeContext;

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

  get theme() {
    return getTheme(this);
  }

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

  get quanlityStyle(): ViewStyle {
    return {
      borderColor: this.theme.color.border,
      borderTopWidth: this.theme.layout.borderWidth,
      borderBottomWidth: this.theme.layout.borderWidth,
    };
  }

  get quantityViewOnlyContainerStyle(): ViewStyle {
    return {
      backgroundColor: this.theme.color.contentBackground,
    };
  }

  render() {
    const product = this.props.product || {};
    const selectedAttrViewData = this.state.selectedAttrViewData;

    return (
      <View
        pointerEvents={this.props.editable ? 'auto' : 'none'}
        style={!this.props.editable && styles.container}>
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
                <View
                  style={[
                    this.quantityViewOnlyContainerStyle,
                    styles.quantityViewOnlyContainer,
                  ]}>
                  <Typography
                    onContentBackground
                    type={TypographyType.LABEL_SMALL}>
                    x {this.state.quantity}
                  </Typography>
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
          <Container row center style={[styles.quantity, this.quanlityStyle]}>
            <Typography type={TypographyType.LABEL_LARGE}>
              {this.props.t('attr.quantity') as string}
            </Typography>
            <View style={styles.quantityWrapper}>
              <NumberSelection
                containerStyle={styles.quantityContainer}
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
          </Container>
        )}
      </View>
    );
  }
}

export default withTranslation('product')(BookingProductInfo);
