import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import config from '../../config';
import numberFormat from '../../helper/numberFormat';
import getNetworkImage from '../../helper/getNetworkImage';

class SelectCardHistory extends Component {
  static propTypes = {
    data: PropTypes.array,
    onSelectCardHistory: PropTypes.func,
    onShowHistory: PropTypes.func,
    showHistory: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    onSelectCardHistory: () => {},
    onShowHistory: () => {},
    showHistory: true
  };

  renderCardValues() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        renderItem={this.renderCardValueItem}
        keyExtractor={(item, index) => `${index}`}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  getPrice = cashback => {
    return numberFormat(cashback) + 'đ';
  };

  renderCardValueItem = ({ item: card, index }) => {
    const last = index === this.props.data.length - 1;
    return (
      <Button
        onPress={() => this.props.onSelectCardHistory(card)}
        containerStyle={[
          styles.cardBtn,
          {
            marginRight: last ? 0 : 10
          }
        ]}
      >
        <View style={styles.btnContent}>
          <View style={styles.cardInfoWrapper}>
            <Image
              style={styles.networkImage}
              source={getNetworkImage(card.type)}
            />
            <View>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardBuyTime}>{card.buyTime}</Text>
            </View>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>
              Giá: <Text style={styles.cashback}>{card.price}</Text>
            </Text>
          </View>
        </View>
      </Button>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Text style={styles.label}>Mua thẻ nhanh</Text>

          {this.props.showHistory && (
            <Button onPress={this.props.onShowHistory}>
              <Text style={styles.viewHistoryText}>Xem lịch sử (20)</Text>
            </Button>
          )}
        </View>

        {this.renderCardValues()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16
  },
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewHistoryText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0084ff'
  },
  label: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18
  },
  cardBtn: {
    width: 200,
    flexDirection: 'column',
    height: 86,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 16
  },
  btnContent: {
    flex: 1
  },
  cardInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  networkImage: {
    width: 56,
    height: 56,
    marginLeft: 10
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: config.colors.black,
    marginLeft: 8
  },
  cardBuyTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
    marginLeft: 8
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
  valueActive: {
    color: config.colors.primary
  },
  descriptionWrapper: {
    borderRadius: 1,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    marginHorizontal: 8,
    paddingVertical: 3
  },
  description: {
    fontSize: 11,
    fontWeight: '400',
    color: '#333'
  },
  cashback: {
    fontWeight: '600',
    color: '#333'
  }
});

export default SelectCardHistory;
