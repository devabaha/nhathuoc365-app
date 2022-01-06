import React from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {TabView, TabBar} from 'react-native-tab-view';
import {withTranslation} from 'react-i18next';
import Loading from '@tickid/tickid-rn-loading';
// configs
import config from '../../config';
// network
import {internalFetch} from '../../helper/apiFetch';
// helpers
import {normalize} from '../../helper/normalizer';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import EventTracker from '../../../../helper/EventTracker';
// custom components
import PrepayContainer from '../Prepay';
import BuyCardContainer from '../BuyCard';
import KPlusPaidContainer from '../KPlusPaid';
import BaseContainer from '../BaseContainer';
import {ScreenWrapper, Typography, TypographyType} from 'src/components/base';

class PhoneCard extends BaseContainer {
  static contextType = ThemeContext;

  static defaultProps = {
    indexTab: 0,
  };

  state = {
    index: this.props.indexTab,
    routes: [],
    cardServiceData: {},
    isReady: false,
    refreshing: false,
  };

  updateNavBarDisposer = () => {};
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getPhoneCardServices();

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

  getPhoneCardServices = () => {
    internalFetch(config.rest.phoneCardService() + this.props.serviceId)
      .then((response) => {
        const {routes, ...normalizeData} = normalize(response.data);
        this.setState({
          routes,
          cardServiceData: normalizeData,
        });
      })
      .finally(() => {
        this.setState({
          isReady: true,
          refreshing: false,
        });
      });
  };

  renderTabBarLabel = ({focused, route: {title}}) => {
    return (
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        style={[
          styles.tabBarLabel,
          focused && [styles.tabBarLabelActive, this.tabBarLabelActiveStyle],
        ]}>
        {title}
      </Typography>
    );
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    });

    setTimeout(this.getPhoneCardServices, 1000);
  };

  renderScene = ({route}) => {
    const extraProps = {};
    extraProps.hideContact = true;

    switch (route.keyView) {
      case 'phone_paid':
        extraProps.errorEmptyMessage = this.props.t('enterPhoneNumber');
        extraProps.placeholder = this.props.t('enterPhoneNumberPlaceholder');

        return (
          <PrepayContainer
            prefix={this.props.t('prepayPrefix')}
            routeKey={route.key}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            {...this.state.cardServiceData}
            {...extraProps}
          />
        );
      // case 'internet_paid':
      //   extraProps.placeholder = this.props.t('enterAccountCode');
      //   extraProps.validLength = 9;
      //   extraProps.errorLengthMessage = this.props.t(
      //     'error.accountCodeMinLength',
      //     {minLength: extraProps.validLength},
      //   );
      //   extraProps.keyboardType = 'default';

      //   return (
      //     <PrepayContainer
      //       prefix={this.props.t('prepayPrefix')}
      //       routeKey={route.key}
      //       refreshing={this.state.refreshing}
      //       onRefresh={this.handleRefresh}
      //       {...this.state.cardServiceData}
      //       {...extraProps}
      //     />
      //   );
      case 'internet_paid':
        return (
          <BuyCardContainer
            routeKey={route.key}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            {...this.state.cardServiceData}
          />
        );
      case 'kplus_paid':
        extraProps.placeholder = this.props.t('enterAccountCode');
        extraProps.errorEmptyMessage = this.props.t(
          'enterAccountCodePlaceholder',
        );
        extraProps.validLength = 12;
        extraProps.errorLengthMessage = this.props.t(
          'error.accountCodeMinLength',
          {minLength: extraProps.validLength},
        );
        extraProps.keyboardType = 'number-pad';

        return (
          <KPlusPaidContainer
            routeKey={route.key}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            {...this.state.cardServiceData}
            {...extraProps}
          />
        );
      default:
        return null;
    }
  };

  get tabBarStyle() {
    return {
      backgroundColor: this.theme.color.surface,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    };
  }

  get indicatorStyle() {
    return {
      backgroundColor: this.theme.color.primaryHighlight,
    };
  }

  get tabBarLabelActiveStyle() {
    return {
      color: this.theme.color.primaryHighlight,
    };
  }

  render() {
    return (
      <ScreenWrapper>
        {this.state.isReady ? (
          <TabView
            navigationState={this.state}
            renderTabBar={(props) => {
              return (
                <TabBar
                  {...props}
                  renderLabel={this.renderTabBarLabel}
                  indicatorStyle={[styles.indicatorStyle, this.indicatorStyle]}
                  style={this.tabBarStyle}
                />
              );
            }}
            renderScene={this.renderScene}
            onIndexChange={(index) => this.setState({index})}
            initialLayout={{width: config.device.width}}
          />
        ) : (
          <Loading loading />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  tabBarLabel: {
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
  },
  indicatorStyle: {
    height: 3,
  },
});

export default withTranslation('phoneCard')(PhoneCard);
