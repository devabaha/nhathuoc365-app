import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import StatusBarBackground, {
  showBgrStatusIfOffsetTop,
} from 'app-packages/tickid-bgr-status-bar';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import HomeCardList, {HomeCardItem} from './component/HomeCardList';
import ListServices from './component/ListServices';
import ListProducts from './component/ListProducts';
import appConfig from 'app-config';
import ListProductSkeleton from './component/ListProducts/ListProductSkeleton';
import HomeCardListSkeleton from './component/HomeCardList/HomeCardListSkeleton';
import ListServiceSkeleton from './component/ListServices/ListServiceSkeleton';

const defaultListener = () => {};

class Home extends Component {
  static propTypes = {
    sites: PropTypes.array,
    title_sites: PropTypes.string,
    newses: PropTypes.array,
    notices: PropTypes.array,
    services: PropTypes.array,
    campaigns: PropTypes.array,
    promotions: PropTypes.array,
    products: PropTypes.array,
    listService: PropTypes.array,
    primaryActions: PropTypes.array,
    showPrimaryActions: PropTypes.bool,
    userInfo: PropTypes.object,
    refreshing: PropTypes.bool,
    apiFetching: PropTypes.bool,
    onActionPress: PropTypes.func,
    onSurplusNext: PropTypes.func,
    onPromotionPressed: PropTypes.func,
    onVoucherPressed: PropTypes.func,
    onShowAllVouchers: PropTypes.func,
    onPressService: PropTypes.func,
    onPullToRefresh: PropTypes.func,
    onShowAllGroupProduct: PropTypes.func,
    onShowAllSites: PropTypes.func,
    onShowAllCampaigns: PropTypes.func,
    onShowAllNews: PropTypes.func,
    onPressProduct: PropTypes.func,
    onPressSiteItem: PropTypes.func,
    onPressSiteItem: PropTypes.func,
    onPressCampaignItem: PropTypes.func,
    onPressNewItem: PropTypes.func,
    onPressNoti: PropTypes.func,
    product_groups: PropTypes.array,
    listServiceItemsPerRow: PropTypes.number,
  };

  static defaultProps = {
    sites: [],
    title_sites: '',
    newses: [],
    notices: [],
    services: [],
    campaigns: [],
    promotions: [],
    products: [],
    listService: [],
    primaryActions: [],
    showPrimaryActions: true,
    userInfo: undefined,
    refreshing: false,
    apiFetching: false,
    onActionPress: defaultListener,
    onSurplusNext: defaultListener,
    onPromotionPressed: defaultListener,
    onVoucherPressed: defaultListener,
    onShowAllVouchers: defaultListener,
    onPressService: defaultListener,
    onPullToRefresh: defaultListener,
    onShowAllGroupProduct: defaultListener,
    onShowAllSites: defaultListener,
    onShowAllCampaigns: defaultListener,
    onShowAllNews: defaultListener,
    onPressProduct: defaultListener,
    onPressSiteItem: defaultListener,
    onPressSiteItem: defaultListener,
    onPressCampaignItem: defaultListener,
    onPressNewItem: defaultListener,
    onPressNoti: defaultListener,
    product_groups: [],
  };

  get hasServices() {
    return (
      Array.isArray(this.props.listService) && this.props.listService.length > 0
    );
  }

  get hasPromotion() {
    return (
      Array.isArray(this.props.promotions) && this.props.promotions.length > 0
    );
  }

  get hasCampaigns() {
    return (
      Array.isArray(this.props.campaigns) && this.props.campaigns.length > 0
    );
  }

  get hasSites() {
    return Array.isArray(this.props.sites) && this.props.sites.length > 0;
  }

  get hasNews() {
    return Array.isArray(this.props.newses) && this.props.newses.length > 0;
  }

  get hasNewsGroups() {
    return this.props.news_categories?.length > 0;
  }

