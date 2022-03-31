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
import EventTracker from '../../../../helper/EventTracker';

class Prepay extends Component {
  static propTypes = {
    refreshing: PropTypes.bool,
    routeKey: PropTypes.string.isRequired,
    services: PropTypes.object,
    listServices: PropTypes.array,
    networksOfService: PropTypes.object,
    cardsOfNetwork: PropTypes.object,
    prefix: PropTypes.oneOf(['trước', 'sau']),
    onRefresh: PropTypes.func,
    hideContact: PropTypes.bool,
    errorEmptyMessage: PropTypes.string,
    errorLengthMessage: PropTypes.string,
    validLength: PropTypes.number,
    keyboardType: PropTypes.string
  };

  static defaultProps = {
    refreshing: false,
    hideContact: false,
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {},
    prefix: 'trước',
    onRefresh: () => {},
    errorEmptyMessage: 'Vui lòng nhập số điện thoại',
    errorLengthMessage: 'Số điện thoại không hợp lệ',
    validLength: 10,
    keyboardType: undefined
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
    this.eventTracker = new EventTracker();
  }

  get prefixNetWorksPhoneNumber() {
    const currentNetworks = this.currentNetworks;

    return currentNetworks.map(network => ({
      type: network.type,
      prefix: network.prefix
    }));
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
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleOpenContact = () => {
    config.route.push(config.routes.contact, {
      onPressContact: this.handlePressContact
    });
  };

  handlePressContact = contact => {
    config.route.pop();
    this.handleChangePhoneNumber(contact);
    this.setState({
      contactName: contact.name
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
        errorMessage: this.props.errorEmptyMessage
      });
      return false;
    } else if (this.contactPhone.length < this.props.validLength) {
      this.setState({
        errorMessage: this.props.errorLengthMessage
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

  handleChangePhoneNumber = phone => {
    let contactPhone = phone,
      contactName = '';

    if (typeof phone === 'object') {
      contactPhone = phone.displayPhone;
      contactName = phone.name;
    }

    this.updateNetworkByPrefixPhoneNumber(contactPhone);

    this.setState({
      contactPhone,
      contactName,
      errorMessage: ''
    });
  };

  updateNetworkByPrefixPhoneNumber = phoneNumber => {
    if (phoneNumber.length >= 4) {
      const inputPrefix = phoneNumber.slice(0, 3);
      const prefixNetWorks = this.prefixNetWorksPhoneNumber;
      const network = prefixNetWorks.find(prefixNetWork =>
        prefixNetWork.prefix.includes(inputPrefix)
      );
      if (network) {
        this.handleNetworkChange(network);
      }
    }
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
          keyboardShouldPersistTaps="handled"
        >
          <EnterPhoneComponent
            editable
            data={this.currentNetworks}
            placeholder={this.props.placeholder}
            errorMessage={this.state.errorMessage}
            contactName={this.state.contactName}
            contactPhone={this.state.contactPhone}
            onBlur={this.handleInputPhoneBlur}
            onChangeText={this.handleChangePhoneNumber}
            onOpenContact={this.handleOpenContact}
            onShowHistory={this.handleShowHistory}
            networkType={this.state.networkType}
            onPressSelectNetwork={this.handlePressSelectNetwork}
            hideContact={this.props.hideContact}
            keyboardType={this.props.keyboardType}
          />

          {!!this.currentService.note && (
            <Text style={styles.note}>{this.currentService.note}</Text>
          )}

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
  },
  note: {
    padding: 15
  }
});

export default Prepay;
