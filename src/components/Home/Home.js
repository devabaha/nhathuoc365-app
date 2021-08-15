import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
  RefreshControl,
  Platform,
  StatusBar,
  SafeAreaView,
  // ScrollView,
  SectionList,
  Text,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import StatusBarBackground, {
  showBgrStatusIfOffsetTop,
} from 'app-packages/tickid-bgr-status-bar';
import Promotion from './component/Promotion';
import Header from './component/Header';
import PrimaryActions from './component/PrimaryActions';
import HomeCardList, {HomeCardItem} from './component/HomeCardList';
import ListServices from './component/ListServices';
import ListProducts, {ProductItem} from './component/ListProducts';
import appConfig from 'app-config';
import ListProductSkeleton from './component/ListProducts/ListProductSkeleton';
import HomeCardListSkeleton from './component/HomeCardList/HomeCardListSkeleton';
import ListServiceSkeleton from './component/ListServices/ListServiceSkeleton';
import Themes from 'src/Themes';
import {
  getPackageOptionValue,
  PACKAGE_OPTIONS_TYPE,
} from '../../helper/packageOptionsHandler';
import Posts from 'src/containers/Social/Posts';

const homeThemes = Themes.getNameSpace('home');
const homeStyles = homeThemes('styles.home.home');

const defaultListener = () => {};
const STATUS_BAR_STYLE = {
  LIGHT: 'light-content',
  DARK: 'dark-content',
};
const {
  set,
  Extrapolate,
  ScrollView,
  color,
  interpolate,
  Value,
  block,
  call,
  event,
} = Animated;
const EXTRAPOLATE_RANGE = 100;
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
    onPressCommission: PropTypes.func,
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
    product_categories: PropTypes.array,
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
    onPressCommission: defaultListener,
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
    product_categories: [],
  };

  state = {
    statusBarStyle: STATUS_BAR_STYLE.LIGHT,
    showShadow: false,
    headerHeight: undefined,
  };
  animatedHeaderContainerValue = new Value(0);
  animatedHeaderValue = new Value(0);

  homeThemes = Themes.getNameSpace('home');

  handleAnimatedScroll = ({value}) => {
    value = Math.round(value);
    if (value <= 0 && this.state.showShadow) {
      this.setState({
        showShadow: false,
        statusBarStyle: STATUS_BAR_STYLE.LIGHT,
      });
      return;
    }

    if (value >= EXTRAPOLATE_RANGE * 0.7 && !this.state.showShadow) {
      this.setState({
        showShadow: true,
        statusBarStyle: STATUS_BAR_STYLE.DARK,
      });
    }
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

  get hasSocialPosts() {
    return this.props.social_posts?.length > 0;
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

  get hasProduct_categories() {
    return (
      Array.isArray(this.props.product_categories) &&
      this.props.product_categories.length > 0
    );
  }

  get isVisibleLoyaltyBox() {
    return !getPackageOptionValue(
      PACKAGE_OPTIONS_TYPE.DISABLE_PACKAGE_OPTION_LOYALTY_BOX,
    );
  }

  handleHeaderLayout(e) {
    const {height} = e.nativeEvent.layout;
    if (height !== this.state.headerHeight) {
      this.setState({
        headerHeight: height,
      });
      Animated.timing(this.animatedHeaderContainerValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.quad,
      }).start();
    }
  }

  showBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    `${appConfig.routes.homeTab}_1`,
    EXTRAPOLATE_RANGE / 2,
  );

  wrapperAnimatedStyle = {
    opacity: interpolate(this.animatedHeaderValue, {
      inputRange: [-EXTRAPOLATE_RANGE / 2, 0],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    }),
    ...elevationShadowStyle(3),
    elevation: interpolate(this.animatedHeaderValue, {
      inputRange: [0, EXTRAPOLATE_RANGE / 2, EXTRAPOLATE_RANGE],
      outputRange: [0, 0, 5],
      extrapolate: Extrapolate.CLAMP,
    }),
    shadowOpacity: interpolate(this.animatedHeaderValue, {
      inputRange: [0, EXTRAPOLATE_RANGE / 2, EXTRAPOLATE_RANGE],
      outputRange: [0, 0, 0.15],
      extrapolate: Extrapolate.CLAMP,
    }),
    backgroundColor: color(
      255,
      255,
      255,
      interpolate(this.animatedHeaderValue, {
        inputRange: [0, EXTRAPOLATE_RANGE / 2, EXTRAPOLATE_RANGE],
        outputRange: [0, 0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    ),
  };

  headerAnimatedStyle = {
    opacity: interpolate(this.animatedHeaderValue, {
      inputRange: [0, EXTRAPOLATE_RANGE],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    }),
  };

  headerBackgroundOpacity = {
    opacity: interpolate(this.animatedHeaderValue, {
      inputRange: [0, EXTRAPOLATE_RANGE],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    }),
  };

  headerIconStyle = {
    color:
      this.homeThemes('styles.home.header_search_wrapper_active')
        ?.backgroundColor || appConfig.colors.primary,
    opacity: interpolate(this.animatedHeaderValue, {
      inputRange: [0, EXTRAPOLATE_RANGE],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP,
    }),
  };

  searchWrapperStyle = [
    this.homeThemes('styles.home.header_search_wrapper_active'),
    {
      backgroundColor: color(
        ...hexToRgbCode(
          this.homeThemes('styles.home.header_search_wrapper_active')
            ?.backgroundColor || '#f5f5f5',
        ),
        interpolate(this.animatedHeaderValue, {
          inputRange: [0, EXTRAPOLATE_RANGE],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
      ),
    },
  ];

  headerContainerStyle = {
    opacity: this.animatedHeaderContainerValue,
  };

  render() {
    const {t} = this.props;
    const name = this.props.userInfo
      ? this.props.userInfo.name
        ? this.props.userInfo.name
        : t('welcome.defaultUserName')
      : t('welcome.defaultUserName');
    const extraTop =
      (this.state.headerHeight || 0) +
      10 +
      (appConfig.device.isIOS
        ? -5 + (!!appConfig.device.bottomSpace ? -10 : 0)
        : 0);

    return (
      <View style={styles.container}>
        {/* <LoadingComponent loading={this.props.apiFetching} /> */}
        {/* <StatusBar
          // barStyle={this.state.statusBarStyle}
          backgroundColor={appConfig.colors.primary}
        /> */}

        <Animated.View
          style={[styles.headerBackground, this.headerBackgroundOpacity]}>
          {this.props.site && this.props.site.app_event_banner_image && (
            <Image
              style={styles.headerImage}
              source={{uri: this.props.site.app_event_banner_image}}
            />
          )}
        </Animated.View>

        <Animated.View
          style={[styles.headerContainerStyle, this.headerContainerStyle]}>
          <Header
            wrapperStyle={this.wrapperAnimatedStyle}
            maskSearchWrapperStyle={this.searchWrapperStyle}
            maskSubStyle={this.headerAnimatedStyle}
            iconStyle={this.headerIconStyle}
            notify={this.props.notify}
            name={name}
            onPressNoti={this.props.onPressNoti}
            goToSearch={this.props.goToSearch}
            loading={this.props.storeFetching}
            onContentLayout={this.handleHeaderLayout.bind(this)}
          />
        </Animated.View>

        <SafeAreaView>
          <ScrollView
            // onScroll={this.showBgrStatusIfOffsetTop}
            onScroll={event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: (y) =>
                        block([
                          set(this.animatedHeaderValue, y),
                          call([y], ([offsetY]) => {
                            this.showBgrStatusIfOffsetTop({
                              nativeEvent: {contentOffset: {y: offsetY}},
                            });
                            this.handleAnimatedScroll({value: offsetY});
                          }),
                        ]),
                    },
                  },
                },
              ],
              {
                useNativeDriver: true,
              },
            )}
            style={{overflow: 'visible'}}
            contentContainerStyle={{
              paddingTop: extraTop,
              paddingBottom: 30,
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                progressViewOffset={extraTop}
                refreshing={this.props.refreshing}
                onRefresh={this.props.onPullToRefresh}
                tintColor={appConfig.colors.white}
              />
            }>
            {/* <Header
            name={name}
            onPressNoti={this.props.onPressNoti}
            goToSearch={this.props.goToSearch}
          /> */}

            <View style={styles.block}>
              {this.isVisibleLoyaltyBox ? (
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
                    this.props.showPrimaryActions
                      ? this.props.primaryActions
                      : null
                  }
                  onPressItem={this.props.onActionPress}
                  onSurplusNext={this.props.onSurplusNext}
                  onPressCommission={this.props.onPressCommission}
                />
              ) : (
                this.hasPromotion && (
                  <Promotion
                    data={this.props.promotions}
                    onPress={this.props.onPromotionPressed}
                  />
                )
              )}
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
                containerStyle={styles.servicesBlock}
                contentContainerStyle={styles.servicesContent}
              />
            ) : this.props.apiFetching ? (
              <ListServiceSkeleton />
            ) : null}

            <View style={styles.contentWrapper}>
              {this.isVisibleLoyaltyBox && this.hasPromotion && (
                <Promotion
                  containerStyle={styles.promotionBlock}
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
              {this.hasProduct_categories ? (
                this.props.product_categories.map((productCategory, index) => {
                  let {id, products, title, display_type} = productCategory;
                  return (
                    <ListProducts
                      key={id}
                      type={display_type}
                      data={products}
                      title={title}
                      onPressProduct={this.props.onPressProduct}
                      onShowAll={
                        !id
                          ? null
                          : () =>
                              this.props.onShowAllGroupProduct(productCategory)
                      }
                    />
                  );
                })
              ) : this.props.apiFetching ? (
                <ListProductSkeleton />
              ) : null}

              {!!this.hasSocialPosts && (
                <HomeCardList
                  onShowAll={this.props.goToSocial}
                  title={t('common:screen.social.mainTitle')}
                  contentContainerStyle={styles.socialPostContainer}
                  renderContent={() => (
                    <Posts
                      disablePostUpdating
                      disableLoadMore
                      posts={this.props.social_posts}
                    />
                  )}
                />
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
        </SafeAreaView>

        <StatusBarBackground />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F5F7F8',
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    alignItems: 'center',
    overflow: 'hidden',
    width: appConfig.device.width * 3,
    height: appConfig.device.width * 3,
    borderRadius: appConfig.device.width * 3,
    position: 'absolute',
    top:
      -(appConfig.device.width * 3) +
      120 -
      (appConfig.device.isAndroid
        ? appConfig.device.statusBarHeight / 2
        : appConfig.device.bottomSpace
        ? -appConfig.device.statusBarHeight / 2
        : 0),
    left: appConfig.device.width / 2 - appConfig.device.width * 1.5,
    transform: [{scaleX: 1.2}],
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
    // marginBottom: 32,
  },
  primaryActionsWrapper: {
    paddingBottom: 8,
  },
  headerContainerStyle: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 9999,
  },

  servicesBlock: {
    paddingBottom: 10,
    marginTop: -20,
  },
  servicesContent: {
    paddingTop: 20,
  },
  promotionBlock: {
    marginTop: 10,
    marginBottom: 10,
  },
  block: {
    marginBottom: 20,
  },

  socialPostContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: -15,
  },
});
styles = Themes.mergeStyles(styles, homeStyles);

export default withTranslation(['home', 'common'])(Home);