  get hasProducts() {
    return Array.isArray(this.props.products) && this.props.products.length > 0;
  }
  get hasProduct_groups() {
    return (
      Array.isArray(this.props.product_groups) &&
      this.props.product_groups.length > 0
    );
  }
  showBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    `${appConfig.routes.homeTab}_1`,
    68,
  );

  render() {
    const {t} = this.props;
    const name = this.props.userInfo
      ? this.props.userInfo.name
        ? this.props.userInfo.name
        : t('welcome.defaultUserName')
      : t('welcome.defaultUserName');

    return (
      <View style={styles.container}>
        {/* <LoadingComponent loading={this.props.apiFetching} /> */}

        <View style={styles.headerBackground}>
          {this.props.site && this.props.site.app_event_banner_image && (
            <Image
              style={styles.headerImage}
              source={{uri: this.props.site.app_event_banner_image}}
            />
          )}
        </View>

        <ScrollView
          onScroll={this.showBgrStatusIfOffsetTop}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onPullToRefresh}
              tintColor={appConfig.colors.white}
            />
          }>
          <Header
            name={name}
            onPressNoti={this.props.onPressNoti}
            goToSearch={this.props.goToSearch}
          />

          <View style={styles.primaryActionsWrapper}>
            <PrimaryActions
              walletName={
                // this.props.userInfo && this.props.userInfo.default_wallet
                //   ? this.props.userInfo.default_wallet.name
                //   : ''
                name
              }
              surplus={
                this.props.userInfo && this.props.userInfo.default_wallet
                  ? this.props.userInfo.default_wallet.balance_view
                  : ''
              }
              primaryActions={
                this.props.showPrimaryActions ? this.props.primaryActions : null
              }
              onPressItem={this.props.onActionPress}
              onSurplusNext={this.props.onSurplusNext}
            />
          </View>

          {this.hasServices ? (
            <ListServices
              selfRequest={(service, callBack) =>
                this.props.onPressService(service, callBack)
              }
              listService={this.props.listService}
              type={this.props.listServiceType}
              itemsPerRow={this.props.listServiceItemsPerRow}
              onItemPress={this.props.onPressService}
            />
          ) : this.props.apiFetching ? (
            <ListServiceSkeleton />
          ) : null}

          <View style={styles.contentWrapper}>
            {this.hasPromotion && (
              <Promotion
                data={this.props.promotions}
                onPress={this.props.onPromotionPressed}
              />
            )}
            {this.hasProduct_groups ? (
              this.props.product_groups.map((productGroup, index) => {
                let {id, products, title, display_type} = productGroup;
                return (
                  <ListProducts
                    key={id}
                    type={display_type}
                    data={products}
                    title={title}
                    onPressProduct={this.props.onPressProduct}
                    onShowAll={() =>
                      this.props.onShowAllGroupProduct(productGroup)
                    }
                  />
                );
              })
            ) : this.props.apiFetching ? (
              <ListProductSkeleton />
            ) : null}
            {this.hasSites && (
              <HomeCardList
                onShowAll={this.props.onShowAllSites}
                data={this.props.sites}
                title={
                  this.props.title_sites
                    ? this.props.title_sites
                    : t('sections.favoriteStore.title')
                }>
                {({item, index}) => (
                  <HomeCardItem
                    selfRequest={(callBack) =>
                      this.props.onPressSiteItem(item, callBack)
                    }
                    title={item.title}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressSiteItem(item)}
                    last={this.props.sites.length - 1 === index}
                  />
                )}
              </HomeCardList>
            )}
            {this.hasCampaigns && (
              <HomeCardList
                onShowAll={this.props.onShowAllCampaigns}
                data={this.props.campaigns}
                title={t('sections.voucher.title')}>
                {({item, index}) => {
                  return (
                    <HomeCardItem
                      title={item.title}
                      isShowSubTitle={item.point !== '0'}
                      specialSubTitle={item.point + ' '}
                      subTitle={item.point_currency}
                      imageUrl={item.image_url}
                      onPress={() => this.props.onPressCampaignItem(item)}
                      last={this.props.campaigns.length - 1 === index}
                    />
                  );
                }}
              </HomeCardList>
            )}

            {this.hasNewsGroups ? (
              this.props.news_categories.map((newsGroup, index) => {
                let {id, news, title} = newsGroup;
                return (
                  <HomeCardList
                    key={id}
                    onShowAll={() => this.props.onShowAllNews(title, id)}
                    data={news}
                    title={title}>
                    {({item, index}) => {
                      return (
                        <HomeCardItem
                          title={item.title}
                          imageUrl={item.image_url}
                          onPress={() => this.props.onPressNewItem(item)}
                          last={this.props.newses.length - 1 === index}
                        />
                      );
                    }}
                  </HomeCardList>
                );
              })
            ) : this.hasNews ? (
              <HomeCardList
                onShowAll={() => this.props.onShowAllNews()}
                data={this.props.newses}
                title={t('sections.news.title')}>
                {({item, index}) => (
                  <HomeCardItem
                    title={item.title}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressNewItem(item)}
                    last={this.props.newses.length - 1 === index}
                  />
                )}
              </HomeCardList>
            ) : this.props.apiFetching ? (
              <HomeCardListSkeleton />
            ) : this.props.apiFetching ? (
              <HomeCardListSkeleton />
            ) : null}
          </View>
        </ScrollView>

        <StatusBarBackground />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    width: appConfig.device.width * 3,
    height: appConfig.device.width * 3,
    borderRadius: appConfig.device.width * 3 * 0.5,
    position: 'absolute',
    top: -(appConfig.device.width * 3) + appConfig.device.width / 3,
    left: appConfig.device.width / 2 - appConfig.device.width * 1.5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerImage: {
    height: appConfig.device.width / 3,
    resizeMode: 'cover',
    width: appConfig.device.width,
    position: 'absolute',
    bottom: 0,
  },
  contentWrapper: {
    backgroundColor: appConfig.colors.sceneBackground,
    marginBottom: 32,
  },
  primaryActionsWrapper: {
    paddingBottom: 8,
  },
});

export default withTranslation(['home', 'common'])(Home);
