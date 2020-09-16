import React, { Component } from 'react';
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import CardWallet from './CardWallet';
import appConfig from 'app-config';

class Search extends Component {
  static defaultProps = {
    onPressData: () => {},
    compareData: [],
    data: []
  };
  state = {};

  handlePressCard = card => {
    this.props.onPressData(card);
  };

  renderCard = ({ item: card, index }) => {
    const isExisted = this.props.compareData.find(item => item.id === card.id);
    const extraStyle = {
      backgroundColor: !isExisted ? appConfig.colors.primary : '#bababa'
    };

    return (
      <CardWallet
        rightTitleComponent={
          <View style={[styles.funcBtn, extraStyle]}>
            {isExisted ? (
              <>
                <Icon name="check" color="#fff" size={18} />
                <Text style={styles.funcText}>Đã thêm</Text>
              </>
            ) : (
              <>
                <Icon name="plus" color="#fff" size={18} />
                <Text style={styles.funcText}>Thêm Cửa hàng</Text>
              </>
            )}
          </View>
        }
        disabled={isExisted}
        style={[styles.cardContainer, styles.shadow]}
        logoImage={card.logo_url}
        image={card.image_url}
        title={card.title}
        onPress={() => this.handlePressCard(card)}
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
        <FlatList
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={this.props.data}
          renderItem={this.renderCard}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.props.listEmptyComponent}
          ListHeaderComponent={this.props.listHeaderComponent}
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
    marginBottom: 15
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 5
  },
  funcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 4
  },
  funcText: {
    color: '#fff',
    paddingHorizontal: 5,
    fontWeight: '400'
  }
});

export default Search;
