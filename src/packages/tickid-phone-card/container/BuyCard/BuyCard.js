import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { internalFetch } from '../../helper/apiFetch';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl
} from 'react-native';
import SelectNetworkComponent from '../../component/SelectNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SelectCardHistoryComponent from '../../component/SelectCardHistory';
// import ChooseQuantityComponent from '../../component/ChooseQuantity';
import SubmitButton from '../../component/SubmitButton';

class BuyCard extends Component {
  static propTypes = {
    refreshing: PropTypes.bool,
    routeKey: PropTypes.string.isRequired,
    services: PropTypes.object,
    listServices: PropTypes.array,
    networksOfService: PropTypes.object,
    cardsOfNetwork: PropTypes.object,
    onRefresh: PropTypes.func
  };

  static defaultProps = {
    refreshing: false,
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {},
    onRefresh: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      cardQuantity: 1,
      cardValueType: '',
      networkType: this.currentNetworks[0].type,
      orders: []
    };
  }

  get hasOrders() {
    return Array.isArray(this.state.orders) && this.state.orders.length > 0;
  }

  get currentService() {
    const { services, routeKey } = this.props;
    return services[routeKey];
  }

  get currentNetworks() {
    return this.props.networksOfService[this.currentService.id];
  }

  get selectedNetwork() {
    return this.currentNetworks.find(
      network => network.type === this.state.networkType
    );
  }

  get currentCards() {
    return this.props.cardsOfNetwork[this.state.networkType];
  }

  get selectedCard() {
    if (!this.state.cardValueType) return {};
    return this.currentCards.find(
      card => card.type === this.state.cardValueType
    );
  }

  componentDidMount() {
    this.setState({
      cardValueType: this.currentCards[0].type
    });

    this.getOrders(this.currentService.id);
  }

  getOrders = serviceId => {
    internalFetch(config.rest.orders(serviceId)).then(response => {
      this.setState({
        orders: response.data
      });
    });
  };

  getNetworkByType(type) {
    return this.currentNetworks.find(network => network.type === type);
  }

  getCardByTypeAndPrice(type, price) {
    const cardsOfType = this.props.cardsOfNetwork[type];
    return cardsOfType.find(card => card.price === price);
  }

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
    config.route.push(config.routes.cardHistory, {
      title: this.currentService.history_title,
      serviceId: this.currentService.id
    });
  };

  handleContinue = () => {
    config.route.push(config.routes.buyCardConfirm, {
      type: 'Mua mã thẻ',
      isBuyCard: true,
      quantity: this.state.cardQuantity,
      card: this.selectedCard,
      wallet: this.props.wallet,
      hasPass: this.props.hasPass,
      network: this.selectedNetwork,
      serviceId: this.currentService.id,
      historyTitle: this.currentService.history_title
    });
  };

  handleSelectCardHistory = card => {
    config.route.push(config.routes.buyCardConfirm, {
      type: 'Mua mã thẻ',
      isBuyCard: true,
      quantity: this.state.cardQuantity,
      card: this.getCardByTypeAndPrice(card.type, card.price),
      wallet: this.props.wallet,
      hasPass: this.props.hasPass,
      network: this.getNetworkByType(card.type),
      serviceId: this.currentService.id,
      historyTitle: this.currentService.history_title
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }
        >
          {this.hasOrders && (
            <SelectCardHistoryComponent
              heading="Mua thẻ nhanh"
              data={this.state.orders}
              onShowHistory={this.handleShowHistory}
              onSelectCardHistory={this.handleSelectCardHistory}
            />
          )}

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

          {/* <ChooseQuantityComponent
            initQuantity={this.state.cardQuantity}
            onChangeQuantity={this.handleChangeQuantity}
          /> */}

          {!!this.currentService.content && (
            <Text style={styles.content}>{this.currentService.content}</Text>
          )}

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
  },
  content: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
    marginLeft: 16,
    marginTop: 24
  }
});

export default BuyCard;
