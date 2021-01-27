import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text
} from 'react-native';
import StatusBarBackground, {
  showBgrStatusIfOffsetTop
} from 'app-packages/tickid-bgr-status-bar';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import HomeCardList, { HomeCardItem } from './component/HomeCardList';
import ListServices from './component/ListServices';
import ListProducts from './component/ListProducts';
import appConfig from 'app-config';
import { SERVICES_TYPE } from '../../helper/servicesHandler';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListProductSkeleton from './component/ListProducts/ListProductSkeleton';
import HomeCardListSkeleton from './component/HomeCardList/HomeCardListSkeleton';
import ListServiceSkeleton from './component/ListServices/ListServiceSkeleton';

const defaultListener = () => {};

class Home extends Component {
  static propTypes = {
    sites: PropTypes.array,
    title_sites: PropTypes.string,
    rooms: PropTypes.array,
    title_rooms: PropTypes.string,
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
    listServiceItemsPerRow: PropTypes.number
  };

  static defaultProps = {
    sites: [],
    title_sites: '',
    rooms: [],
    title_rooms: '',
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

  get hasRooms() {
    return Array.isArray(this.props.rooms);
  }

  get hasNews() {
    return Array.isArray(this.props.newses) && this.props.newses.length > 0;
  }

  get hasRoomNews() {
    return (
      Array.isArray(this.props.room_news) && this.props.room_news.length > 0
    );
  }

  get hasProducts() {
    return Array.isArray(this.props.products) && this.props.products.length > 0;
  }

  get hasProduct_groups() {
    return (
      Array.isArray(this.props.product_groups) && this.props.product_groups.length > 0
    );
  }

  get hasServices() {
    return (
      Array.isArray(this.props.listService) && this.props.listService.length > 0
    );
  }

  showBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    `${appConfig.routes.homeTab}_1`,
    68
  );

  render() {
    const { t } = this.props;
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
              source={{ uri: this.props.site.app_event_banner_image}}
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
          showsVerticalScrollIndicator={false}
        >
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
              onScanPress={() =>
                this.props.onActionPress({ type: SERVICES_TYPE.QRCODE_SCAN })
              }
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
            {this.hasProduct_groups ? (
              this.props.product_groups.map((productGroup, index) => {
                let {
                  id,
                  products,
                  title,
                  display_type
                } = productGroup;
                return (
                  <ListProducts
                    key={id}
                    type={display_type}
                    data={products}
                    title={title}
                    onPressProduct={this.props.onPressProduct}
                    onShowAll={() => this.props.onShowAllGroupProduct(productGroup)}
                  />
                );
              })
            ) : this.props.apiFetching ? (
              <ListProductSkeleton />
            ) : null}

            {this.hasSites ? (
              <HomeCardList
                onShowAll={null}
                data={this.props.sites}
                title={
                  this.props.title_sites
                    ? this.props.title_sites
                    : t('sections.favoriteStore.title')
                }
              >
                {({ item, index }) => (
                  <HomeCardItem
                    selfRequest={callBack =>
                      this.props.onPressSiteItem(item, callBack)
                    }
                    title={item.title}
                    isShowSubTitle={true}
                    subTitle={item.address}
                    imageUrl={item.image_url}
                    last={this.props.sites.length - 1 === index}
                  />
                )}
              </HomeCardList>
            ): this.props.apiFetching ? (
              <HomeCardListSkeleton />
            ) : null}

            {this.hasPromotion && (
              <Promotion
                data={this.props.promotions}
                onPress={this.props.onPromotionPressed}
              />
            )}

            {this.hasCampaigns && (
              <HomeCardList
                onShowAll={this.props.onShowAllCampaigns}
                data={this.props.campaigns}
                title={t('sections.voucher.title')}
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

            {this.hasRooms ? (
              <HomeCardList
                data={this.props.rooms}
                onShowAll={null}
                title={
                  this.props.title_rooms
                    ? this.props.title_rooms
                    : 'Căn hộ của tôi'
                }
                extraComponent={this.props.rooms.length === 0 && <NoRoom />}
              >
                {({ item, index }) => (
                  <HomeCardItem
                    title={item.title}
                    isShowSubTitle={true}
                    subTitle={item.address}
                    iconSubTitle={<Icon name="map-marker" />}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressRoomItem(item)}
                    last={this.props.rooms.length - 1 === index}
                  />
                )}
              </HomeCardList>
            ): this.props.apiFetching ? (
              <HomeCardListSkeleton />
            ) : null}

            {this.hasRoomNews ? (
              <HomeCardList
                onShowAll={null}
                data={this.props.room_news}
                title={this.props.title_room_news}
              >
                {({ item, index }) => (
                  <HomeCardItem
                    title={item.title}
                    iconSubTitle={<Icon name="building" />}
                    subTitle={item.shop_name}
                    imageUrl={item.image_url}
                    onPress={() => this.props.onPressRoomNews(item)}
                    last={this.props.room_news.length - 1 === index}
                  />
                )}
              </HomeCardList>
            ) : this.props.apiFetching ? (
              <HomeCardListSkeleton />
            ) : null}

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
            {this.hasNews ? (
              <HomeCardList
                onShowAll={this.props.onShowAllNews}
                data={this.props.newses}
                title={this.props.title_newses}
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
    overflow: 'hidden'
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
    marginBottom: 32
  },
  primaryActionsWrapper: {
    paddingBottom: 8
  }
});

export default withTranslation(['home', 'common'])(Home);

const NoRoom = props => (
  <View style={noRoomStyles.container}>
    <Text style={noRoomStyles.text}>
      {`Bạn chưa có nhà trên HomeID.\r\rVui lòng liên hệ BQL tòa nhà của bạn và kiểm tra số điện thoại chủ hộ được đăng ký có đúng với số đang đăng nhập không?`}
    </Text>
  </View>
);

const noRoomStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 0.5,
    borderColor: '#ddd'
  },
  text: {
    color: '#444'
  }
});
