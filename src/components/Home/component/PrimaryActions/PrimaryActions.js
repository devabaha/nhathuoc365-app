import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import getImageRatio from 'app-packages/tickid-util/getImageRatio';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {isConfigActive} from 'app-helper/configKeyHandler';
import {isActivePackageOptionConfig} from 'app-helper/packageOptionsHandler';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {PACKAGE_OPTIONS_TYPE} from 'app-helper/packageOptionsHandler';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import PointRechargeButton from './PointRechargeButton';
import QRScanButton from './QRScanButton';
import {BaseButton, Card, Icon, Typography} from 'src/components/base';
import Image from 'src/components/Image';

class PrimaryActions extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  get isActivePrimaryActions() {
    return isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.PRIMARY_ACTIONS);
  }

  get isActiveQRScan() {
    return isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.QR_SCAN);
  }

  get isActiveTopUp() {
    return isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.TOP_UP);
  }

  get hasContent() {
    return isActivePackageOptionConfig(
      PACKAGE_OPTIONS_TYPE.TOP_UP,
      PACKAGE_OPTIONS_TYPE.PRIMARY_ACTIONS,
    );
  }

  get isActiveCommissions() {
    return isConfigActive(CONFIG_KEY.VIEW_COMMISSIONS_AT_HOMEPAGE);
  }

  get isHideWalletBox() {
    return isConfigActive(CONFIG_KEY.HIDE_WALLET_HOMEPAGE_KEY);
  }

  handlePressWallet = () => {
    this.isActiveCommissions
      ? this.props.onPressCommission && this.props.onPressCommission()
      : this.props.onSurplusNext && this.props.onSurplusNext();
  };

  get walletActionStyle() {
    return mergeStyles(
      [
        styles.walletAction,
        {
          borderColor: this.theme.color.border,
        },
      ],
      this.isHideWalletBox && styles.extraWalletAction,
    );
  }

  get pointRechargeBtnSeparatorStyle() {
    return mergeStyles(styles.pointRechargeBtnSeparator, {
      backgroundColor: this.theme.color.border,
    });
  }

  get actionIconStyle() {
    return {
      backgroundColor: this.theme.color.persistPrimary,
    };
  }

  render() {
    const props = this.props;
    const revenue_commissions = store.user_info.revenue_commissions;
    const actionsWrapper = !props.primaryActions && {
      height: null,
    };
    const walletName = props.walletName;
    const walletValue = this.isActiveCommissions
      ? revenue_commissions?.this_month_commissions.value
      : props.surplus;

    return (
      <View style={styles.container}>
        <Card shadow style={[styles.actionsWrapper, actionsWrapper]}>
          {!this.isHideWalletBox && (
            <View style={styles.mainContentWrapper}>
              {this.isActiveQRScan ? (
                <View style={styles.pointRechargeBtnContainer}>
                  <QRScanButton
                    useTouchableHighlight={false}
                    wrapperStyle={styles.pointRechargeBtn}
                    iconStyle={styles.scanIcon}
                  />
                  <View style={styles.pointRechargeBtnSeparatorContainer}>
                    <View style={this.pointRechargeBtnSeparatorStyle} />
                  </View>
                </View>
              ) : this.isActiveTopUp ? (
                <View style={styles.pointRechargeBtnContainer}>
                  <PointRechargeButton
                    useTouchableHighlight={false}
                    wrapperStyle={styles.pointRechargeBtn}
                    iconStyle={styles.scanIcon}
                  />
                  <View style={styles.pointRechargeBtnSeparatorContainer}>
                    <View style={this.pointRechargeBtnSeparatorStyle} />
                  </View>
                </View>
              ) : null}

              <BaseButton
                style={styles.surplusContainer}
                onPress={this.handlePressWallet}>
                <View style={styles.walletInfoWrapper}>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.walletNameLabel}>
                    {walletName}
                  </Typography>

                  <View style={styles.walletLabelRight}>
                    <Typography
                      type={TypographyType.LABEL_HUGE}
                      style={styles.surplus}>
                      {walletValue}
                    </Typography>
                  </View>

                  <View style={styles.iconNextWrapper}>
                    <Icon
                      bundle={BundleIconSetName.SIMPLE_LINE_ICONS}
                      neutral
                      name="arrow-right"
                      style={styles.iconNext}
                    />
                  </View>
                </View>
              </BaseButton>
            </View>
          )}
          {this.isActivePrimaryActions && props.primaryActions && (
            <View style={this.walletActionStyle}>
              {props.primaryActions.map((action, index) => (
                <BaseButton
                  key={index}
                  onPress={() => props.onPressItem(action)}
                  style={styles.actionButton}>
                  <View style={styles.actionWrapper}>
                    <Image
                      source={{uri: action.icon}}
                      style={[
                        styles.actionIcon,
                        this.actionIconStyle,
                        {
                          ...getImageRatio(
                            action.iconOriginSize.width,
                            action.iconOriginSize.height,
                            undefined,
                            35,
                          ),
                        },
                      ]}
                    />
                    <Typography
                      type={TypographyType.LABEL_SMALL}
                      style={styles.actionTitle}>
                      {action.title}
                    </Typography>
                  </View>
                </BaseButton>
              ))}
            </View>
          )}
        </Card>
      </View>
    );
  }
}

const defaultListener = () => {};

PrimaryActions.propTypes = {
  surplus: PropTypes.string,
  onSurplusNext: PropTypes.func,
  onPressCommission: PropTypes.func,
  onPressItem: PropTypes.func,
  primaryActions: PropTypes.array,
};

PrimaryActions.defaultProps = {
  surplus: '1,000,000đ',
  onSurplusNext: defaultListener,
  onPressCommission: defaultListener,
  onPressItem: defaultListener,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  actionsWrapper: {
    width: appConfig.device.width - 30,
  },
  mainContentWrapper: {
    flexDirection: 'row',
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  walletInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointRechargeBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointRechargeBtn: {},
  pointRechargeBtnSeparatorContainer: {
    paddingHorizontal: 12,
  },
  pointRechargeBtnSeparator: {
    flex: 1,
    width: 1,
  },
  surplusContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  walletAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  extraWalletAction: {
    borderTopWidth: 0,
  },
  walletLabelRight: {
    paddingLeft: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  scanIcon: {
    fontSize: 30,
  },
  iconNextWrapper: {
    marginLeft: 10,
  },
  iconNext: {
    fontSize: 12,
  },
  walletNameLabel: {
    flex: 1,
    paddingRight: 10,
  },
  surplus: {},
  actionButton: {
    flex: 1,
  },
  actionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {},
  actionTitle: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default observer(PrimaryActions);
