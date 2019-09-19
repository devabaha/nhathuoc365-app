import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Platform
} from 'react-native';
import appConfig from 'app-config';
import Button from 'react-native-button';
import getImageRatio from 'app-packages/tickid-util/getImageRatio';
import { PRIMARY_ACTIONS } from '../../constants';
import imageIconNext from '../../../../images/next.png';

function PrimaryActions(props) {
  return (
    <View style={styles.container}>
      <View style={styles.actionsWrapper}>
        <View style={styles.walletInfoWrapper}>
          <Text style={styles.walletNameLabel}>Ví tích điểm</Text>
          <Text style={styles.walletName}> Tick</Text>

          <View style={styles.walletLabelRight}>
            <Text style={styles.surplus}>{props.surplus}</Text>
          </View>

          <TouchableHighlight
            onPress={props.onSurplusNext}
            underlayColor="transparent"
          >
            <View style={styles.iconNextWrapper}>
              <Image style={styles.iconNext} source={imageIconNext} />
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.walletAction}>
          {PRIMARY_ACTIONS.map(action => (
            <Button
              key={action.type}
              onPress={() => props.onPressItem(action)}
              containerStyle={styles.actionButton}
            >
              <View style={styles.actionWrapper}>
                <Image
                  source={action.icon}
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
      </View>
    </View>
  );
}

const defaultListener = () => {};

PrimaryActions.propTypes = {
  surplus: PropTypes.string,
  onSurplusNext: PropTypes.func,
  onPressItem: PropTypes.func
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
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 140,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  walletAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
    paddingTop: 16
  },
  walletLabelRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
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
    color: '#9B04F1',
    fontSize: 14,
    fontWeight: '500'
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
    color: '#9B04F1'
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
