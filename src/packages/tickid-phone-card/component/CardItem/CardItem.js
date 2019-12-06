import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import getNetworkImage from '../../helper/getNetworkImage';
import moreImage from '../../assets/images/more.png';
import config from '../../config';

const defaultListener = () => {};

class CardItem extends Component {
  static propTypes = {
    cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    networkType: PropTypes.string,
    networkName: PropTypes.string,
    statusView: PropTypes.string,
    price: PropTypes.string,
    buyTime: PropTypes.string,
    cardCode: PropTypes.string,
    cardSeri: PropTypes.string,
    isPay: PropTypes.bool,
    isUsed: PropTypes.bool,
    showMoreMenu: PropTypes.bool,
    isBuyCard: PropTypes.bool,
    onOpenMoreMenu: PropTypes.func,
    onCopyCardCode: PropTypes.func,
    onSendCard: PropTypes.func,
    onUseNow: PropTypes.func
  };

  static defaultProps = {
    cardId: '',
    networkType: '',
    networkName: '',
    statusView: '',
    price: '',
    buyTime: '',
    cardCode: '',
    cardSeri: '',
    isPay: false,
    isUsed: false,
    showMoreMenu: true,
    isBuyCard: false,
    onOpenMoreMenu: defaultListener,
    onCopyCardCode: defaultListener,
    onSendCard: defaultListener,
    onUseNow: defaultListener
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.isUsed && styles.isUsed,
          this.props.isPay && styles.isPay
        ]}
      >
        <View style={styles.cardInfoWrapper}>
          <Image
            style={styles.cardImage}
            source={getNetworkImage(this.props.networkType)}
          />
          <View style={styles.cardInfoBox}>
            <Text style={styles.networkName}>{this.props.networkName}</Text>
            <Text style={styles.cardValue}>{this.props.price}</Text>
            <Text style={styles.cardBuyTime}>{this.props.buyTime}</Text>
          </View>
        </View>

        {!!this.props.cardCode && (
          <View style={styles.codeBox}>
            <Text style={styles.cardCode}>{this.props.cardCode}</Text>
            <Button
              style={styles.copyText}
              containerStyle={styles.copyBtn}
              onPress={() => this.props.onCopyCardCode(this.props.cardId)}
            >
              SAO CHÉP
            </Button>
          </View>
        )}

        {!!this.props.cardSeri && (
          <Text style={styles.cardSeri}>Số seri: {this.props.cardSeri}</Text>
        )}

        {!this.props.isBuyCard && (
          <Text style={styles.statusView}>
            {this.props.isPay ? 'Thẻ đã thanh toán' : this.props.statusView}
          </Text>
        )}

        {this.props.isBuyCard && (
          <View style={styles.buttonBox}>
            {!this.props.isUsed && !this.props.isPay && (
              <Button
                style={styles.sendCardText}
                containerStyle={styles.sendCardBtn}
                onPress={() => this.props.onSendCard(this.props.cardId)}
              >
                Gửi thẻ nạp
              </Button>
            )}

            <Button
              style={styles.useNowText}
              containerStyle={styles.useNowBtn}
              onPress={() => this.props.onUseNow(this.props.cardId)}
            >
              {this.props.isPay
                ? 'Thẻ đã thanh toán'
                : this.props.isUsed
                ? 'Thẻ đã sử dụng'
                : 'Nạp ngay'}
            </Button>
          </View>
        )}

        {false && ( //this.props.showMoreMenu
          <Button
            style={styles.moreText}
            containerStyle={styles.moreBtn}
            onPress={this.props.onOpenMoreMenu}
          >
            <Image style={styles.moreImage} source={moreImage} />
          </Button>
        )}

        {(this.props.isUsed || this.props.isPay) && (
          <View style={styles.usedOverlay} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 90,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 10,
    paddingHorizontal: 8
  },
  isUsed: {
    borderColor: '#f1f1f1'
  },
  isPay: {
    borderColor: '#f1f1f1'
  },
  usedOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    ...StyleSheet.absoluteFill
  },
  cardInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardImage: {
    width: 60,
    height: 60
  },
  cardInfoBox: {
    marginLeft: 8
  },
  networkName: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2
  },
  cardValue: {
    color: config.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2
  },
  cardBuyTime: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f6f9',
    paddingHorizontal: 16,
    borderRadius: 3,
    marginTop: 16
  },
  cardCode: {
    color: config.colors.black,
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2
  },
  copyText: {
    fontSize: 12,
    fontWeight: '600'
  },
  copyBtn: {
    paddingVertical: 13,
    paddingLeft: 32
  },
  cardSeri: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    color: config.colors.black
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  sendCardText: {
    fontSize: 15,
    color: '#777',
    fontWeight: 'bold'
  },
  sendCardBtn: {
    paddingVertical: 16
  },
  useNowText: {
    fontSize: 15,
    color: config.colors.primary,
    fontWeight: 'bold',
    marginLeft: 24
  },
  useNowBtn: {
    paddingVertical: 16
  },
  moreText: {},
  moreImage: {
    width: 20,
    height: 20
  },
  moreBtn: {
    position: 'absolute',
    top: -4,
    right: 0,
    padding: 12,
    zIndex: 1
  },
  statusView: {
    fontSize: 13,
    fontWeight: '400',
    position: 'absolute',
    bottom: 8,
    right: 10,
    color: config.colors.primary
  }
});

export default CardItem;
