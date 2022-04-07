import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import Loading from '@tickid/tickid-rn-loading';
// configs
import config from '../../config';
// network
import {internalFetch} from '../../helper/apiFetch';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import EventTracker from '../../../../helper/EventTracker';
// custom components
import NoResult from '../../component/NoResult';
import CardItem from '../CardItem';
import {FlatList, RefreshControl, ScreenWrapper} from 'src/components/base';

const styles = StyleSheet.create({
  lastCard: {
    marginBottom: 15,
  },
});

class CardHistory extends Component {
  static contextType = ThemeContext;

  state = {
    orders: [],
    refreshing: false,
    isReady: false,
  };
  updateNavBarDisposer = () => {};
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  get hasOrders() {
    return Array.isArray(this.state.orders) && this.state.orders.length > 0;
  }

  componentDidMount() {
    this.getOrders(this.props.serviceId);
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.updateNavBarDisposer();
    this.eventTracker.clearTracking();
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
    });

    setTimeout(() => {
      this.getOrders(this.props.serviceId);
    }, 1000);
  };

  getOrders = (serviceId) => {
    internalFetch(config.rest.orders(serviceId))
      .then((response) => {
        this.setState({
          orders: response.data,
        });
      })
      .finally(() => {
        this.setState({
          isReady: true,
          refreshing: false,
        });
      });
  };

  renderOrder = ({item, index}) => {
    return (
      <View
        style={
          index === (this.state.orders?.length || 0) - 1 && styles.lastCard
        }>
        <CardItem
          cardId={item.id}
          networkType={item.type}
          networkName={item.name}
          code={item.code}
          price={item.price_label}
          isPay={!!item.is_pay}
          isUsed={!!item.is_used}
          buyTime={item.created}
          statusView={item.status_view}
          syntaxPrepaid={item.syntax_prepaid}
          syntaxPostpaid={item.syntax_postpaid}
          cardCode={item.data && item.data.code}
          cardSeri={item.data && item.data.serial}
        />
      </View>
    );
  };

  render() {
    return (
      <ScreenWrapper>
        {!this.state.isReady ? (
          <Loading loading />
        ) : (
          <FlatList
            safeLayout
            data={this.state.orders || []}
            // data={[]}
            keyExtractor={(item) => `${item.id}`}
            renderItem={this.renderOrder}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            ListEmptyComponent={
              <NoResult
                title={this.props.t('noHistory')}
                text={this.props.t('noHistoryDescription')}
              />
            }
          />
        )}
      </ScreenWrapper>
    );
  }
}

export default withTranslation('phoneCard')(CardHistory);
