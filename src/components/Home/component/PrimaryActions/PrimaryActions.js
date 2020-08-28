import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import appConfig from 'app-config';
import Button from 'react-native-button';
import getImageRatio from 'app-packages/tickid-util/getImageRatio';
import imageIconNext from '../../../../images/next.png';
import Icon from 'react-native-vector-icons/FontAwesome';

class PrimaryActions extends Component {
  render() {
    const actionsWrapper = !this.props.primaryActions && {
      height: null
    };
    return (
      <View style={styles.container}>
        <View style={[styles.actionsWrapper, actionsWrapper]}>
          <Button onPress={this.props.onWalletPress}>
            <Icon name="plus-circle" style={styles.scanIcon} />
          </Button>
          <Button
            containerStyle={{ width: '100%', flex: 1 }}
            onPress={() => this.props.onSurplusNext()}
          >
            <View style={styles.walletInfoWrapper}>
              <Text numberOfLines={2} style={styles.walletNameLabel}>
                {this.props.walletName}
              </Text>

              <View style={styles.walletLabelRight}>
                <Text style={styles.surplus}>{this.props.surplus}</Text>
              </View>
              <View style={styles.iconNextWrapper}>
                <Image style={styles.iconNext} source={imageIconNext} />
              </View>
            </View>
          </Button>
        </View>
        {this.props.primaryActions && (
          <View style={styles.walletAction}>
            {this.props.primaryActions.map(action => (
              <Button
                key={action.type}
                onPress={() => this.props.onPressItem(action)}
                containerStyle={styles.actionButton}
              >
                <View style={styles.actionWrapper}>
                  <Image
                    source={{ uri: action.icon }}
                    style={[
                      styles.actionIcon,
                      {
                        ...getImageRatio(
                          action.iconOriginSize.width,
                          action.iconOriginSize.height,
                          undefined,
                          35
                        )
                      }
                    ]}
                  />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </View>
              </Button>
            ))}
          </View>
        )}
      </View>
    );
  }
}

const defaultListener = () => {};

PrimaryActions.propTypes = {
  surplus: PropTypes.string,
  onSurplusNext: PropTypes.func,
  onPressItem: PropTypes.func,
  primaryActions: PropTypes.array
};

PrimaryActions.defaultProps = {
  surplus: '1,000,000đ',
  onSurplusNext: defaultListener,
  onPressItem: defaultListener
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  actionsWrapper: {
    width: appConfig.device.width - 32,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    // height: 140,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      android: {
        elevation: 2,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1'
      }
    })
  },
  walletInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 0.5,
    borderColor: '#ccc'
  },
  walletAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb'
  },
  walletLabelRight: {
    paddingLeft: 5,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  scanIcon: {
    top: 3,
    fontSize: 36,
    color: appConfig.colors.primary,
    fontWeight: 'bold',
    paddingRight: 15
  },
  iconNextWrapper: {
    fontSize: 20,
    color: '#042C5C',
    fontWeight: 'bold',
    lineHeight: 20,
    marginLeft: 10
  },
  iconNext: {
    width: 20,
    height: 20,
    resizeMode: 'cover'
  },
  walletNameLabel: {
    flex: 1,
    paddingRight: 10,
    color: '#042C5C',
    fontSize: 16,
    fontWeight: '500'
  },
  surplus: {
    fontSize: 18,
    color: '#042C5C',
    fontWeight: '600',
    lineHeight: 20
  },
  actionButton: {
    flex: 1
  },
  actionWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionIcon: {
    backgroundColor: appConfig.colors.primary
  },
  actionTitle: {
    fontSize: 12,
    marginTop: 5,
    color: '#414242',
    fontWeight: '500'
  }
});

export default PrimaryActions;
