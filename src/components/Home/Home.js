import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import HomeCardList, { HomeCardItem } from './component/HomeCardList';
import ListServices from './component/ListServices';
import appConfig from 'app-config';
import { SERVICES_LIST } from './constants';

const defaultListener = () => {};

class Home extends Component {
  static propTypes = {
    sites: PropTypes.array,
    newses: PropTypes.array,
    notices: PropTypes.array,
    campaigns: PropTypes.array,
    promotions: PropTypes.array,
    app: PropTypes.object,
    userInfo: PropTypes.object,
    hasPromotion: PropTypes.bool,
    refreshing: PropTypes.bool,
    onActionPress: PropTypes.func,
    onSurplusNext: PropTypes.func,
    onPromotionPressed: PropTypes.func,
    onVoucherPressed: PropTypes.func,
    onShowAllVouchers: PropTypes.func,
    onPressService: PropTypes.func,
    onPullToRefresh: PropTypes.func,
    onShowAllSites: PropTypes.func,
    onShowAllCampaigns: PropTypes.func,
    onShowAllNews: PropTypes.func,
    onPressSiteItem: PropTypes.func,
    onPressCampaignItem: PropTypes.func,
    onPressNewItem: PropTypes.func,
    onBodyScrollTop: PropTypes.func
  };

  static defaultProps = {
    sites: [],
    newses: [],
    notices: [],
    campaigns: [],
    promotions: [],
    app: undefined,
    userInfo: undefined,
    hasPromotion: false,
    refreshing: false,
    onActionPress: defaultListener,
    onSurplusNext: defaultListener,
    onPromotionPressed: defaultListener,
    onVoucherPressed: defaultListener,
    onShowAllVouchers: defaultListener,
    onPressService: defaultListener,
    onPullToRefresh: defaultListener,
    onShowAllSites: defaultListener,
    onShowAllCampaigns: defaultListener,
    onShowAllNews: defaultListener,
    onPressSiteItem: defaultListener,
    onPressCampaignItem: defaultListener,
    onPressNewItem: defaultListener,
    onBodyScrollTop: defaultListener
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBackground} />

        <ScrollView
          onScroll={this.props.onBodyScrollTop}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onPullToRefresh}
              tintColor={appConfig.colors.white}
            />
          }
        >
          <Header
            name={this.props.userInfo ? this.props.userInfo.name : 'Tk Khách'}
            onPressButtonChat={() =>
              this.props.onPressButtonChat(this.props.app)
            }
          />

          <View style={styles.primaryActionsWrapper}>
            <PrimaryActions
              walletName={
                this.props.userInfo && this.props.userInfo.default_wallet
                  ? this.props.userInfo.default_wallet.name
                  : ''
              }
              surplus={
                this.props.userInfo && this.props.userInfo.default_wallet
                  ? this.props.userInfo.default_wallet.balance_view
                  : ''
              }
              onPressItem={this.props.onActionPress}
              onSurplusNext={this.props.onSurplusNext}
            />
          </View>

          <ListServices
            data={SERVICES_LIST}
            onItemPress={this.props.onPressService}
          />

          <View style={styles.contentWrapper}>
            {this.props.hasPromotion && (
              <Promotion
                data={this.props.promotions}
                onPress={this.props.onPromotionPressed}
              />
            )}

            {this.props.sites && (
              <HomeCardList
                onShowAll={false} //this.props.onShowAllSites
                data={this.props.sites}
                title="Cửa hàng thân thiết"
              >
                {({ item, index }) => (
                  <HomeCardItem
                    title={item.title}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressSiteItem(item)}
                    last={this.props.sites.length - 1 === index}
                  />
                )}
              </HomeCardList>
            )}

            {this.props.campaigns && (
              <HomeCardList
                onShowAll={this.props.onShowAllCampaigns}
                data={this.props.campaigns}
                title="Tick Voucher"
              >
                {({ item, index }) => (
                  <HomeCardItem
                    title={item.title}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressCampaignItem(item)}
                    last={this.props.campaigns.length - 1 === index}
                  />
                )}
              </HomeCardList>
            )}

            {this.props.newses && (
              <HomeCardList
                onShowAll={this.props.onShowAllNews}
                data={this.props.newses}
                title="Tin tức"
              >
                {({ item, index }) => (
                  <HomeCardItem
                    title={item.title}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressNewItem(item)}
                    last={this.props.newses.length - 1 === index}
                  />
                )}
              </HomeCardList>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    paddingTop: appConfig.device.statusBarHeight
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    width: 1000,
    height: 1000,
    borderRadius: 480,
    position: 'absolute',
    top: -820,
    left: appConfig.device.width / 2 - 500
  },
  contentWrapper: {
    backgroundColor: '#f1f1f1',
    marginBottom: 32
  },
  primaryActionsWrapper: {
    paddingBottom: 8
  }
});

export default Home;
