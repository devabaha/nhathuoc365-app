import React, { Component } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import Loading from '@tickid/tickid-rn-loading';
import PropTypes from 'prop-types';
import { CardWallet } from './';
import appConfig from 'app-config';

class Search extends Component {
  state = {};

  handlePressCard = () => {};

  renderCard = ({ item: card, index }) => {
    return (
      <CardWallet
        style={styles.cardContainer}
        logoImage={card.logo_url}
        image={card.image_url}
        title={card.title}
        onPress={this.handlePressCard}
        last={index === this.props.data.length - 1}
      />
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={appConfig.device.isIOS ? 'padding' : null}
      >
        {this.props.loading && <Loading loading />}
        <FlatList
          keyboardDismissMode="on-drag"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={this.props.data}
          renderItem={this.renderCard}
          keyExtractor={item => item.id}
        />
      </KeyboardAvoidingView>
    );
  }
}

Search.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
};

Search.defaultProps = {
  data: [],
  loading: false
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContainer: {
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15
  }
});

export default Search;
