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
import imageIconPoints from '../../../../images/points.png';
import imageIconTrans from '../../../../images/trans.png';
import imageIconVoucher from '../../../../images/voucher.png';
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
          <TouchableHighlight
            onPress={props.onSavePoint}
            underlayColor="transparent"
            style={styles.actionBtn}
          >
            <View style={styles.actionBtnWrapper}>
              <Image style={styles.iconPoint} source={imageIconPoints} />
              <Text style={[styles.actionLabel, { marginTop: 10 }]}>
                Tích điểm
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={props.onMyVoucher}
            underlayColor="transparent"
            style={styles.actionBtn}
          >
            <View style={styles.actionBtnWrapper}>
              <Image style={styles.iconTransaction} source={imageIconVoucher} />
              <Text style={styles.actionLabel}>Voucher của tôi</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={props.onTransaction}
            underlayColor="transparent"
            style={styles.actionBtn}
          >
            <View style={styles.actionBtnWrapper}>
              <Image style={styles.iconTransaction} source={imageIconTrans} />
              <Text style={styles.actionLabel}>Giao dịch</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const defaultListener = () => {};

PrimaryActions.propTypes = {
  surplus: PropTypes.string,
  onSavePoint: PropTypes.func,
  onSurplusNext: PropTypes.func,
  onMyVoucher: PropTypes.func,
  onTransaction: PropTypes.func
};

PrimaryActions.defaultProps = {
  surplus: '1,000,000đ',
  onSavePoint: defaultListener,
  onSurplusNext: defaultListener,
  onMyVoucher: defaultListener,
  onTransaction: defaultListener
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  actionsWrapper: {
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    margin: MARGIN_HORIZONTAL,
    position: 'absolute',
    top: -99,
    left: 0,
    right: 0,
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
    paddingHorizontal: MARGIN_HORIZONTAL,
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
  actionBtn: {
    width: ~~(Util.size.width / 3.5),
    paddingVertical: 4,
    paddingHorizontal: 0
  },
  actionBtnWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#414242',
    fontWeight: '500'
  },
  walletLabelRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  iconPoint: {
    width: 28,
    height: 28,
    resizeMode: 'cover'
  },
  iconTransaction: {
    width: 32,
    height: 32,
    resizeMode: 'cover'
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
  }
});

export default PrimaryActions;
