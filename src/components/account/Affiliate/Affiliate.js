/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {share} from 'app-helper/share';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import History from './History';
import Info from './Info';
import Loading from 'src/components/Loading';
import {
  Typography,
  Icon,
  FlatList,
  Container,
  BaseButton,
  ScreenWrapper,
} from 'src/components/base';

class Affiliate extends Component {
  static contextType = ThemeContext;

  // props.i18n.changeLanguage('en')
  state = {
    historiesData: null,
    content: this.props.aff_content
      ? this.props.aff_content
      : this.props.t('programInformationMessage', {appName: APP_NAME_SHOW}),
    activeTab: 0,
    loading: true,
  };

  unmounted = false;
  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this._getInviteList();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  async _getInviteList() {
    try {
      const response = await APIHandler.user_invite_history();
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          this.setState({historiesData: response.data?.histories});
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  }

  handleShare = (userInfo) => {
    share(null, userInfo.text_sms);
  };
  // _sms

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this.changeActiveTab(pageNum);
  }

  changeActiveTab = (activeTab) => {
    if (this.flatlist) {
      this.flatlist.scrollToIndex({index: activeTab, animated: true});
    }
    if (activeTab !== this.state.activeTab) {
      let state = this.state;
      state.activeTab = activeTab;
      this.setState({...state});
    }
  };

  renderTopLabelCoin() {
    const {user_info} = store;
    const {t} = this.props;

    return (
      <Container style={styles.add_store_actions_box}>
        <BaseButton
          useTouchableHighlight
          style={(styles.add_store_action_btn, {flex: 1})}>
          <View style={[styles.add_store_action_btn_box_balance]}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={[styles.add_store_action_label_balance]}>
              {/* <Icon name="slideshare" size={16} /> */}
              {t('header.referralCode.title')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={styles.add_store_action_content}>
              {user_info.username}
            </Typography>
          </View>
        </BaseButton>
        <BaseButton
          onPress={() => this.handleShare(user_info)}
          style={styles.add_store_action_btn}>
          <View style={this.rightButtonHeaderStyle}>
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="share-alt"
              size={22}
            />
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.add_store_action_label}>
              {t('header.share.title')}
            </Typography>
          </View>
        </BaseButton>
      </Container>
    );
  }

  get rightButtonHeaderStyle() {
    return [
      styles.add_store_action_btn_box,
      {
        borderLeftWidth: this.theme.layout.borderWidthPixel,
        borderColor: this.theme.color.border,
      },
    ];
  }

  get headerContainerStyle() {
    return [
      styles.add_store_actions_box,
      {
        borderBottomWidth: this.theme.layout.borderWidthPixel,
        borderColor: this.theme.color.border,
      },
    ];
  }

  get tabContentContainerStyle() {
    return [
      styles.tabHeaderContainer,
      {
        borderBottomColor: this.theme.color.border,
        borderBottomWidth: this.theme.layout.borderWidth,
      },
    ];
  }

  get activeTabStyle() {
    return [
      styles.activeTab,
      {
        borderBottomColor: this.theme.color.primaryHighlight,
      },
    ];
  }

  get tabRightSeparatorStyle() {
    return {
      borderRightColor: this.theme.color.border,
      borderRightWidth: this.theme.layout.borderWidth,
    };
  }

  render() {
    const {activeTab, content, historiesData} = this.state;
    const {t} = this.props;
    const data = [
      {
        key: 0,
        title: t('tab.referralList.title'),
        component: (
          <History loading={this.state.loading} historyData={historiesData} />
        ),
      },
      // {
      //   key: 1,
      //   title: 'Nạp tiền',
      //   component: <Recharge />
      // },
      // {
      //   key: 2,
      //   title: 'Rút tiền',
      //   component: <Withdraw />
      // },
      {
        key: 1,
        title: t('tab.programInformation.title'),
        component: <Info loading={this.state.loading} content={content} />,
      },
    ];
    const tabHeader = data.map((d, i) => (
      <BaseButton
        useTouchableHighlight
        key={d.key}
        underlayColor="transparent"
        style={[
          styles.tabContainer,
          d.key === activeTab && this.activeTabStyle,
        ]}
        onPress={this.changeActiveTab.bind(this, d.key)}>
        <View style={[i !== data.length - 1 && this.tabRightSeparatorStyle]}>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[
              styles.tabLabel,
              d.key === activeTab && {fontWeight: 'bold'},
            ]}>
            {d.title}
          </Typography>
        </View>
      </BaseButton>
    ));

    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        {this.renderTopLabelCoin()}
        <Container style={this.tabContentContainerStyle}>{tabHeader}</Container>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={(ref) => (this.flatlist = ref)}
          data={data}
          keyExtractor={(item) => item.key.toString()}
          horizontal={true}
          pagingEnabled
          style={{
            width: appConfig.device.width,
          }}
          onMomentumScrollEnd={this._onScrollEnd.bind(this)}
          getItemLayout={(data, index) => {
            return {
              length: appConfig.device.width,
              offset: appConfig.device.width * index,
              index,
            };
          }}
          renderItem={({item, index}) => {
            return item.component;
          }}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  add_store_action_btn: {
    paddingVertical: 5,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    width: ~~(appConfig.device.width / 4),
  },
  add_store_action_btn_box_balance: {
    alignItems: 'center',
    width: ~~(appConfig.device.width / 2),
    paddingHorizontal: 15,
  },
  add_store_action_label: {
    marginTop: 4,
  },
  add_store_action_label_balance: {
    marginTop: 4,
    fontWeight: '600',
    width: '100%',
  },
  add_store_action_content: {
    marginTop: 5,
    fontWeight: '800',
    width: '100%',
  },
  tabHeaderContainer: {
    flexDirection: 'row',
  },
  tabLabel: {
    textAlign: 'center',
  },
  tabContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 4,
  },
});

export default withTranslation('affiliate')(observer(Affiliate));
