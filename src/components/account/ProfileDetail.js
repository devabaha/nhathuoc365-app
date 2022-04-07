import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
// routing
import {refresh, reset, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import HorizontalInfoItem from './HorizontalInfoItem';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import {
  ScreenWrapper,
  Icon,
  IconButton,
  SectionList,
} from 'src/components/base';

class ProfileDetail extends Component {
  static contextType = ThemeContext;

  state = {
    logout_loading: false,
  };
  eventTracker = new EventTracker();
  unmounted = false;

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get sectionData() {
    const {t} = this.props;
    return [
      {
        id: 'id_section_1',
        data: [
          {
            id: 'ho_ten',
            title: t('sections.fullName.title'),
            value: store.user_info.name,
          },
          {
            id: 'so_dien_thoai',
            title: t('sections.phoneNumber.title'),
            value: store.user_info.tel,
          },
        ],
      },
      {
        id: 'id_section_2',
        data: [
          {
            id: 'ngay_sinh',
            title: t('sections.birthdate.title'),
            value: store.user_info.birth,
          },
          {
            id: 'gioi_tinh',
            title: t('sections.gender.title'),
            value: store.user_info.gender,
          },
          {
            id: 'email',
            title: t('sections.email.title'),
            value: store.user_info.email,
          },
        ],
      },
      {
        id: 'id_section_3',
        data: [
          {
            id: 'dia_chi',
            title: t('sections.address.title'),
            value: store.user_info.address,
          },
          // {
          //   id: 'thanh_pho',
          //   title: t('sections.city.title'),
          //   value: store.user_info.city,
          //   isHidden: !isConfigActive(CONFIG_KEY.CHOOSE_CITY_SITE_KEY)
          // },
        ],
      },
    ];
  }

  componentDidMount() {
    setTimeout(() =>
      refresh({
        right: this._renderRightButton,
      }),
    );
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

  _onShowEditProfile = () => {
    push(
      appConfig.routes.editProfile,
      {
        user_info: this.props.userInfo,
      },
      this.theme,
    );
  };

  handleLogout = () => {
    const {t} = this.props;

    Alert.alert(
      t('signOut.warningTitle'),
      t('signOut.warningDescription'),
      [
        {
          text: t('signOut.cancel'),
          onPress: () => {},
        },
        {
          text: t('signOut.title'),
          onPress: this.logout,
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  logout = async () => {
    this.setState({
      logout_loading: true,
    });
    try {
      const {t} = this.props;
      const response = await APIHandler.user_logout();
      switch (response.status) {
        case STATUS_SUCCESS:
          store.logOut(response.data);

          flashShowMessage({
            message: t('signOut.successMessage'),
            type: 'success',
          });
          reset(appConfig.routes.sceneWrapper);
          break;
        default:
          console.log(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      !this.unmounted &&
        this.setState({
          logout_loading: false,
        });
    }
  };

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({item, index, section}) => {
    return <HorizontalInfoItem data={item} />;
  };

  renderIconLogout = () => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="logout-variant"
        style={[styles.iconLogOut, this.iconStyle]}
      />
    );
  };

  _renderRightButton = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.FONT_AWESOME}
        name="edit"
        iconStyle={[styles.iconRightBtn, this.iconStyle]}
        style={styles.rightBtnEdit}
        underlayColor="transparent"
        onPress={this._onShowEditProfile}
        hitSlop={HIT_SLOP}
      />
    );
  };

  get iconStyle() {
    return {color: this.theme.color.white};
  }

  render() {
    const sections = this.sectionData;
    const {t} = this.props;

    return (
      <ScreenWrapper style={styles.container}>
        <SectionList
          safeLayout
          style={styles.sectionList}
          renderItem={this._renderItems}
          ListFooterComponent={() => (
            <Button
              neutral
              iconRight={this.renderIconLogout()}
              containerStyle={styles.logoutContainerStyle}
              titleStyle={styles.logoutTitleBtn}
              title={t('signOut.title')}
              onPress={this.handleLogout}
            />
          )}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          extraData={store.user_info}
        />
        {this.state.logout_loading && <Loading center />}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    width: '100%',
  },
  sectionList: {
    flex: 1,
  },
  logoutBtn: {
    alignSelf: 'center',
    width: '80%',
  },
  logoutTitleBtn: {},
  separatorSection: {
    width: '100%',
    height: 5,
  },
  logoutContainerStyle: {
    marginTop: 15,
  },
  separatorItem: {
    height: 1,
  },
  rightBtnEdit: {
    padding: 10,
  },
  iconLogOut: {
    fontSize: 24,
    position: 'absolute',
    right: 15,
    alignSelf: 'center',
  },
  iconRightBtn: {
    fontSize: 24,
  },
});

export default withTranslation('profileDetail')(observer(ProfileDetail));
