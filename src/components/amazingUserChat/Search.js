import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
// 3-party libs
import {debounce} from 'lodash';
import {withTranslation} from 'react-i18next';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {servicesHandler} from 'app-helper/servicesHandler';
// routing
import {refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
// custom components
import NoResult from '../NoResult';
import ChatRow from './ChatRow';
import {ScreenWrapper, FlatList} from 'src/components/base';
import Indicator from '../Indicator';

class Search extends Component {
  static contextType = ThemeContext;

  state = {
    customers: [],
    searchValue: '',
    loading: undefined,
    searchValue: '',
  };
  unmounted = false;
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.handleChangeSearch('');
    setTimeout(() =>
      refresh({
        onChangeSearch: this.handleChangeSearch.bind(this),
      }),
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.setState({loading: false});
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  searchCustomer = debounce(async (search = '') => {
    if (!this.unmounted) {
      this.setState({loading: true});
    }
    try {
      var response = await APIHandler.site_search_conversations(0, {
        search,
      });
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS && response.data) {
          this.setState({customers: response.data});
        } else {
          this.setState({customers: []});
        }
      }
    } catch (e) {
      console.log(e + ' site_search_conversations');
    } finally {
      if (!this.unmounted) {
        this.setState({loading: false, isTyping: false});
      }
    }
  }, 500);

  handleChangeSearch(searchValue) {
    this.setState({searchValue, isTyping: true});
    this.searchCustomer(searchValue);
  }

  onPressCustomer(item) {
    servicesHandler({
      type: SERVICES_TYPE.USER_CHAT,
      theme: this.theme,
      site_id: item.site_id,
      user_id: item.user_id,
      phoneNumber: item.tel,
      title: item.name,
      conversation_id: item.id,
      fromSearchScene: true,
    });
  }

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading && (
          <View style={StyleSheet.absoluteFillObject}>
            <Indicator fullScreen />
          </View>
        )}

        <FlatList
          safeLayout
          data={this.state.customers}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          onTouchMove={Keyboard.dismiss}
          renderItem={({item, index}) => (
            <ChatRow
              title={item.name}
              img={item.avatar}
              subTitle={item.tel}
              onPress={() => this.onPressCustomer(item)}
              isSeparate={index !== this.state.customers.length - 1}
            />
          )}
          ListEmptyComponent={
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={Keyboard.dismiss}>
              <View style={{flex: 1}}>
                {!this.state.searchValue ? (
                  <NoResult
                    iconName="file-search"
                    message={this.props.t('enterToSearch')}
                  />
                ) : (
                  !this.state.isTyping && (
                    <NoResult
                      iconName="magnify-close"
                      message={this.props.t('chat:noConversationsFound')}
                    />
                  )
                )}
              </View>
            </TouchableWithoutFeedback>
          }
          keyExtractor={(item, index) => String(item.id)}
        />
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['common', 'chat'])(Search);
