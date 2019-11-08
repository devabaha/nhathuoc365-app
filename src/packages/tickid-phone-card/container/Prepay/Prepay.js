import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { View, ScrollView, StyleSheet } from 'react-native';
import EnterPhoneComponent from '../../component/EnterPhone';
import ChangeNetworkModal from '../../component/ChangeNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SubmitButton from '../../component/SubmitButton';

class Prepay extends Component {
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

  handlePressSelectNetwork = () => {
    this.setState({
      visibleNetwork: true
    });
  };

  handleNetworkChange = network => {
    this.setState(
      {
        networkType: network.type,
        visibleNetwork: false
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

  handleSelectCardValue = cardValue => {
    this.setState({
      cardValueType: cardValue.type
    });
  };

  handleContinue = () => {
    config.route.push(config.routes.buyCardConfirm);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <EnterPhoneComponent
            data={this.currentNetworks}
            contactName={this.state.contactName}
            contactPhone={this.state.contactPhone}
            onOpenContact={this.handleOpenContact}
            networkType={this.state.networkType}
            onPressSelectNetwork={this.handlePressSelectNetwork}
          />

          <SelectCardValueComponent
            data={this.currentCards}
            cardValueType={this.state.cardValueType}
            onSelectCardValue={this.handleSelectCardValue}
          />

          <ChangeNetworkModal
            data={this.currentNetworks}
            networkType={this.state.networkType}
            visible={this.state.visibleNetwork}
            onNetworkChange={this.handleNetworkChange}
            onClose={() => this.setState({ visibleNetwork: false })}
          />

          <View style={styles.bottomSpace} />
        </ScrollView>

        <SubmitButton onPress={this.handleContinue} title="Nạp ngay" />
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

export default Prepay;
