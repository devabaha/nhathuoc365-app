import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import config from '../../config';
import numberFormat from '../../helper/numberFormat';

class SelectCardValue extends Component {
  static propTypes = {
    data: PropTypes.array,
    onSelectCardValue: PropTypes.func,
    cardValueType: PropTypes.string
  };

  static defaultProps = {
    data: [],
    onSelectCardValue: () => {},
    cardValueType: ''
  };

  renderCardValues() {
    return (
      <FlatList
        numColumns={3}
        data={this.props.data}
        extraData={this.props.cardValueType}
        renderItem={this.renderCardValueItem}
        keyExtractor={item => item.type}
      />
    );
  }

  renderCardValueItem = ({ item: cardValue }) => {
    const isActive = this.props.cardValueType === cardValue.type;
    return (
      <Button
        onPress={() => this.props.onSelectCardValue(cardValue)}
        containerStyle={[
          styles.cardValueBtn,
          isActive && styles.cardValueBtnActive
        ]}
      >
        <View style={styles.btnContent}>
          <View style={styles.valueWrapper}>
            <Text style={[styles.value, isActive && styles.valueActive]}>
              {cardValue.label}
            </Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>
              {cardValue.cashbackLabel}
              {cardValue.cashbackValue && (
                <Text style={styles.cashback}>{cardValue.cashbackValue}</Text>
              )}
            </Text>
          </View>
        </View>
      </Button>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Mệnh giá nạp</Text>

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
  label: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18
  },
  cardValueBtn: {
    width: config.device.width / 3 - 16,
    flexDirection: 'column',
    height: 71,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    marginTop: 16
  },
  cardValueBtnActive: {
    borderColor: config.colors.primary
  },
  btnContent: {
    flex: 1
  },
  valueWrapper: {
    flex: 1,
    justifyContent: 'center'
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
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    marginHorizontal: 6,
    paddingVertical: 3
  },
  description: {
    fontSize: 10,
    fontWeight: '400',
    color: '#333'
  },
  cashback: {
    fontWeight: '600',
    color: '#188aeb'
  }
});

export default SelectCardValue;
