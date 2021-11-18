import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import appConfig from 'app-config';
import Button from 'react-native-button';
import getImageRatio from 'app-packages/tickid-util/getImageRatio';
import imageIconNext from '../../../../images/next.png';
import PointRechargeButton from './PointRechargeButton';
import {
  isActivePackageOptionConfig,
  PACKAGE_OPTIONS_TYPE,
} from '../../../../helper/packageOptionsHandler';
import QRScanButton from './QRScanButton';
import AntDesignIcon from 'react-native-vector-icons/SimpleLineIcons';
import {CONFIG_KEY, isConfigActive} from '../../../../helper/configKeyHandler';
import store from 'app-store';
import Typography from 'src/components/base/Typography/Typography';
import {TypographyType} from 'src/components/base/Typography/constants';
import {Card} from 'src/components/base';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

class PrimaryActions extends Component {
  static contextType = ThemeContext;

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

  render() {
    const theme = getTheme(this);
    const props = this.props;
    const revenue_commissions = store.user_info.revenue_commissions;
    const actionsWrapper = !props.primaryActions && {
      height: null,
    };
    const walletName = props.walletName;
    const walletValue = this.isActiveCommissions
      ? revenue_commissions?.this_month_commissions.value
      : props.surplus;

    const walletActionStyle = mergeStyles(
      [
        styles.walletAction,
        {
          borderColor: theme.color.border,
        },
      ],
      this.isHideWalletBox && styles.extraWalletAction,
    );

    const pointRechargeBtnSeparatorStyle = mergeStyles(
      styles.pointRechargeBtnSeparator,
      {
        backgroundColor: theme.color.border,
      },
    );

    const iconNextStyle = mergeStyles(styles.iconNext, {
      color: theme.color.iconInactive,
    });

    return (
      <View style={styles.container}>
        <Card style={[styles.actionsWrapper, actionsWrapper]}>
          {!this.isHideWalletBox && (
            <View style={styles.mainContentWrapper}>
              {this.isActiveQRScan ? (
                <View style={styles.pointRechargeBtnContainer}>
                  <QRScanButton
                    wrapperStyle={styles.pointRechargeBtn}
                    iconStyle={styles.scanIcon}
                  />
                  <View style={styles.pointRechargeBtnSeparatorContainer}>
                    <View style={pointRechargeBtnSeparatorStyle} />
                  </View>
                </View>
              ) : this.isActiveTopUp ? (
                <View style={styles.pointRechargeBtnContainer}>
                  <PointRechargeButton
                    wrapperStyle={styles.pointRechargeBtn}
                    iconStyle={styles.scanIcon}
                  />
                  <View style={styles.pointRechargeBtnSeparatorContainer}>
                    <View style={pointRechargeBtnSeparatorStyle} />
                  </View>
                </View>
              ) : null}

              <Button
                containerStyle={styles.surplusContainer}
                onPress={() => this.handlePressWallet()}>
                <View style={styles.walletInfoWrapper}>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.walletNameLabel}>
                    {walletName}
                  </Typography>

                  <View style={styles.walletLabelRight}>
                    <Typography
                      type={TypographyType.TITLE_LARGE}
                      style={styles.surplus}>
                      {walletValue}
                    </Typography>
                  </View>

                  <View style={styles.iconNextWrapper}>
                    <AntDesignIcon name="arrow-right" style={iconNextStyle} />
                  </View>
                </View>
              </Button>
            </View>
          )}
          {this.isActivePrimaryActions && props.primaryActions && (
            <View style={walletActionStyle}>
              {props.primaryActions.map((action, index) => (
                <Button
                  key={index}
                  onPress={() => props.onPressItem(action)}
                  containerStyle={styles.actionButton}>
                  <View style={styles.actionWrapper}>
                    <Image
                      source={{uri: action.icon}}
                      style={[
                        styles.actionIcon,
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
                      onSurface
                      style={styles.actionTitle}>
                      {action.title}
                    </Typography>
                  </View>
                </Button>
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
    // backgroundColor: '#fff',
    // borderRadius: 8,
    ...appConfig.styles.shadow,
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
    // marginRight: 15,
    // marginLeft: -15,
  },
  pointRechargeBtn: {
    // paddingVertical: 7.5,
  },
  pointRechargeBtnSeparatorContainer: {
    // paddingVertical: 7.5,
    paddingHorizontal: 12,
  },
  pointRechargeBtnSeparator: {
    flex: 1,
    width: 1,
    backgroundColor: appConfig.colors.border,
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
    color: appConfig.colors.primary,
    // paddingRight: 10
  },
  iconNextWrapper: {
    lineHeight: 20,
    marginLeft: 10,
  },
  iconNext: {
    // width: 20,
    // height: 20,
    // resizeMode: 'cover',

    color: '#9F9F9F',
    fontSize: 12,
  },
  walletNameLabel: {
    flex: 1,
    paddingRight: 10,
  },
  surplus: {
    // ...appConfig.styles.typography.heading1,
  },
  actionButton: {
    flex: 1,
  },
  actionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    backgroundColor: appConfig.colors.primary,
  },
  actionTitle: {
    marginTop: 10,
    // ...appConfig.styles.typography.sub,
    textAlign: 'center',
  },
});

export default observer(PrimaryActions);
