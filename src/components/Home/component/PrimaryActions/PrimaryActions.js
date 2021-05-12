import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import Button from 'react-native-button';
import getImageRatio from 'app-packages/tickid-util/getImageRatio';
import PointRechargeButton from './PointRechargeButton';
import {
  isActivePackageOptionConfig,
  PACKAGE_OPTIONS_TYPE,
} from '../../../../helper/packageOptionsHandler';
import QRScanButton from './QRScanButton';
import Themes from 'src/Themes';

const homeThemes = Themes.getNameSpace('home');
const primaryActionStyles = homeThemes('styles.home.primaryAction');
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
  render() {
    const props = this.props;
    const actionsWrapper = !props.primaryActions && {
      height: null,
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.actionsWrapper,
            actionsWrapper,
            primaryActionStyles.shadowWrapper,
          ]}>
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
            ) : (
              <View style={{height: 50}} />
            )}

            <Button
              containerStyle={styles.surplusContainer}
              onPress={() => props.onSurplusNext()}>
              <View style={styles.walletInfoWrapper}>
                <Text style={[styles.walletNameLabel]}>{props.walletName}</Text>

                <View style={styles.walletLabelRight}>
                  <Text style={[styles.surplus]}>{props.surplus}</Text>
                </View>
                <View style={styles.iconNextWrapper}>
                  <Icon name="chevron-right" size={20} color="#9F9F9F" />
                </View>
              </View>
            </Button>
          </View>
          {this.isActivePrimaryActions && props.primaryActions && (
            <View style={styles.walletAction}>
              {props.primaryActions.map((action) => (
                <Button
                  key={action.type}
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
  onPressItem: PropTypes.func,
  primaryActions: PropTypes.array,
};

PrimaryActions.defaultProps = {
  surplus: '1,000,000đ',
  onSurplusNext: defaultListener,
  onPressItem: defaultListener,
};

let styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  actionsWrapper: {
    width: appConfig.device.width - 32,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ebebeb',
    overflow: 'hidden',
    // height: 140,
  },
  mainContentWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  walletInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  pointRechargeBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginLeft: -15,
  },
  pointRechargeBtn: {
    paddingVertical: 10,
  },
  pointRechargeBtnSeparatorContainer: {
    paddingVertical: 10,
  },
  pointRechargeBtnSeparator: {
    flex: 1,
    width: 0.5,
    backgroundColor: '#ccc',
  },
  surplusContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  walletAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  walletLabelRight: {
    paddingLeft: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
  },
  scanIcon: {
    fontSize: 28,
    color: appConfig.colors.primary,
    // paddingRight: 10
  },
  iconNextWrapper: {
    fontSize: 20,
    color: '#2B2B2B',
    lineHeight: 20,
  },
  iconNext: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  walletNameLabel: {
    flex: 1,
    paddingRight: 10,
    color: '#2B2B2B',
    fontSize: 16,
    fontWeight: '500',
  },
  surplus: {
    fontSize: 20,
    color: '#2B2B2B',
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
    fontSize: 12,
    marginTop: 5,
    color: '#414242',
    fontWeight: '500',
  },
});

styles = Themes.mergeStyles(styles, primaryActionStyles);

export default observer(PrimaryActions);
