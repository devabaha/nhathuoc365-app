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
    price: PropTypes.string,
    buyTime: PropTypes.string,
    cardCode: PropTypes.string,
    cardSeri: PropTypes.string,
    onOpenMoreMenu: PropTypes.func,
    onCopyCardCode: PropTypes.func,
    onSendCard: PropTypes.func,
    onUseNow: PropTypes.func
  };

  static defaultProps = {
    cardId: '',
    networkType: '',
    networkName: '',
    price: '',
    buyTime: '',
    cardCode: '',
    cardSeri: '',
    onOpenMoreMenu: defaultListener,
    onCopyCardCode: defaultListener,
    onSendCard: defaultListener,
    onUseNow: defaultListener
  };

  render() {
    return (
      <View style={styles.container}>
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

        <Text style={styles.cardSeri}>Số seri: {this.props.cardSeri}</Text>

        <View style={styles.buttonBox}>
          <Button
            style={styles.sendCardText}
            containerStyle={styles.sendCardBtn}
            onPress={() => this.props.onSendCard(this.props.cardId)}
          >
            Gửi thẻ nạp
          </Button>

          <Button
            style={styles.useNowText}
            containerStyle={styles.useNowBtn}
            onPress={() => this.props.onUseNow(this.props.cardId)}
          >
            Nạp ngay
          </Button>
        </View>

        <Button
          style={styles.moreText}
          containerStyle={styles.moreBtn}
          onPress={this.props.onOpenMoreMenu}
        >
          <Image style={styles.moreImage} source={moreImage} />
        </Button>
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
    padding: 12
  }
});

export default CardItem;
