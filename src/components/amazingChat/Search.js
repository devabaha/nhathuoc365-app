import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import NoResult from '../NoResult';
import { Actions } from 'react-native-router-flux';
import { debounce } from 'lodash';
import store from '../../store';
import ChatRow from './ChatRow';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

class Search extends Component {
  state = {
    customers: [],
    searchValue: '',
    loading: undefined,
    searchValue: ''
  };
  unmounted = false;

  componentDidMount() {
    this.handleChangeSearch('');
    setTimeout(() =>
      Actions.refresh({
        onChangeSearch: this.handleChangeSearch.bind(this)
      })
    );
  }

  componentWillUnmount() {
    this.setState({ loading: false });
    this.unmounted = true;
  }

  searchCustomer = debounce(async search => {
    const { store_id } = store;
    if (!this.unmounted) {
      this.setState({ loading: true });
    }
    try {
      var response = await APIHandler.site_search_conversations(store_id, {
        search
      });
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS && response.data) {
          this.setState({ customers: response.data });
        } else {
          this.setState({ customers: [] });
        }
      }
    } catch (e) {
      console.warn(e + ' site_search_conversations');
      store.addApiQueue('site_search_conversations', this.searchCustomer);
    } finally {
      if (!this.unmounted) {
        this.setState({ loading: false, isTyping: false });
      }
    }
  }, 500);

  handleChangeSearch(searchValue) {
    this.setState({ searchValue, isTyping: true });
    this.searchCustomer(searchValue);
  }

  onPressCustomer(item) {
    Actions.amazing_chat({
      site_id: store.store_id,
      user_id: item.id,
      hiddenChatIcon: true,
      phoneNumber: item.tel,
      title: item.name
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && (
          <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <Indicator fullScreen />
          </View>
        )}

        <FlatList
          data={this.state.customers}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onTouchMove={Keyboard.dismiss}
          renderItem={({ item, index }) => (
            <ChatRow
              title={item.name}
              img={item.avatar}
              subTitle={item.tel}
              onPress={() => this.onPressCustomer(item)}
              isSeparate={
                this.state.customers.length < 10 ||
                index !== this.state.customers.length - 1
              }
            />
          )}
          ListEmptyComponent={
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={Keyboard.dismiss}
            >
              <View style={{ flex: 1, width: WIDTH, height: HEIGHT }}>
                {!this.state.searchValue ? (
                  <NoResult
                    iconName="file-search"
                    message="Nhập để tìm kiếm..."
                  />
                ) : (
                  !this.state.isTyping && (
                    <NoResult
                      iconName="magnify-close"
                      message="Không tìm thấy dữ liệu"
                    />
                  )
                )}
              </View>
            </TouchableWithoutFeedback>
          }
          keyExtractor={(item, index) => String(item.id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  }
});

export default Search;
