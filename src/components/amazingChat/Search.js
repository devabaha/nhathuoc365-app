import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
import {push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import NoResult from '../NoResult';
import ChatRow from './ChatRow';
import {ScreenWrapper, FlatList} from 'src/components/base';

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
        onChangeSearch: this.handleChangeSearch,
      }),
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.setState({loading: false});
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  searchCustomer = async (search = '') => {
    if (!this.unmounted) {
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
      console.warn(e + ' site_search_conversations');
    } finally {
      if (!this.unmounted) {
        this.setState({loading: false, isTyping: false});
      }
    }
  };

  handleChangeSearch = debounce((searchValue) => {
    this.setState({searchValue, isTyping: true, loading: true}, () => {
      this.searchCustomer(searchValue);
    });
  }, 500);

  onPressCustomer(item) {
    push(
      appConfig.routes.amazingChat,
      {
        site_id: item.site_id,
        user_id: item.user_id,
        phoneNumber: item.tel,
        title: item.name,
        fromSearchScene: true,
      },
      this.theme,
    );
  }

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading && (
          <View style={{position: 'absolute', width: '100%', height: '100%'}}>
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
              style={styles.listEmptyWrapper}
              onPress={Keyboard.dismiss}>
              <View style={styles.listEmptyContainer}>
                {!this.state.searchValue && !this.state.loading ? (
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

const styles = StyleSheet.create({
  listEmptyWrapper: {
    flex: 1,
  },
  listEmptyContainer: {
    flex: 1,
    width: appConfig.device.width,
    height: appConfig.device.height,
  },
});

export default withTranslation(['common', 'chat'])(Search);
