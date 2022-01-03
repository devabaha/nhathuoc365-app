import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {TabView, TabBar} from 'react-native-tab-view';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Loading from 'src/components/Loading';
import Scene from './Scene';
import {
  ScreenWrapper,
  Container,
  Typography,
  BaseButton,
} from 'src/components/base';
// skeleton
import PremiumInfoSkeleton from './PremiumInfoSkeleton';
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';

const premiums = [
  {
    id: 1,
    site_id: 28,
    name: 'Thành viên',
    describe: 'Hạng mặc định',
    point: 0,
    point_view: '0 điểm',
    benefits: [
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
    ],
  },
  {
    id: 9,
    site_id: 28,
    name: 'Thành viên',
    describe: 'Hạng mặc định',
    point: 0,
    point_view: '0 điểm',
    benefits: [
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
    ],
  },
  {
    id: 7,
    site_id: 28,
    name: 'Thành viên',
    describe: 'Hạng mặc định',
    point: 0,
    point_view: '0 điểm',
    benefits: [
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
    ],
  },
  {
    id: 2,
    site_id: 28,
    name: 'Bạc',
    describe: 'Hạng KH bạc',
    point: 500,
    point_view: '500 điểm',
    benefits: [
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
      {
        id: 2,
        site_id: 28,
        name: 'Giảm giá 2% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi dành cho Khách hàng khi trở thành thành viên hạng Bạc của ABAHA',
      },
    ],
  },
  {
    active: 1,
    id: 3,
    site_id: 28,
    name: 'Kim Cương',
    describe: 'Hạng KH vàng',
    point: 1500,
    point_view: '1500 điểm',
    benefits: [
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA',
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA',
      },
    ],
  },
];

const MAX_TAB_ITEMS_PER_ROW = 4;

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 0,
  },
  tabBarLabel: {
    minWidth: '100%',
    flex: appConfig.device.isIOS ? undefined : 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
  },
  indicatorStyle: {
    height: 2,
  },
  tabBarItemContainerStyle: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class PremiumInfo extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    indexTab: 0,
    siteId: '',
    currentPremiumId: undefined,
  };

  state = {
    index: this.props.indexTab,
    routes: [],
    currentPremium: {},
    refreshing: false,
    loading: true,
  };
  getPremiumsRequest = new APIRequest();
  requests = [];

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get currentPremiumId() {
    return this.props.currentPremiumId || store.user_info?.premium || 0;
  }

  componentDidMount() {
    this.getPremiums();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    cancelRequests(this.requests);

    this.updateNavBarDisposer();
  }

  async getPremiums() {
    const {t} = this.props;
    const siteId =
      this.props.siteId || store.app_data ? store.app_data.id : store.store_id;
    try {
      this.getPremiumsRequest.data = APIHandler.get_premiums(siteId);
      const response = await this.getPremiumsRequest.promise();
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          const routes = this.routesFormatter(
            response.data.premiums.filter(
              (premium) =>
                premium.view_flag == 1 || premium.id === this.currentPremiumId,
            ),
          );
          const currentPremium = routes.find((route) => !!route.active) || {
            id: this.state.index,
          };
          const currentIndex =
            currentPremium && currentPremium.id
              ? routes.findIndex((route) => route.id === currentPremium.id)
              : this.state.index;

          this.setState(
            {
              routes,
              currentPremium,
            },
            () => {
              setTimeout(() =>
                this.setState({
                  index: currentIndex,
                }),
              );
            },
          );
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('%cget_premiums', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        refreshing: false,
        loading: false,
      });
    }
  }

  routesFormatter(premiums = []) {
    return premiums.map((premium, index) => ({
      key: index,
      title: premium.name,
      ...premium,
    }));
  }

  handleRefresh() {
    this.setState({
      refreshing: true,
    });

    this.getPremiums();
  }

  handleIndexChange = (index) => {
    this.setState({index});
  };

  renderTabBarLabel(props) {
    const {
      route: {title, key},
    } = props;
    const focused = key === this.state.index;

    return (
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        numberOfLines={2}
        style={[
          styles.tabBarLabel,
          focused && [this.tabBarLabelActiveStyle, styles.tabBarLabelActive],
        ]}>
        {title}
      </Typography>
    );
  }

  renderTabBar(props) {
    const numberOfTabs = this.state.routes.length;
    const tabWidth =
      numberOfTabs <= MAX_TAB_ITEMS_PER_ROW
        ? appConfig.device.width / numberOfTabs
        : appConfig.device.width / MAX_TAB_ITEMS_PER_ROW;
    return (
      <TabBar
        {...props}
        renderTabBarItem={(props) => {
          return (
            <BaseButton
              style={[{width: tabWidth}, styles.tabBarItemContainerStyle]}
              key={props.route.key}
              onPress={() => {
                this.context.toggleTheme(BASE_DARK_THEME_ID);
                this.setState({index: props.route.key});
              }}>
              {this.renderTabBarLabel(props)}
            </BaseButton>
          );
        }}
        indicatorStyle={[this.indicatorStyle, styles.indicatorStyle]}
        style={[this.tabBarStyle, styles.tabBarStyle]}
        tabStyle={{width: tabWidth}}
        scrollEnabled
      />
    );
  }

  renderScene({route: premium}) {
    const benefits = premium.benefits || [];

    return (
      <Scene
        benefits={benefits}
        premium={premium}
        currentPremium={this.state.currentPremium}
        refreshing={this.state.refreshing}
        handleRefresh={this.handleRefresh.bind(this)}
      />
    );
  }

  get tabBarLabelActiveStyle() {
    return {
      color: this.theme.color.persistPrimary,
    };
  }

  get indicatorStyle() {
    return {
      backgroundColor: this.theme.color.persistPrimary,
    };
  }

  get tabBarStyle() {
    return {
      backgroundColor: this.theme.color.surface,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  render() {
    return (
      <ScreenWrapper>
        <PremiumInfoSkeleton loading={this.state.loading}>
          <Container noBackground flex>
            {this.state.loading && <Loading center />}
            {!!this.state.routes && (
              <TabView
                navigationState={this.state}
                renderTabBar={this.renderTabBar.bind(this)}
                renderScene={this.renderScene.bind(this)}
                onIndexChange={this.handleIndexChange}
                initialLayout={{width: appConfig.device.width}}
              />
            )}
          </Container>
        </PremiumInfoSkeleton>
      </ScreenWrapper>
    );
  }
}

export default withTranslation()(PremiumInfo);
