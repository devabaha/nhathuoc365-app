import React, { Component } from 'react';
import config from '../../config';
import { VIETTEL_TYPE, CARD_10K } from '../../constants';
import { View, ScrollView, StyleSheet } from 'react-native';
import EnterPhoneComponent from '../../component/EnterPhone';
import ChangeNetworkModal from '../../component/ChangeNetwork';
import SelectCardValueComponent from '../../component/SelectCardValue';
import SubmitButton from '../../component/SubmitButton';

class Prepay extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  handleNetworkChange = network => {
    this.setState({
      networkType: network.type,
      visibleNetwork: false
    });
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
            contactName={this.state.contactName}
            contactPhone={this.state.contactPhone}
            onOpenContact={this.handleOpenContact}
            networkType={this.state.networkType}
            onPressSelectNetwork={this.handlePressSelectNetwork}
          />

          <SelectCardValueComponent
            cardValueType={this.state.cardValueType}
            onSelectCardValue={this.handleSelectCardValue}
          />

          <ChangeNetworkModal
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
