import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Platform,
  RefreshControl
} from 'react-native';
import EnterPhoneComponent from '../../component/EnterPhone';
import ChangeNetworkModal from '../../component/ChangeNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SubmitButton from '../../component/SubmitButton';
import replaceAll from '../../helper/replaceAll';

class Prepay extends Component {
  static propTypes = {
    refreshing: PropTypes.bool,
    routeKey: PropTypes.string.isRequired,
    services: PropTypes.object,
    listServices: PropTypes.array,
    networksOfService: PropTypes.object,
    cardsOfNetwork: PropTypes.object,
    prefix: PropTypes.oneOf(['trước', 'sau']),
    onRefresh: PropTypes.func
  };

  static defaultProps = {
    refreshing: false,
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {},
    prefix: 'trước',
    onRefresh: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      cardValueType: '',
      contactName: config.defaultContactName,
      contactPhone: config.defaultContactPhone,
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

  get contactPhone() {
    const contactPhone = replaceAll(`${this.state.contactPhone}`, ' ', '');
    return contactPhone || '';
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

  handleValidate = () => {
    if (!this.contactPhone) {
      this.setState({
        errorMessage: 'Vui lòng nhập số điện thoại'
      });
      return false;
    } else if (this.contactPhone.length < 10) {
      this.setState({
        errorMessage: 'Số điện thoại không hợp lệ'
      });
      return false;
    } else {
      this.setState({
        errorMessage: ''
      });
      return true;
    }
  };

  handleContinue = () => {
    const isValid = this.handleValidate();
    if (isValid) {
      config.route.push(config.routes.buyCardConfirm, {
        type: this.currentService.name,
        card: this.selectedCard,
        wallet: this.props.wallet,
        hasPass: this.props.hasPass,
        network: this.selectedNetwork,
        serviceId: this.currentService.id,
        historyTitle: this.currentService.history_title,
        contactName: this.state.contactName,
        contactPhone: this.contactPhone
      });
    }
  };

  handleShowHistory = () => {
    config.route.push(config.routes.cardHistory, {
      title: this.currentService.history_title,
      serviceId: this.currentService.id
    });
  };

  handleChangePhoneNumber = text => {
    this.setState({
      contactPhone: text,
      contactName: '',
      errorMessage: ''
    });
  };

  handleInputPhoneBlur = () => {
    this.handleValidate();
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
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'on-drag' : 'interactive'
          }
        >
          <EnterPhoneComponent
            editable
            data={this.currentNetworks}
            errorMessage={this.state.errorMessage}
            contactName={this.state.contactName}
            contactPhone={this.state.contactPhone}
            onBlur={this.handleInputPhoneBlur}
            onChangeText={this.handleChangePhoneNumber}
            onOpenContact={this.handleOpenContact}
            onShowHistory={this.handleShowHistory}
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

          {!!this.currentService.content && (
            <Text style={styles.content}>{this.currentService.content}</Text>
          )}

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
  },
  content: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
    marginLeft: 16,
    marginTop: 24
  }
});

export default Prepay;
