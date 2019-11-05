import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import config from '../../config';

class NetworkProvider extends Component {
  static propTypes = {
    data: PropTypes.array,
    onSelectNetwork: PropTypes.func,
    networkType: PropTypes.string
  };

  static defaultProps = {
    data: [],
    onSelectNetwork: () => {},
    networkType: ''
  };

  renderNetworks() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        extraData={this.props.networkType}
        renderItem={this.renderNetworkItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderNetworkItem = ({ item: network, index }) => {
    const isActive = this.props.networkType === network.type;
    const last = index === this.props.data.length - 1;
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
        <Image style={styles.networkImage} source={network.localImage} />
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
