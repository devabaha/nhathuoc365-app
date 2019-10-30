import React, { Component } from 'react';
import config from '../../config';
import { VIETTEL_TYPE } from '../../constants';
import { View, ScrollView, StyleSheet } from 'react-native';
import EnterPhoneComponent from '../../component/EnterPhone';
import SubmitButton from '../../component/SubmitButton';

class Postpaid extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
            hideChangeNetwork
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

export default Postpaid;
