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
import { CONFIG_KEY, isConfigActive } from '../../../../helper/configKeyHandler';
import store from 'app-store';

class PrimaryActions extends Component {
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
    return isConfigActive(CONFIG_KEY.VIEW_COMMISSIONS_AT_HOMEPAGE)
  }

  render() {
    const props = this.props;
    const revenue_commissions = store.user_info.revenue_commissions;
    const actionsWrapper = !props.primaryActions && {
      height: null,
    };
    return (
      <View style={styles.container}>
        <View style={[styles.actionsWrapper, actionsWrapper]}>
          <View style={styles.mainContentWrapper}>
            {this.isActiveQRScan ? (
              <View style={styles.pointRechargeBtnContainer}>
                <QRScanButton
                  wrapperStyle={styles.pointRechargeBtn}
                  iconStyle={styles.scanIcon}
                />
                <View style={styles.pointRechargeBtnSeparatorContainer}>
                  <View style={styles.pointRechargeBtnSeparator} />
                </View>
              </View>
            ) : this.isActiveTopUp ? (
              <View style={styles.pointRechargeBtnContainer}>
                <PointRechargeButton
                  wrapperStyle={styles.pointRechargeBtn}
                  iconStyle={styles.scanIcon}
                />
                <View style={styles.pointRechargeBtnSeparatorContainer}>
                  <View style={styles.pointRechargeBtnSeparator} />
                </View>
              </View>
            ) : null}

            {!this.isActiveCommissions ? (
              <Button
                containerStyle={styles.surplusContainer}
                onPress={() => props.onSurplusNext()}>
                <View style={styles.walletInfoWrapper}>
                  <Text style={styles.walletNameLabel}>{props.walletName}</Text>

                  <View style={styles.walletLabelRight}>
                    <Text style={styles.surplus}>{props.surplus}</Text>
                  </View>
                  
                  <View style={styles.iconNextWrapper}>
                    <AntDesignIcon name="arrow-right" style={styles.iconNext} />
                      {/* <Image style={styles.iconNext} source={imageIconNext} /> */}
                  </View>
                </View>
              </Button>
            ) : (
              <Button
                containerStyle={styles.surplusContainer}
                onPress={() => props.onPressCommission()}>
                <View style={styles.walletInfoWrapper}>
                  <Text style={styles.walletNameLabel}>{revenue_commissions?.this_month_commissions.title}</Text>
                  <View style={styles.walletLabelRight}>
                    <Text style={styles.surplus}>{revenue_commissions?.this_month_commissions.value}</Text>
                  </View>
                  <View style={styles.iconNextWrapper}>
                    <AntDesignIcon name="arrow-right" style={styles.iconNext} />
                  </View>
                </View>
              </Button>
            )}
          </View>
          {this.isActivePrimaryActions && props.primaryActions && (
            <View style={styles.walletAction}>
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
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </View>
                </Button>
              ))}
            </View>
          )}
        </View>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    ...appConfig.styles.shadow,
  },
  mainContentWrapper: {
    flexDirection: 'row',
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    minHeight: 50
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
    borderColor: appConfig.colors.border,
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
    ...appConfig.styles.typography.heading1,
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
    ...appConfig.styles.typography.sub,
  },
});

export default observer(PrimaryActions);
