import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {cancelRequests} from 'app-helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
import {HIT_SLOP} from 'src/constants';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import SectionContainer from '../SectionContainer';
import {Typography, IconButton, TextButton} from 'src/components/base';
import ExtraQuantityInput from 'src/components/cart/CartItem/ExtraQuantityInput';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  address_default_box: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconCheckbox: {
    fontSize: 24,
    marginRight: 5,
  },
  labelWalletContainer: {
    flexDirection: 'row',
    width: '50%',
  },
  contentWalletContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  walletName: {
    lineHeight: 24,
  },
  inputWallet: {
    marginHorizontal: 5,
  },
});

const WalletSection = ({
  cartId,
  listWallets: listWalletsProp,
  editable,
  showSelectedOnlyWallet,
  onProductLoadingStateChange,
  containerStyle = {},
  walletContainerStyle = {},
}) => {
  const {theme} = useTheme();
  const {t} = useTranslation('orders');

  const [updateCartRequest] = useState(new APIRequest());
  const [requests] = useState([updateCartRequest]);

  const [listWallets, setListWallets] = useState(listWalletsProp || []);

  const refModal = useRef();

  const typoPropsPoint = {type: TypographyType.LABEL_LARGE_PRIMARY};

  useEffect(() => {
    return () => {
      cancelRequests(requests);
    };
  }, [requests]);

  useEffect(() => {
    setListWallets(
      (listWalletsProp || []).map((wallet) => ({
        ...wallet,
        selected: !!wallet.use_flag && !!wallet.point,
      })),
    );
  }, [listWalletsProp]);

  const updateCart = async (quantity, zoneCode) => {
    onProductLoadingStateChange(true);
    try {
      const data = {
        zone_code: zoneCode,
        point: Number(quantity) || 0,
      };

      updateCartRequest.data = APIHandler.site_cart_wallet_update(
        store.store_id,
        cartId,
        data,
      );

      const response = await updateCartRequest.promise();

      if (response && response.status === STATUS_SUCCESS) {
        store.setCartData(response.data);
        if (isAndroid && store.cart_item_index > 0) {
          store.setCartItemIndex(store.cart_item_index - 1);
        }
        flashShowMessage({
          type: 'success',
          message: response.message,
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || this.props.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('site_cart_wallet_update', e);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
      onProductLoadingStateChange(false);
    }
  };

  const handlePressWallet = useCallback(
    (wallet, index) => {
      const newSelectedWallets = [...listWallets];

      newSelectedWallets[index].selected = !newSelectedWallets[index].selected;

      setListWallets(newSelectedWallets);

      updateCart(
        newSelectedWallets[index].selected ? wallet.maximum_use : 0,
        wallet.zone_code,
      );
    },
    [listWallets],
  );

  const handleSelectQuantity = useCallback(
    (quantity, wallet) => {
      if (refModal.current) {
        refModal.current.close();
      }

      let point = 0;

      const newListWallets = [...listWallets];
      newListWallets.some((w) => {
        if (w.zone_code === wallet.zone_code) {
          if (quantity > wallet?.balance) {
            return true;
          } else if (
            quantity < wallet?.balance &&
            quantity > wallet?.maximum_use
          ) {
            point = wallet?.maximum_use;
          } else {
            point = quantity;
          }

          w.point = point;
        }

        return w.zone_code === wallet.zone_code;
      });

      setListWallets(newListWallets);
      updateCart(quantity, wallet.zone_code);
    },
    [listWallets],
  );

  const showModal = useCallback(
    (wallet) => {
      push(appConfig.routes.modalInput, {
        backdropPressToClose: true,
        title: t('wallet.enterPointLabel'),
        btnTitle: t('common:select'),
        onSubmit: (quantity) => handleSelectQuantity(quantity, wallet),
        description: t('wallet.enterPointUse'),
        value: String(wallet.point || ''),
        textInputProps: {
          autoFocus: true,
          keyboardType: appConfig.device.isIOS ? 'number-pad' : 'numeric',
          textAlign: 'center',
        },
        textInputStyle: {flex: 1},
        extraInput: <ExtraQuantityInput message={wallet.symbol} />,
        textInputContainerStyle: {flexDirection: 'row'},
        refModal: (inst) => (refModal.current = inst),
      });
    },
    [handleSelectQuantity],
  );

  const baseContainerStyle = useMemo(() => {
    return mergeStyles(styles.container, containerStyle);
  }, [containerStyle]);

  const inputWalletStyle = useMemo(() => {
    return mergeStyles(
      styles.inputWallet,
      editable
        ? {
            backgroundColor: theme.color.disabled,
            borderRadius: theme.layout.borderRadiusSmall,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }
        : {},
    );
  }, [theme, editable]);

  const iconCheckboxStyle = useMemo(() => {
    return mergeStyles(styles.iconCheckbox, {
      color: theme.color.primaryHighlight,
    });
  }, [theme]);

  const renderCheckBox = useCallback(
    (wallet, index, isDisabled) => {
      return (
        <IconButton
          disabled={isDisabled}
          hitSlop={HIT_SLOP}
          style={{justifyContent: 'flex-start'}}
          iconStyle={[
            iconCheckboxStyle,
            isDisabled && {color: theme.color.onDisabled, opacity: 0},
          ]}
          bundle="MaterialCommunityIcons"
          name={wallet.selected ? 'checkbox-marked' : 'checkbox-blank-outline'}
          onPress={() => handlePressWallet(wallet, index)}
        />
      );
    },
    [iconCheckboxStyle, handlePressWallet, theme],
  );

  return (
    <SectionContainer style={baseContainerStyle}>
      {listWallets.map((wallet, index) => {
        const isDisabled = !wallet.balance;

        if (showSelectedOnlyWallet && !wallet.selected) {
          return null;
        }

        return (
          <View key={index} pointerEvents={editable ? 'auto' : 'none'}>
            <View
              style={[
                styles.walletContainer,
                index > 0 && {
                  borderTopWidth: theme.layout.borderWidthSmall,
                  borderColor: theme.color.border,
                },
                isDisabled && {
                  backgroundColor: theme.color.disabled,
                },
                walletContainerStyle,
              ]}>
              <View style={styles.labelWalletContainer}>
                {renderCheckBox(wallet, index, isDisabled)}
                <View>
                  <Typography
                    onDisabled={isDisabled}
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.walletName}>
                    {wallet.wallet_name}
                  </Typography>
                  <Typography
                    onDisabled={isDisabled}
                    type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}>
                    {t('wallet.walletBalance', {
                      balance: wallet.balance_point_view,
                    })}
                  </Typography>
                </View>
              </View>

              <View style={styles.contentWalletContainer}>
                {isDisabled ? (
                  <Typography
                    onDisabled={isDisabled}
                    type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                    {wallet?.point_view}
                  </Typography>
                ) : wallet.selected ? (
                  <View style={styles.address_default_box}>
                    <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                      -
                    </Typography>
                    <TextButton
                      hitSlop={HIT_SLOP}
                      style={inputWalletStyle}
                      onPress={() => showModal(wallet)}
                      typoProps={typoPropsPoint}>
                      {String(wallet?.point)}
                    </TextButton>
                    <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                      {wallet?.symbol}
                    </Typography>
                  </View>
                ) : (
                  <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                    {t('wallet.notUsePoint')}
                  </Typography>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </SectionContainer>
  );
};

export default React.memo(WalletSection);
