/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  AppFilledButton,
  BaseButton,
  Container,
  ScreenWrapper,
} from 'src/components/base';
import {Input, Typography, Icon} from 'src/components/base';
import Indicator from 'src/components/Indicator';

class PayWallet extends Component {
  static contextType = ThemeContext;

  state = {
    historiesData: null,
    wallet: this.props.wallet,
    address: this.props.address,
    loading: false,
    amount: 0,
  };
  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  // thực hiện add cửa hàng vào account của user
  _onSave() {
    const {t} = this.props;
    const {wallet, address, amount} = this.state;
    if (!address) {
      return Alert.alert(
        t('notification'),
        t('inactiveAddress'),
        [{text: t('common:agree')}],
        {cancelable: false},
      );
    }

    if (!amount || !validateMoney(amount)) {
      return Alert.alert(t('notification'), t('inactiveQuantity'), [
        {
          text: t('common:agree'),
          onPress: () => {
            this.amountInput.focus();
          },
        },
      ]);
    }

    // if (!password) {
    //   return Alert.alert(
    //     'Thông báo',
    //     'Hãy điền Mật khẩu',
    //     [
    //       {text: 'Đồng ý', onPress: () => {
    //         this.refs_password.focus();
    //       }},
    //     ],
    //     { cancelable: false }
    //   );
    // }
    if (this.state.loading) {
      return;
    }

    this._transfer(wallet, address, amount);
  }

  _transfer(wallet, address, amount) {
    //, password, refer
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const response = await APIHandler.user_transfer_balance({
            zone_code: wallet?.zone_code,
            receive_address: address,
            amount: amount,
          });
          if (response && response.status == STATUS_SUCCESS) {
            action(() => {
              this.setState(
                {
                  loading: false,
                },
                () => {},
              );
            })();
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
          } else {
            this.setState({
              loading: false,
            });
            flashShowMessage({
              type: 'danger',
              message: response.message,
            });
          }
        } catch (e) {
          this.setState({
            loading: false,
          });
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  }

  renderTopLabelCoin() {
    const {wallet} = this.state;
    return (
      <View>
        <View style={[this.topLabelBoxStyle, styles.add_store_actions_box]}>
          <BaseButton useTouchableHighlight style={styles.add_store_action_btn}>
            <View
              style={[
                this.topLabelBalanceBoxStyle,
                styles.add_store_action_btn_box_balance,
              ]}>
              <Typography
                renderIconBefore={(titleStyle) =>
                  this.renderTopLabelIcon(titleStyle, wallet)
                }
                type={TypographyType.LABEL_MEDIUM}
                style={styles.add_store_action_label_balance}>
                {wallet?.name}
              </Typography>
              {/* <Text style={styles.add_store_action_label_balance}>{wallet.address}</Text> */}
            </View>
          </BaseButton>

          <BaseButton useTouchableHighlight style={styles.add_store_action_btn}>
            <View
              style={[
                styles.add_store_action_btn_box_balance,
                {borderRightWidth: 0},
              ]}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.add_store_action_label_balance}>
                {this.props.t('balance')}
              </Typography>
              <Typography
                type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
                style={styles.add_store_action_content}>
                {wallet?.balance_view}
              </Typography>
            </View>
          </BaseButton>
        </View>
      </View>
    );
  }

  renderTopLabelIcon = (titleStyle, wallet) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name={wallet?.icon}
        style={(titleStyle, styles.topLabelIcon)}
      />
    );
  };

  renderTransferIcon = (titleStyle, _, fontStyle) => (
    <Icon
      bundle={BundleIconSetName.FONT_AWESOME}
      name="bank"
      style={[fontStyle, styles.transferIcon]}
    />
  );

  get topLabelBoxStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }
  get topLabelBalanceBoxStyle() {
    return {
      borderRightWidth: this.theme.layout.borderWidthPixel,
      borderRightColor: this.theme.color.border,
    };
  }

  get inputStyle() {
    return {
      borderColor: this.theme.color.neutral,
      borderWidth: this.theme.layout.borderWidth,
    };
  }

  render() {
    const {wallet, address, loading} = this.state;
    const {t} = this.props;

    return (
      <ScreenWrapper safeLayout={store.keyboardTop}>
        <Container style={{paddingVertical: 15}}>
          {this.renderTopLabelCoin()}

          <Container row noBackground style={styles.historyCoinContainer}>
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE}
              style={styles.historyCoinText}
              renderIconBefore={this.renderTransferIcon}>
              {t('transferTitle', {walletName: wallet?.name})}
            </Typography>
          </Container>
          <Typography
            type={TypographyType.LABEL_SEMI_HUGE}
            style={styles.historyCoinTextAddress}>
            {address}
          </Typography>
          <View style={styles.invite_text_input}>
            <View style={styles.invite_text_input_sub}>
              <Typography
                type={TypographyType.LABEL_LARGE_TERTIARY}
                style={{
                  fontWeight: '500',
                  marginBottom: 8,
                }}>
                {t('transferPlaceholder', {
                  currency: wallet?.currency,
                  walletName: wallet?.name,
                })}
              </Typography>
              <Input
                ref={(ref) => (this.amountInput = ref)}
                type={TypographyType.LABEL_SEMI_HUGE}
                style={[this.inputStyle, styles.input]}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                onChangeText={(value) => {
                  this.setState({
                    amount: value.replaceAll(' ', ''),
                  });
                }}
                // autoFocus
                value={this.state.amount}
              />
              <Typography type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}>
                {t('transferMessage')}
              </Typography>
              <AppFilledButton
                disabled={!this.state.amount}
                renderIconLeft={(titleStyle) => {
                  return loading ? (
                    <Indicator size="small" />
                  ) : (
                    <Icon
                      bundle={BundleIconSetName.FONT_AWESOME}
                      name="check"
                      style={[titleStyle, {marginRight: 5, fontSize: 16}]}
                    />
                  );
                }}
                typoProps={{type: TypographyType.LABEL_MEDIUM}}
                onPress={this._onSave.bind(this)}
                style={styles.boxButtonAction}>
                {t('transfer')}
              </AppFilledButton>
            </View>
          </View>
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  historyCoinContainer: {
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
  },
  historyCoinText: {
    fontWeight: 'bold',
    flex: 1,
  },
  historyCoinTextAddress: {
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  add_store_action_btn: {
    paddingVertical: 4,
  },
  add_store_action_btn_box_balance: {
    alignItems: 'center',
    width: ~~(appConfig.device.width / 2),
  },
  add_store_action_label_balance: {
    marginTop: 4,
    fontWeight: '600',
  },
  add_store_action_content: {
    marginTop: 5,
    fontWeight: '800',
  },

  invite_text_input: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "",
    // marginTop: 30,
    marginTop: 20,
  },

  invite_text_input_sub: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  boxButtonAction: {
    marginTop: 8,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  topLabelIcon: {
    fontSize: 24,
  },
  transferIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  input: {
    height: 42,
    width: 250,
    marginHorizontal: 15,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default withTranslation('payWallet')(observer(PayWallet));
