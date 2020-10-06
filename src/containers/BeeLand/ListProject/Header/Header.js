import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import { HeaderBeeLand } from '../../components';

const styles = StyleSheet.create({
  background: {
    height: '50%',
    width: '100%',
    position: 'absolute',
    backgroundColor: appConfig.colors.primary
  },
  headerContainer: {
    margin: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5)
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 30,
    color: appConfig.colors.primary
  },
  title: {
    marginTop: 5
  }
});

const HEADER_LIST = [
  {
    id: 1,
    title: 'CRM',
    iconName: 'chart-areaspline'
  },
  {
    id: 2,
    title: 'Giao dịch',
    iconName: 'bank-transfer'
  }
];

class Header extends Component {
  state = {};

  handleHeaderPress(header) {
    switch (header.id) {
      case 1: // CRM
        Actions.push(appConfig.routes.customerSearchingBeeLand);
        break;
      case 2: // Giao dịch
        Actions.push(appConfig.routes.orderManagementBeeLand);
        break;
    }
  }

  renderPrimaryActions() {
    return HEADER_LIST.map((header, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => this.handleHeaderPress(header)}
        >
          <Icon style={styles.icon} name={header.iconName} />
          <Text style={styles.title}>{header.title}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <HeaderBeeLand>
        <View style={styles.headerContainer}>
          {this.renderPrimaryActions()}
        </View>
      </HeaderBeeLand>
    );
  }
}

export default Header;
