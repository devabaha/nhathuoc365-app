import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import SectionContainer from '../SectionContainer';
import CartItem from 'src/components/payment/CartItem';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  contentContainer: {
    marginHorizontal: -15,
    marginTop: 12,
  },
  iconHeading: {
    fontSize: 12,
  },
});

const ProductSection = ({
  title,
  onPressActionBtn,
  onRemoveCartItem,
  isProductActionVisible = true,
  isProductVisible = true,
  products = [],
  onProductLoadingStateChange = (loading) => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const renderCartProducts = useCallback(() => {
    return (
      <View style={contentContainerStyle}>
        {products.map((product, index) => {
          if (!isProductVisible && product.selected != 1) {
            return null;
          }

          return (
            <CartItem
              key={index}
              item={product}
              noAction={!isProductActionVisible}
              onRemoveCartItem={onRemoveCartItem}
              onProductLoadingStateChange={onProductLoadingStateChange}
            />
          );
        })}
      </View>
    );
  }, [
    products,
    isProductVisible,
    isProductActionVisible,
    contentContainerStyle,
  ]);

  const contentContainerStyle = useMemo(() => {
    return mergeStyles(styles.contentContainer, {
      borderTopWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <SectionContainer
      marginTop
      style={styles.container}
      actionBtnTitle={!!onPressActionBtn && t('confirm.change')}
      title={title || t('confirm.items.selected')}
      iconStyle={styles.iconHeading}
      iconName="shopping-cart"
      onPressActionBtn={onPressActionBtn}>
      {renderCartProducts()}
    </SectionContainer>
  );
};

export default React.memo(ProductSection);
