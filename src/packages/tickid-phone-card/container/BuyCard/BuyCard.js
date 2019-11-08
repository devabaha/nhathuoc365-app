import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { View, ScrollView, StyleSheet } from 'react-native';
import SelectNetworkComponent from '../../component/SelectNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SelectCardHistoryComponent from '../../component/SelectCardHistory';
import ChooseQuantityComponent from '../../component/ChooseQuantity';
import SubmitButton from '../../component/SubmitButton';

class BuyCard extends Component {
  static propTypes = {
    routeKey: PropTypes.string.isRequired,
    services: PropTypes.object,
    listServices: PropTypes.array,
    networksOfService: PropTypes.object,
    cardsOfNetwork: PropTypes.object
  };

  static defaultProps = {
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      cardQuantity: 1,
      cardValueType: '',
      contactName: 'Đặng Ngọc Sơn',
      contactPhone: '035 353 8222',
      networkType: this.currentNetworks[0].type
    };
  }

  get currentService() {
    const { services, routeKey } = this.props;
    return services[routeKey];
  }

  get currentNetworks() {
    return this.props.networksOfService[this.currentService.id];
  }

  get currentCards() {
    return this.props.cardsOfNetwork[this.state.networkType];
  }

  componentDidMount() {
    this.setState({
      cardValueType: this.currentCards[0].type
    });
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

  handleSelectCardValue = cardValue => {
    this.setState({
      cardValueType: cardValue.type
    });
  };

  handleSelectNetwork = network => {
    this.setState(
      {
        networkType: network.type
      },
      () => {
        const alsoHasType = this.currentCards.some(
          card => card.type === this.state.cardValueType
        );
        // if not exist card type, reset default card type to first
        if (!alsoHasType) {
          this.setState({
            cardValueType: this.currentCards[0].type
          });
        }
      }
    );
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
            data={this.currentNetworks}
            networkType={this.state.networkType}
            onSelectNetwork={this.handleSelectNetwork}
          />

          <SelectCardValueComponent
            data={this.currentCards}
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
