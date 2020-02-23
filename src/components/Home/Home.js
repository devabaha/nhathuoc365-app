import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView
} from 'react-native';
import StatusBarBackground, {
  showBgrStatusIfOffsetTop
} from 'app-packages/tickid-bgr-status-bar';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import HomeCardList, { HomeCardItem } from './component/HomeCardList';
import LoadingComponent from '@tickid/tickid-rn-loading';
import ListServices from './component/ListServices';
import ListProducts, { ProductItem } from './component/ListProducts';
import appConfig from 'app-config';

const defaultListener = () => {};

class Home extends Component {
  static propTypes = {
    sites: PropTypes.array,
    newses: PropTypes.array,
    notices: PropTypes.array,
    services: PropTypes.array,
    campaigns: PropTypes.array,
    promotions: PropTypes.array,
    products: PropTypes.array,
    listService: PropTypes.array,
    primaryActions: PropTypes.array,
    notify: PropTypes.object,
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
    onShowAllSites: PropTypes.func,
    onShowAllCampaigns: PropTypes.func,
    onShowAllNews: PropTypes.func,
    onPressProduct: PropTypes.func,
    onPressSiteItem: PropTypes.func,
    onPressCampaignItem: PropTypes.func,
    onPressNewItem: PropTypes.func,
    onPressNoti: PropTypes.func,
    product_groups: PropTypes.object
  };

  static defaultProps = {
    sites: [],
    newses: [],
    notices: [],
    services: [],
    campaigns: [],
    promotions: [],
    products: [],
    listService: [],
    primaryActions: [],
    notify: {},
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
    onShowAllSites: defaultListener,
    onShowAllCampaigns: defaultListener,
    onShowAllNews: defaultListener,
    onPressProduct: defaultListener,
    onPressSiteItem: defaultListener,
    onPressCampaignItem: defaultListener,
    onPressNewItem: defaultListener,
    onPressNoti: defaultListener,
    product_groups: {}
  };

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

  get hasProducts() {
    return Array.isArray(this.props.products) && this.props.products.length > 0;
  }
  get hasProduct_groups() {
    let array_product_groups = Object.keys(this.props.product_groups);
    return (
      Array.isArray(array_product_groups) && array_product_groups.length > 0
    );
  }
  showBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    `${appConfig.routes.homeTab}_1`,
    68
  );

  render() {
    return (
      <View style={styles.container}>
        {this.props.apiFetching && <LoadingComponent loading />}

        <View style={styles.headerBackground}>
          {this.props.site && this.props.site.app_event_banner_image && (
            <Image
              style={styles.headerImage}
              source={{ uri: this.props.site.app_event_banner_image }}
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
          }
        >
          <Header
            notify={this.props.notify}
            name={this.props.userInfo ? this.props.userInfo.name : 'Tk Khách'}
            onPressNoti={this.props.onPressNoti}
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
              primaryActions={this.props.primaryActions}
              onPressItem={this.props.onActionPress}
              onSurplusNext={this.props.onSurplusNext}
            />
          </View>

          <ListServices
            services={this.props.services}
            listService={this.props.listService}
            notify={this.props.notify}
            onItemPress={this.props.onPressService}
          />

          <View style={styles.contentWrapper}>
            {this.hasPromotion && (
              <Promotion
                data={this.props.promotions}
                onPress={this.props.onPromotionPressed}
              />
            )}

            {this.hasSites && (
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

            {this.hasCampaigns && (
              <HomeCardList
                onShowAll={this.props.onShowAllCampaigns}
                data={this.props.campaigns}
                title="Tick Voucher"
              >
                {({ item, index }) => {
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
            {this.hasProduct_groups &&
              Object.keys(this.props.product_groups).map((key, index) => {
                let { products, title } = this.props.product_groups[key];
                return (
                  <ListProducts data={products} title={title} key={index}>
                    {({ item: product, index }) => (
                      <ProductItem
                        name={product.name}
                        image={product.image}
                        discount_view={product.discount_view}
                        discount_percent={product.discount_percent}
                        price_view={product.price_view}
                        onPress={() => this.props.onPressProduct(product)}
                        last={this.props.products.length - 1 === index}
                      />
                    )}
                  </ListProducts>
                );
              })}
            {this.hasNews && (
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

        <StatusBarBackground />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff'
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    width: 1000,
    height: 1000,
    borderRadius: 480,
    position: 'absolute',
    top: -820,
    left: appConfig.device.width / 2 - 500,
    alignItems: 'center',
    overflow: 'hidden'
  },
  headerImage: {
    height: 180,
    resizeMode: 'cover',
    width: appConfig.device.width,
    position: 'absolute',
    bottom: 0
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
