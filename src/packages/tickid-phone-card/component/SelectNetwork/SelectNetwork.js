import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import config from '../../config';
import { NETWORKS, VIETTEL_TYPE } from '../../constants';

class NetworkProvider extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onSelectNetwork: PropTypes.func,
    networkType: PropTypes.oneOf(
      Object.values(NETWORKS).map(network => network.type)
    )
  };

  static defaultProps = {
    visible: false,
    onSelectNetwork: () => {},
    networkType: VIETTEL_TYPE
  };

  get currentNetworkType() {
    return NETWORKS[this.props.networkType];
  }

  renderNetworks() {
    return (
      <FlatList
        horizontal
        data={Object.values(NETWORKS)}
        renderItem={this.renderNetworkItem}
        keyExtractor={item => item.type}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderNetworkItem = ({ item: network, index }) => {
    const isActive = this.currentNetworkType.type === network.type;
    const last = index === Object.keys(NETWORKS).length - 1;
    return (
      <Button
        onPress={() => this.props.onSelectNetwork(network)}
        containerStyle={[
          styles.networkBtn,
          isActive && styles.networkBtnActive,
          {
            marginRight: last ? 0 : 16
          }
        ]}
      >
        <Image style={styles.networkImage} source={network.image} />
      </Button>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Chọn nhà mạng</Text>

        {this.renderNetworks()}
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
    fontSize: 18,
    marginBottom: 16
  },
  networkBtn: {
    borderWidth: 2,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    overflow: 'hidden'
  },
  networkBtnActive: {
    borderColor: config.colors.primary
  },
  networkImage: {
    width: 71,
    height: 71
  }
});

export default NetworkProvider;
