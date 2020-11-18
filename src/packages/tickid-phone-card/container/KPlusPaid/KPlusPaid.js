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

class KPlusPaid extends Component {
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
    placeholder: PropTypes.string,
    errorEmptyMessage: PropTypes.string,
    errorLengthMessage: PropTypes.string,
    validLength: PropTypes.number,
    keyboardType: PropTypes.string
  };

  static defaultProps = {
    refreshing: false,
    services: {},
    listServices: [],
    networksOfService: {},
    cardsOfNetwork: {},
    prefix: 'trước',
    onRefresh: () => {},
    placeholder: '',
    hideContact: false,
    validLength: 0,
    errorLengthMessage: '',
    errorEmptyMessage: '',
    keyboardType: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      cardValueType: '',
      contactName: config.defaultContactName,
      cardNumber: config.defaultcardNumber,
      networkType: this.currentNetworks[0].type,
      options: [],
      subCardValue: '',
      currentCards: [],
      kPlusData: [],
      totalPrice: ''
    };
    this.eventTracker = new EventTracker();
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

  get selectedCard() {
    if (!this.state.cardValueType) return {};
    return this.state.currentCards.find(
      card => card.type === this.state.cardValueType
    );
  }

  get cardNumber() {
    const cardNumber = replaceAll(`${this.state.cardNumber}`, ' ', '');
    return cardNumber || '';
  }

  get networksOfService() {
    let networksOfService = [];
    Object.keys(this.props.networksOfService).forEach(serviceKey => {
      this.props.networksOfService[serviceKey].forEach(s => {
        if (s.type_view === 'kplus_paid') {
          networksOfService = this.props.networksOfService[serviceKey];
        }
      });
    });

    return networksOfService;
  }

  get kPlusData() {
    const networksOfService = this.networksOfService;
    if (networksOfService.length !== 0) {
      return networksOfService[0].kPlus;
    } else {
      return [];
    }
  }

  get options() {
    const networksOfService = this.networksOfService;
    if (networksOfService.length !== 0) {
      return networksOfService[0].optionsData;
    } else {
      return [];
    }
  }

  componentDidMount() {
    const kPlusData = this.kPlusData;
    const currentCards = kPlusData[0].data.discounts;
    const options = this.options;
    // console.log(options, currentCards, kPlusData)
    this.setState({
      cardValueType: currentCards[0].type,
      currentCards: currentCards,
      kPlusData,
      options,
      subCardValue: options[0].type,
      totalPrice: currentCards[0].total_price
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
    this.setState({
      contactName: contact.name,
      cardNumber: contact.displayPhone
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
        const alsoHasType = this.state.currentCards.some(
          card => card.type === this.state.cardValueType
        );
        // if not exist card type, reset default card type to first
        if (!alsoHasType) {
          this.setState({
            cardValueType: this.state.currentCards[0].type
          });
        }
      }
    );
  };

  handleSelectCardValue = cardValue => {
    this.setState({
      cardValueType: cardValue.type,
      totalPrice: cardValue.total_price
    });
  };

  handleSelectSubCardValue = subCardValue => {
    if (subCardValue.type !== this.state.subCardValue) {
      const currentCards = this.state.kPlusData[subCardValue.label].data
        .discounts;

      this.setState(
        {
          subCardValue: subCardValue.type,
          currentCards
        },
        () => {
          this.setState({
            totalPrice: this.selectedCard.total_price
          });
        }
      );
    }
  };

  handleValidate = () => {
    if (!this.state.cardNumber) {
      this.setState({
        errorMessage: this.props.errorEmptyMessage
      });
      return false;
    } else if (this.state.cardNumber.length < this.props.validLength) {
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
      const selectedCard = this.selectedCard;
      const option = Object.keys(
        this.state.options.find(
          option => option.type === this.state.subCardValue
        )
      )[0];

      config.route.push(config.routes.buyCardConfirm, {
        type: this.currentService.name,
        card: selectedCard,
        wallet: this.props.wallet,
        hasPass: this.props.hasPass,
        network: this.selectedNetwork,
        serviceId: this.currentService.id,
        historyTitle: this.currentService.history_title,
        subCard: this.state.subCardValue,
        cardNumber: this.cardNumber,
        times: selectedCard.times,
        option
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
      cardNumber: text,
      contactName: '',
      errorMessage: ''
    });
  };

  handleInputPhoneBlur = () => {
    this.handleValidate();
  };

  render() {
    return (
      <View style={styles.sceneContainer}>
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
            hideContact={this.props.hideContact}
            placeholder={this.props.placeholder}
            data={this.currentNetworks}
            errorMessage={this.state.errorMessage}
            contactName={this.state.contactName}
            contactPhone={this.state.cardNumber}
            onBlur={this.handleInputPhoneBlur}
            onChangeText={this.handleChangePhoneNumber}
            onShowHistory={this.handleShowHistory}
            onPressSelectNetwork={this.handlePressSelectNetwork}
            networkType={this.state.networkType}
            keyboardType={this.props.keyboardType}
          />

          <SelectCardValueComponent
            title="Số tháng"
            data={this.state.currentCards}
            cardValueType={this.state.cardValueType}
            onSelectCardValue={this.handleSelectCardValue}
          />

          <SelectCardValueComponent
            title="Số thẻ phụ"
            data={this.state.options}
            cardValueBtnStyle={{ height: 40 }}
            cardValueType={this.state.subCardValue}
            onSelectCardValue={this.handleSelectSubCardValue}
          />

          <View
            style={[styles.container, { flexDirection: 'row', marginTop: 10 }]}
          >
            <Text style={[styles.label, { marginRight: 15 }]}>Tổng:</Text>
            <Text style={styles.label}>{this.state.totalPrice}</Text>
          </View>

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
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16
  },
  label: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18
  },
  sceneContainer: {
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

export default KPlusPaid;
