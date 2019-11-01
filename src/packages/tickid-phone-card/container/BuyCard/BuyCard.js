import React, { Component } from 'react';
import config from '../../config';
import { VIETTEL_TYPE, CARD_10K } from '../../constants';
import { View, ScrollView, StyleSheet } from 'react-native';
import SelectNetworkComponent from '../../component/SelectNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SelectCardHistoryComponent from '../../component/SelectCardHistory';
import ChooseQuantityComponent from '../../component/ChooseQuantity';
import SubmitButton from '../../component/SubmitButton';

class BuyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardQuantity: 1,
      cardValueType: CARD_10K,
      contactName: 'Đặng Ngọc Sơn',
      contactPhone: '035 353 8222',
      visibleNetwork: false,
      networkType: VIETTEL_TYPE
    };
  }

  handleOpenContact = () => {
    config.route.push(config.routes.contact, {
      onPressContact: this.handlePressContact
    });
  };

  handlePressContact = contact => {
    config.route.pop();
    this.setState({
      contactName: contact.name,
      contactPhone: contact.displayPhone
    });
  };

  handlePressSelectNetwork = () => {
    this.setState({
      visibleNetwork: true
    });
  };

  handleSelectCardValue = cardValue => {
    this.setState({
      cardValueType: cardValue.type
    });
  };

  handleSelectNetwork = network => {
    this.setState({
      networkType: network.type
    });
  };

  handleChangeQuantity = quantity => {
    this.setState({
      cardQuantity: quantity
    });
  };

  handleShowHistory = () => {
    config.route.push(config.routes.cardHistory);
  };

  handleContinue = () => {
    config.route.push(config.routes.buyCardConfirm);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <SelectCardHistoryComponent
            data={[
              {
                name: 'Viettel',
                type: 'viettel',
                buyTime: '29/09/2019 - 11:54',
                price: '100.000đ'
              },
              {
                name: 'Viettel',
                type: 'viettel',
                buyTime: '29/09/2019 - 11:54',
                price: '200.000đ'
              }
            ]}
            onShowHistory={this.handleShowHistory}
            onSelectCardHistory={card => alert(card.name)}
          />

          <SelectNetworkComponent
            networkType={this.state.networkType}
            onSelectNetwork={this.handleSelectNetwork}
          />

          <SelectCardValueComponent
            cardValueType={this.state.cardValueType}
            onSelectCardValue={this.handleSelectCardValue}
          />

          <ChooseQuantityComponent
            initQuantity={this.state.cardQuantity}
            onChangeQuantity={this.handleChangeQuantity}
          />

          <View style={styles.bottomSpace} />
        </ScrollView>

        <SubmitButton onPress={this.handleContinue} title="Tiếp tục" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomSpace: {
    marginBottom: 16
  }
});

export default BuyCard;
