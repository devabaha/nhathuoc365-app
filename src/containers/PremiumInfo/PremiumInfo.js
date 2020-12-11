import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import store from 'app-store';
import { APIRequest } from '../../network/Entity';
import BenefitRow from './BenefitRow';
import Container from '../../components/Layout/Container';
import { Actions } from 'react-native-router-flux';
import Loading from '../../components/Loading';
import PremiumInfoSkeleton from './PremiumInfoSkeleton';

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
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      }
    ]
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
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      }
    ]
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
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      }
    ]
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
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      },
      {
        id: 2,
        site_id: 28,
        name: 'Giảm giá 2% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi dành cho Khách hàng khi trở thành thành viên hạng Bạc của ABAHA'
      }
    ]
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
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      },
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      },
      {
        id: 1,
        site_id: 28,
        name: 'Ưu đãi chăm sóc KH',
        describe:
          'Đây là ưu đãi dành cho tất cả các KH khi trở thành thành viên của ABAHA'
      },
      {
        id: 3,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ sản phẩm của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá sản phẩm  dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      },
      {
        id: 4,
        site_id: 28,
        name: 'Giảm giá 3% cho toàn bộ voucher của hệ thống',
        describe:
          'Đây là ưu đãi giảm giá tất cả voucher   dành cho Khách hàng khi trở thành thành viên hạng Vàng của ABAHA'
      }
    ]
  }
];

const MAX_TAB_ITEMS_PER_ROW = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBarStyle: {
    backgroundColor: appConfig.colors.white,
    ...elevationShadowStyle(5)
  },
  tabBarLabel: {
    color: '#333',
    paddingHorizontal: 4
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    color: appConfig.colors.primary
  },
  indicatorStyle: {
    backgroundColor: appConfig.colors.primary,
    height: 2
  },
  sceneContainer: {
    backgroundColor: '#fff'
  },
  separator: {
    height: 2,
    backgroundColor: '#eee',
    ...elevationShadowStyle(7)
  },
  premiumBenefitHeading: {
    color: '#aaa',
    paddingTop: 15,
    textAlign: 'right',
    paddingHorizontal: 15
  },
  loyaltyContainer: {
    marginTop: 7,
    backgroundColor: '#fff'
  },
  loyaltyTitle: {
    color: '#333'
  },
  loyaltyIconRight: {
    color: '#666'
  }
});

class PremiumInfo extends Component {
  static defaultProps = {
    indexTab: 0,
    siteId: ''
  };

  state = {
    index: this.props.indexTab,
    routes: [],
    currentPremium: null,
    refreshing: false,
    loading: true
  };
  getPremiumsRequest = new APIRequest();
  requests = [];

  get userInfo() {
    return store.user_info || {};
  }

  componentDidMount() {
    this.getPremiums();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getPremiums() {
    const { t } = this.props;
    const siteId =
      this.props.siteId || store.app_data ? store.app_data.id : store.store_id;
    try {
      this.getPremiumsRequest.data = APIHandler.get_premiums(siteId);
      const response = await this.getPremiumsRequest.promise();
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          const routes = this.routesFormatter(response.data.premiums);
          const currentPremium =
            routes.find(route => !!route.active) || this.state.index;
          const currentIndex = currentPremium
            ? routes.findIndex(route => route.id === currentPremium.id)
            : this.state.index;

          this.setState(
            {
              routes,
              currentPremium
            },
            () => {
              setTimeout(() =>
                this.setState({
                  index: currentIndex
                })
              );
            }
          );
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message')
        });
      }
    } catch (error) {
      console.log('%cget_premiums', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        refreshing: false,
        loading: false
      });
    }
  }

  routesFormatter(premiums = []) {
    return premiums.map(premium => ({
      key: premium.id,
      title: premium.name,
      ...premium
    }));
  }

  goToNews() {
    const userInfo = store.user_info || {};
    Actions.push(appConfig.routes.notifyDetail, {
      data: {
        id: userInfo.premium_post_id
      }
    });
  }

  handleRefresh() {
    this.setState({
      refreshing: true
    });

    this.getPremiums();
  }

  renderTabBarLabel({ focused, route: { title } }) {
    return (
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>
        {title}
      </Text>
    );
  }

  renderPremiumBenefitsHeader(premium) {
    const message =
      premium.point && premium.point > (this.userInfo.premium_point || 0)
        ? `Mở khóa hạng khi đạt đủ ${premium.point_view}`
        : this.state.currentPremium.id === premium.id
        ? 'Hạng hiện tại của bạn'
        : 'Đã mở khóa hạng';
    return <Text style={styles.premiumBenefitHeading}>{message}</Text>;
  }

  renderPremiumBenefit({ item: benefit }) {
    return (
      <BenefitRow
        active={benefit.unlock}
        title={benefit.name}
        description={benefit.describe}
      />
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
        renderLabel={this.renderTabBarLabel.bind(this)}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBarStyle}
        tabStyle={{ width: tabWidth }}
        scrollEnabled
      />
    );
  }

  renderScene({ route: premium }) {
    const benefits = premium.benefits || [];

    return (
      <FlatList
        extraData={benefits}
        contentContainerStyle={styles.sceneContainer}
        data={benefits}
        renderItem={this.renderPremiumBenefit.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
          />
        }
        ListHeaderComponent={this.renderPremiumBenefitsHeader(premium)}
        ListFooterComponent={
          <TouchableOpacity onPress={this.goToNews.bind(this)}>
            <Container row padding={15} style={styles.loyaltyContainer}>
              <Container.Item flex>
                <Text style={styles.loyaltyTitle}>
                  Chương trình khách hàng thân thiết
                </Text>
              </Container.Item>
              <FontAwesomeIcon
                name="chevron-right"
                style={styles.loyaltyIconRight}
              />
            </Container>
          </TouchableOpacity>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  render() {
    return (
      <PremiumInfoSkeleton loading={this.state.loading}>
        <View style={styles.container}>
          <SafeAreaView style={styles.container}>
            {this.state.loading && <Loading center />}
            {!!this.state.routes && (
              <TabView
                navigationState={this.state}
                renderTabBar={this.renderTabBar.bind(this)}
                renderScene={this.renderScene.bind(this)}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: appConfig.device.width }}
                style={styles.tabBarContainer}
              />
            )}
          </SafeAreaView>
        </View>
      </PremiumInfoSkeleton>
    );
  }
}

export default withTranslation()(PremiumInfo);
