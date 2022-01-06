import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import config from '../../config';
// network
import {internalFetch} from '../../helper/apiFetch';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import EventTracker from '../../../../helper/EventTracker';
// custom components
import SelectNetworkComponent from '../../component/SelectNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SelectCardHistoryComponent from '../../component/SelectCardHistory';
import ChooseQuantityComponent from '../../component/ChooseQuantity';
import SubmitButton from '../../component/SubmitButton';
import {
  Container,
  ScrollView,
  RefreshControl,
  Typography,
} from 'src/components/base';

class BuyCard extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    refreshing: PropTypes.bool,
    routeKey: PropTypes.string.isRequired,
    services: PropTypes.object,
    listServices: PropTypes.array,
    networksOfService: PropTypes.object,
    cardsOfNetwork: PropTypes.object,
    onRefresh: PropTypes.func,
  };

  static defaultProps = {
    refreshing: false,
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {},
    onRefresh: () => {},
  };

  state = {
    cardQuantity: 1,
    cardValueType: '',
    networkType: this.currentNetworks[0].type,
    orders: [],
  };
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  get hasOrders() {
    return Array.isArray(this.state.orders) && this.state.orders.length > 0;
  }

  get currentService() {
    const {services, routeKey} = this.props;
    return services[routeKey];
  }

  get currentNetworks() {
    return this.props.networksOfService[this.currentService.id];
  }

  get selectedNetwork() {
    return this.currentNetworks.find(
      (network) => network.type === this.state.networkType,
    );
  }

  get currentCards() {
    return this.props.cardsOfNetwork[this.state.networkType];
  }

  get selectedCard() {
    if (!this.state.cardValueType) return {};
    return this.currentCards.find(
      (card) => card.type === this.state.cardValueType,
    );
  }

  componentDidMount() {
    this.setState({
      cardValueType: this.currentCards[0].type,
    });

    this.getOrders(this.currentService.id);
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  getOrders = (serviceId) => {
    internalFetch(config.rest.orders(serviceId)).then((response) => {
      this.setState({
        orders: response.data,
      });
    });
  };

  getNetworkByType(type) {
    return this.currentNetworks.find((network) => network.type === type);
  }

  getCardByTypeAndPrice(type, price) {
    const cardsOfType = this.props.cardsOfNetwork[type];
    return cardsOfType.find((card) => card.price === price);
  }

  handleSelectCardValue = (cardValue) => {
    this.setState({
      cardValueType: cardValue.type,
    });
  };

  handleSelectNetwork = (network) => {
    this.setState(
      {
        networkType: network.type,
      },
      () => {
        const alsoHasType = this.currentCards.some(
          (card) => card.type === this.state.cardValueType,
        );
        // if not exist card type, reset default card type to first
        if (!alsoHasType) {
          this.setState({
            cardValueType: this.currentCards[0].type,
          });
        }
      },
    );
  };

  handleChangeQuantity = (quantity) => {
    this.setState({
      cardQuantity: quantity,
    });
  };

  handleShowHistory = () => {
    config.route.push(
      config.routes.cardHistory,
      {
        title: this.currentService.history_title,
        serviceId: this.currentService.id,
      },
      this.theme,
    );
  };

  handleContinue = () => {
    config.route.push(
      config.routes.buyCardConfirm,
      {
        type: this.props.t('buyCardCode'),
        isBuyCard: true,
        quantity: this.state.cardQuantity,
        card: this.selectedCard,
        wallet: this.props.wallet,
        hasPass: this.props.hasPass,
        network: this.selectedNetwork,
        serviceId: this.currentService.id,
        historyTitle: this.currentService.history_title,
      },
      this.theme,
    );
  };

  handleSelectCardHistory = (card) => {
    config.route.push(
      config.routes.buyCardConfirm,
      {
        type: this.props.t('buyCardCode'),
        isBuyCard: true,
        quantity: this.state.cardQuantity,
        card: this.getCardByTypeAndPrice(card.type, card.price),
        wallet: this.props.wallet,
        hasPass: this.props.hasPass,
        network: this.getNetworkByType(card.type),
        serviceId: this.currentService.id,
        historyTitle: this.currentService.history_title,
      },
      this.theme,
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }>
          {this.hasOrders && (
            <SelectCardHistoryComponent
              heading={this.props.t('quickBuy')}
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
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={styles.content}>
              {this.currentService.content}
            </Typography>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>

        <SubmitButton
          safeLayout
          onPress={this.handleContinue}
          title={this.props.t('common:continue')}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSpace: {
    marginBottom: 16,
  },
  content: {
    marginLeft: 16,
    marginTop: 24,
  },
});

export default withTranslation(['phoneCard', 'common'])(BuyCard);
