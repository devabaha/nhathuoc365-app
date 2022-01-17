import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {reaction} from 'mobx';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// network
import BaseAPI from 'src/network/API/BaseAPI';
// helpers
import {setAppLanguage} from 'src/i18n/i18n';
import {servicesHandler} from 'app-helper/servicesHandler';
import {isConfigActive} from 'app-helper/configKeyHandler';
import {getValueFromConfigKey} from 'app-helper/configKeyHandler/configKeyHandler';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {openLink, saveTheme} from 'app-helper';
import {isActivePackageOptionConfig} from 'app-helper/packageOptionsHandler';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {languages} from 'src/i18n/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {PACKAGE_OPTIONS_TYPE} from 'app-helper/packageOptionsHandler';
import {BASE_LIGHT_THEME} from 'src/Themes/Theme.light';
import {BASE_DARK_THEME, BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';
// entities
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import Sticker from 'src/components/Sticker';
import SelectionList from 'src/components/SelectionList';
import SkeletonLoading from 'src/components/SkeletonLoading';
import CustomAutoHeightWebview from 'src/components/CustomAutoHeightWebview';
import IconAngleRight from './IconAngleRight';
import Loading from 'src/components/Loading';
import Image from 'src/components/Image';
import {
  BaseButton,
  Container,
  Typography,
  Icon,
  ScrollView,
  ScreenWrapper,
  RefreshControl,
} from 'src/components/base';

const FACEBOOK_DOMAIN = 'https://facebook.com/';

class Account extends Component {
  static contextType = ThemeContext;

  state = {
    listWarehouse: [],
    isWarehouseLoading: false,
    refreshing: false,
    logout_loading: false,
    sticker_flag: false,
    avatar_loading: false,
  };
  uploadFaceIDRequest = new APIRequest();
  requests = [this.uploadFaceIDRequest];
  userInfoDisposer = reaction(
    () => store.user_info,
    (userInfo) => this.initial(userInfo),
  );
  eventTracker = new EventTracker();
  getWarehouseRequest = new APIRequest();
  updateWarehouseRequest = new APIRequest();
  requests = [this.getWarehouseRequest];
  unmounted = false;

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get options() {
    const {t, i18n} = this.props;
    const isAdmin = store.user_info.admin_flag == 1;
    const isTestDevice = !!store.user_info.is_test_device;
    var notify = store.notify;
    const isUpdate = notify.updating_version == 1;
    const codePushVersion = store.codePushMetaData
      ? // replace non-digit character in codePush label (format of codePush label is `v[number]`)
        `-${store.codePushMetaData.label.replace(/\D+/, '')}`
      : '';
    const user_info = store.user_info || {};
    const default_wallet = user_info.default_wallet || {};
    const revenue_commissions = user_info.revenue_commissions || {};
    const {
      premium,
      premium_name,
      premium_info,
      premium_point_unit,
      premium_color = this.theme.color.premium,
      premium_point = 10000,
      next_premium_point = 15000,
      store_id,
      store_name,
      username,
    } = user_info;
    const isShowPremium =
      premium !== undefined && !isConfigActive(CONFIG_KEY.HIDE_PREMIUM_TAB_KEY);
    const facebookFanpage = getValueFromConfigKey(CONFIG_KEY.FACEBOOK_FANPAGE);
    const isShowPremiumPoint = !isConfigActive(
      CONFIG_KEY.HIDE_PREMIUM_POINT_KEY,
    );

    return [
      {
        key: '-99',
        icon: 'web',
        label: 'Domain',
        desc: BaseAPI.apiDomain,
        rightIcon: <IconAngleRight />,
        onPress: () =>
          push(appConfig.routes.domainSelector, {
            back: true,
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          styles.boxIconDomainSelector,
          {backgroundColor: this.theme.color.accountDomain},
        ],
        iconColor: this.iconColor,
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        isHidden: !isTestDevice,
      },

      {
        key: 'premium',
        icon: 'crown',
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        label: premium_name,
        labelStyle: [
          styles.premiumLabel,
          {
            color: premium_color,
          },
        ],
        desc:
          !isConfigActive(CONFIG_KEY.HIDE_PREMIUM_POINT_KEY) && premium_info,
        descStyle: [
          this.theme.typography[TypographyType.DESCRIPTION_SMALL],
          {color: this.theme.color.onSurface},
        ],
        rightIcon: this.renderRightPremium(
          isShowPremiumPoint ? premium_point : null,
          premium_point_unit,
        ),
        renderAfter: () =>
          this.renderProgressPremium(
            premium_point,
            next_premium_point,
            premium_color,
          ),
        onPress: () => push(appConfig.routes.premiumInfo, {}, this.theme),
        boxIconStyle: this.premiumBoxIconStyle,
        iconColor: this.theme.color.accountPremium,
        iconSize: 20,
        wrapperStyle: this.premiumContainerStyle,
        containerStyle: styles.premiumContainer,
        separatorStyle: {marginBottom: 8},
        isHidden: !isShowPremium,
      },

      {
        key: 'default_wallet',
        icon: default_wallet.icon,
        label: (
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={styles.profile_list_label}>
            {default_wallet.name}:{' '}
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={[
                styles.profile_list_label_balance,
                {color: default_wallet.color},
              ]}>
              {default_wallet.balance_view}
            </Typography>
          </Typography>
        ),
        isHidden:
          !user_info.default_wallet ||
          isConfigActive(CONFIG_KEY.VIEW_COMMISSIONS_AT_HOMEPAGE) ||
          isConfigActive(CONFIG_KEY.HIDE_WALLET_ACCOUNT_KEY),

        rightIcon: <IconAngleRight />,
        onPress: () => {
          servicesHandler({type: SERVICES_TYPE.WALLET, theme: this.theme});
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor:
              default_wallet.color || this.theme.color.accountDefaltWallet,
          },
        ],
        iconColor: this.iconColor,
        iconType: default_wallet.iconType,
        marginTop: !isShowPremium,
      },

      {
        key: 'revenue_commissions',
        icon: 'clipboard',
        iconColor: this.iconColor,
        size: 22,
        iconSize: 14,
        marginTop: 10,
        labelProps: {
          numberOfLines: 1,
        },
        desProps: {
          numberOfLines: 1,
        },
        label: (
          <>
            {!!revenue_commissions?.this_month_commissions?.title &&
              `${revenue_commissions.this_month_commissions.title}: `}
            <Typography type={TypographyType.LABEL_LARGE_PRIMARY}>
              {revenue_commissions?.this_month_commissions?.value}
            </Typography>
          </>
        ),
        desc: (
          <>
            {!!revenue_commissions?.last_month_commissions?.title &&
              `${revenue_commissions.last_month_commissions.title}: `}
            <Typography type={TypographyType.DESCRIPTION_SMALL_PRIMARY}>
              {revenue_commissions?.last_month_commissions?.value}
            </Typography>
          </>
        ),

        rightIcon: <IconAngleRight />,
        onPress: () =>
          push(appConfig.routes.commissionIncomeStatement, {}, this.theme),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountRevenueCommissions,
          },
        ],
        isHidden:
          !user_info.revenue_commissions ||
          !isConfigActive(CONFIG_KEY.VIEW_COMMISSIONS_AT_HOMEPAGE),
      },

      {
        key: 'wallets',
        isHidden: !!!user_info.wallets,
        render: this.renderWallets,
      },
      {
        key: 'ext_wallets',
        isHidden: !!!user_info.ext_wallets,
        render: this.renderExtWallets,
      },

      {
        key: 'affiliate',
        icon: 'commenting-o',
        label: (
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={styles.profile_list_label}>
            {`${t('referralCode')}: `}
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={[
                styles.profile_list_label_invite_id,
                {color: this.theme.color.accountAffiliate},
              ]}>
              {user_info.username}
            </Typography>
          </Typography>
        ),
        desc: user_info.text_invite,
        isHidden:
          !user_info.username ||
          isConfigActive(CONFIG_KEY.HIDE_AFFILIATE_ACCOUNT_KEY),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          push(
            appConfig.routes.affiliate,
            {
              title: t('common:screen.affiliate.mainTitle'),
              aff_content: store.store_data
                ? store.store_data.aff_content
                : t('affiliateMarketingProgram', {
                    appName: APP_NAME_SHOW,
                  }),
            },
            this.theme,
          );
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountAffiliate,
          },
        ],
        iconColor: this.iconColor,
      },
      {
        key: 'store',
        isHidden: !isActivePackageOptionConfig(
          PACKAGE_OPTIONS_TYPE.CHAIN_STORE,
        ),
        leftIcon: (
          <View>
            <Icon
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              name="store"
              style={{fontSize: 15, left: -3, top: 2, color: this.iconColor}}
            />
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="map-marker"
              style={{
                fontSize: 16,
                color: this.iconColor,
                position: 'absolute',
                right: -3,
                top: 0,
                backgroundColor: 'transparent',
              }}
            />
          </View>
        ),
        label: t('options.changeStoreLocation.label'),
        desc: store.store_data.name,
        rightIcon: <IconAngleRight />,
        onPress: () => push(appConfig.routes.gpsStoreLocation, {}, this.theme),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountStore,
          },
        ],
      },
      // {
      //   key: 'orders',
      //   label: t('options.orders.label'),
      //   desc: t('options.orders.desc'),
      //   leftIcon: (
      //     <View>
      //       <IconMaterialCommunity
      //         name="cart"
      //         style={{fontSize: 16, color: '#fff'}}
      //       />
      //     </View>
      //   ),
      //   rightIcon: <IconAngleRight />,
      //   onPress: () => servicesHandler({type: SERVICES_TYPE.ORDERS}),
      //   boxIconStyle: [
      //     styles.boxIconStyle,
      //     {
      //       backgroundColor: appConfig.colors.status.success,
      //     },
      //   ],
      //   iconColor: '#ffffff',
      // },
      {
        key: 'vouchers',
        isHidden:
          !isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.VOUCHERS) ||
          isConfigActive(CONFIG_KEY.HIDE_VOUCHERS_ACCOUNT_KEY),
        label: t('options.myVoucher.label'),
        desc: t('options.myVoucher.desc'),
        leftIcon: (
          <View>
            <Icon
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              name="sale"
              style={{fontSize: 16, color: this.iconColor}}
            />
          </View>
        ),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          push(
            appConfig.routes.myVoucher,
            {
              title: t('common:screen.myVoucher.mainTitle'),
              from: 'home',
            },
            this.theme,
          ),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountVoucher,
          },
        ],
        iconColor: this.iconColor,
      },
      {
        key: 'address',
        icon: 'map-marker',
        label: t('options.myAdress.label'),
        desc: t('options.myAdress.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          push(
            appConfig.routes.myAddress,
            {
              from_page: 'account',
            },
            this.theme,
          ),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountAddress,
          },
        ],
        iconColor: this.iconColor,
        marginTop: !!premium_name,
      },

      {
        key: 'gold_member',
        icon: 'clipboard-text-multiple',
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        iconColor: this.iconColor,
        size: 22,
        iconSize: 14,
        label: t('options.agencyInformationRegister.label'),
        desc: t('options.agencyInformationRegister.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          servicesHandler({
            type: SERVICES_TYPE.AGENCY_INFORMATION_REGISTER,
            theme: this.theme,
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountGoldMember,
          },
        ],
        isHidden: !isConfigActive(CONFIG_KEY.DISPLAY_NPP_REGISTER_KEY),
      },
      {
        key: 'warehouse',
        icon: 'warehouse',
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        label: t('options.salePoint.label'),
        desc: store_name,
        disabled: this.state.isWarehouseLoading,
        rightIcon: this.state.isWarehouseLoading ? (
          <Loading
            wrapperStyle={{position: undefined, marginRight: -10}}
            size="small"
          />
        ) : (
          <IconAngleRight />
        ),
        onPress: () =>
          servicesHandler({
            type: SERVICES_TYPE.GPS_LIST_STORE,
            theme: this.theme,
            selectedStore: {id: store_id},
            placeholder: this.props.t('gpsStore:searchSalePointPlaceholder'),
            onPress: (store) => {
              this.onSelectWarehouse(store);
              pop();
            },
          }),
        // Actions.push(appConfig.routes.modalList, {
        //   heading: this.props.t('opRegister:modal.store.title'),
        //   data: this.state.listWarehouse,
        //   selectedItem: {id: store_id},
        //   onPressItem: this.onSelectWarehouse,
        //   onCloseModal: Actions.pop,
        //   modalStyle: {
        //     height: null,
        //     maxHeight: '80%',
        //   },
        // }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountWarehouse,
          },
        ],
        iconColor: this.iconColor,
        isHidden:
          !username || !isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY),
      },

      {
        key: 'commission_income_statement',
        icon: 'clipboard',
        iconColor: this.iconColor,
        size: 22,
        iconSize: 14,
        label: t('options.commissionIncomeStatement.label'),
        desc: t('options.commissionIncomeStatement.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          push(appConfig.routes.commissionIncomeStatement, {}, this.theme),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountCommissionIncome,
          },
        ],
        isHidden:
          !username || !isConfigActive(CONFIG_KEY.DISPLAY_COMMISSION_KEY),
      },

      {
        key: 'report_npp',
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        icon: 'script-text',
        iconColor: this.iconColor,
        size: 22,
        iconSize: 14,
        label: t('options.salesReport.label'),
        desc: t('options.salesReport.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => push(appConfig.routes.salesReport, {}, this.theme),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountSaleReport,
          },
        ],
        isHidden:
          !username || !isConfigActive(CONFIG_KEY.DISPLAY_COMMISSION_KEY),
      },

      {
        key: 'reset_pass',
        isHidden:
          !isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.TRANSACTION_PASS) ||
          !store.user_info ||
          !store.user_info.tel,
        icon: 'lock-reset',
        label: t('options.resetPassword.label'),
        desc: t('options.resetPassword.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          push(appConfig.routes.resetPassword, {}, this.theme);
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountResetPassword,
          },
        ],
        iconColor: this.iconColor,
        iconSize: 18,
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        marginTop: true,
      },

      {
        key: '2',
        icon: 'facebook-square',
        label: t('options.fanpage.label', {appName: APP_NAME_SHOW}),
        desc: t('options.fanpage.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          openLink(FACEBOOK_DOMAIN + facebookFanpage);
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountFacebookFanpage,
          },
        ],
        iconColor: this.iconColor,
        marginTop: !isAdmin,
        isHidden: !facebookFanpage,
      },

      {
        key: '3',
        icon: 'info',
        label: t('options.termsOfUse.label'),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          servicesHandler({
            type: SERVICES_TYPE.NEWS_DETAIL,
            news: {
              title: t('options.termsOfUse.webViewTitle'),
              id: getValueFromConfigKey(CONFIG_KEY.ABOUT_US_ID),
            },
            theme: this.theme,
          });
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountAboutUs,
          },
        ],
        iconColor: this.iconColor,
        isHidden: !getValueFromConfigKey(CONFIG_KEY.ABOUT_US_ID),
        // marginTop: true
      },

      {
        key: '4',
        icon: 'text-box-check-outline',
        iconType: BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
        label: t('options.termsOfUse.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          servicesHandler({
            type: SERVICES_TYPE.NEWS_CATEGORY_VERTICAL,
            title: t('options.termsOfUse.desc'),
            id: getValueFromConfigKey(CONFIG_KEY.TERMS_OF_USE_ID),
            theme: this.theme,
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountTermOfUse,
          },
        ],
        iconColor: this.iconColor,
        isHidden: !getValueFromConfigKey(CONFIG_KEY.TERMS_OF_USE_ID),
        // marginTop: true
      },
      {
        key: 'partnerRegistration',
        icon: 'handshake-o',
        label: t('options.partnerRegistration.label'),
        isHidden: !getValueFromConfigKey(
          CONFIG_KEY.PARTNER_REGISTRATION_LINK_KEY,
        ),

        rightIcon: <IconAngleRight />,
        onPress: () => {
          openLink(
            getValueFromConfigKey(CONFIG_KEY.PARTNER_REGISTRATION_LINK_KEY),
          );
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#5b88d9',
          },
        ],
        iconColor: '#fff',
      },

      {
        key: '7',
        icon: 'language',
        label: t('options.language.label'),
        desc: languages[i18n.language].label,
        marginTop: !store.user_info || !store.user_info.tel,
        rightIcon: <View></View>,
        onPress: () => {
          push(appConfig.routes.modalPicker, {
            title: t('options.language.label'),
            cancelTitle: t('options.language.cancel'),
            selectTitle: t('options.language.select'),
            selectedValue: this.props.i18n.language,
            selectedLabel: languages[this.props.i18n.language].label,
            data: Object.values(languages),
            onSelect: this.handleConfirmChangeAppLanguage,
          });
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountLanguage,
          },
        ],
        iconColor: this.iconColor,
        marginTop: true,
      },
      {
        key: 'theme',
        icon: 'color-palette',
        iconType: BundleIconSetName.IONICONS,
        label: 'Theme',
        rightIcon: <View></View>,
        onPress: () => {
          this.context.toggleTheme(BASE_DARK_THEME_ID);
          saveTheme(
            this.theme.id === BASE_DARK_THEME_ID
              ? BASE_LIGHT_THEME
              : BASE_DARK_THEME,
          );
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.onContentBackground,
          },
        ],
        iconColor: this.theme.color.contentBackgroundWeak,
      },

      {
        key: 'app_info',
        icon: 'question',
        label: t('options.appInformation.label'),
        desc: t('options.appInformation.desc', {
          appName: APP_NAME_SHOW,
          appVersion:
            DeviceInfo.getVersion() +
            codePushVersion +
            '-' +
            appConfig.tagVersion,
        }),
        rightIcon: <IconAngleRight />,
        onPress: () => {},
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountAppInfo,
          },
        ],
        iconColor: this.iconColor,
        hideAngle: true,
        marginTop: true,
        disabled: true,
      },
      {
        key: 'app_update',
        isHidden: !isUpdate,
        icon: 'cloud-download',
        label: t('options.appUpdate.label'),
        desc: t('options.appUpdate.desc', {
          newVersion: notify.new_version,
        }),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          if (notify.url_update) {
            openLink(notify.url_update);
          }
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: this.theme.color.accountAppUpdate,
          },
        ],
        notify: 'updating_version',
        iconColor: this.iconColor,
      },
    ];
  }

  initial = (callback) => {
    const {t, i18n} = this.props;
    const isAdmin = store.user_info.admin_flag == 1;
    var notify = store.notify;
    const isUpdate = notify.updating_version == 1;

    this.setState({}, () => {
      if (typeof callback == 'function') {
        callback();
      }
    });
  };

  handleShowLanguagePicker = () => {
    this.setState({showLanguagePicker: true});
  };

  handleCloseLanguagePicker = () => {
    this.setState({showLanguagePicker: false});
  };

  onRefresh() {
    this.setState({refreshing: true}, () => {
      this.login(1000);
      // this.getListWarehouse();
    });
  }

  showSticker() {
    this.setState(
      {
        sticker_flag: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            sticker_flag: false,
          });
        }, 2000);
      },
    );
  }

  onTapAvatar() {
    const {t} = this.props;

    const options = {
      cameraType: 'front',
      rotation: 360,
      title: t('avatarPicker.title'),
      cancelButtonTitle: t('avatarPicker.cancelTitle'),
      takePhotoButtonTitle: t('avatarPicker.takePhotoTitle'),
      chooseFromLibraryButtonTitle: t('avatarPicker.chooseFromLibraryTitle'),
      storageOptions: {
        // skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
      } else {
        if (!response.fileName) {
          response.fileName = new Date().getTime();
          if (response.type) {
            response.fileName += '.' + response.type.split('image/')[1];
          } else {
            response.fileName += '.jpeg';
          }
        }
        this.uploadAvatar(response);
        // this.uploadFaceID(response);
      }
    });
  }

  async uploadFaceID(image) {
    this.setState({avatar_loading: true});
    const siteId = this.props.siteId || store.store_id;
    const uploadImageBase64 = 'data:' + image.type + ';base64,' + image.data;
    const data = {
      image1: uploadImageBase64,
      image2: uploadImageBase64,
      image3: uploadImageBase64,
    };
    try {
      this.uploadFaceIDRequest.data = APIHandler.site_upload_image_faceID(
        siteId,
        data,
      );
      const response = await this.uploadFaceIDRequest.promise();
      // console.log(response);
      flashShowMessage({
        type: response.status === STATUS_SUCCESS,
        message: response.message,
      });
    } catch (err) {
      console.log('upload faceid', err);
    } finally {
      this.setState({avatar_loading: false});
    }
  }

  uploadAvatar(response) {
    this.setState(
      {
        avatar_loading: true,
      },
      () => {
        const avatar = {
          name: 'avatar',
          filename: response.fileName,
          data: response.data,
        };
        // call api post my form data
        RNFetchBlob.fetch(
          'POST',
          APIHandler.url_user_add_avatar(),
          {
            'Content-Type': 'multipart/form-data',
          },
          [avatar, {name: 'site_id', data: store.store_data?.id}],
        )
          .then((resp) => {
            if (this.unmounted) return;

            var {data} = resp;
            var response = JSON.parse(data);
            if (response && response.status == STATUS_SUCCESS) {
              this.showSticker();
            } else {
              flashShowMessage({
                type: 'danger',
                message:
                  response.message || this.props.t('common:api.error.message'),
              });
            }
          })
          .catch((error) => {
            console.log(error);
            flashShowMessage({
              type: 'danger',
              message: this.props.t('common:api.error.message'),
            });
          })
          .finally(() => {
            if (this.unmounted) return;
            this.setState({
              avatar_loading: false,
            });
          });
      },
    );
  }

  componentDidMount() {
    // this.getListWarehouse();
    this.initial(() => {
      store.is_stay_account = true;
      store.parentTab = `${appConfig.routes.accountTab}_1`;
    });
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.userInfoDisposer();
    this.eventTracker.clearTracking();
    cancelRequests(this.requests);

    this.updateNavBarDisposer();
  }

  async getListWarehouse() {
    if (!isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)) return;
    const {t} = this.props;
    try {
      this.getWarehouseRequest.data = APIHandler.user_site_store();
      const responseData = await this.getWarehouseRequest.promise();
      if (this.unmounted) return;

      const listWarehouse =
        responseData?.stores?.map((store) => ({
          ...store,
          title: store.name,
          description: store.address,
          image: store.image_url,
        })) || [];
      this.setState({
        listWarehouse,
      });
    } catch (err) {
      console.log('user get warehouse', err);
      flashShowMessage({
        type: 'danger',
        message: err.message || t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({isWarehouseLoading: false});
    }
  }

  login = async (delay) => {
    try {
      var response = await APIHandler.user_login({
        fb_access_token: '',
      });

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          store.setUserInfo(response.data);
          store.setOrdersKeyChange(store.orders_key_change + 1);

          if (this.unmounted) return;
          this.setState({
            refreshing: false,
          });
        }, delay || 0);
      }
    } catch (error) {
      console.log('login', error);
    }
  };

  async updateWarehouse(warehouse) {
    const data = {store_id: warehouse.id};
    try {
      this.updateWarehouseRequest.data = APIHandler.user_choose_store(data);
      if (this.unmounted) return;

      const responseData = await this.updateWarehouseRequest.promise();
      flashShowMessage({
        type: 'success',
        message: responseData.message,
      });
    } catch (error) {
      console.log('%cupdate_warehouse', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message || this.props.t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({isWarehouseLoading: false});
    }
  }

  onSelectWarehouse = (warehouse) => {
    this.setState({isWarehouseLoading: true});
    this.updateWarehouse(warehouse);
  };

  handleShowProfileDetail = () => {
    servicesHandler({
      type: SERVICES_TYPE.PERSONAL_PROFILE,
      isMainUser: true,
      title: store.user_info?.name,
    });
  };

  handleLogin = () => {
    push(appConfig.routes.phoneAuth);
  };

  handleConfirmChangeAppLanguage = (languageValue) => {
    const selectedLanguage = {
      languageTag: languages[languageValue].value,
      isRTL: languages[languageValue].isRTL,
      locale: languages[languageValue].locale,
    };
    setAppLanguage(this.props.i18n, selectedLanguage);
  };

  renderWallets = () => {
    const user_info = store.user_info || {wallets: []};
    return (
      <View key="wallets">
        <Container style={this.walletContainerStyle}>
          {user_info.wallets.map((wallet, index) => (
            <BaseButton
              key={index}
              onPress={
                wallet.address
                  ? () =>
                      servicesHandler({
                        type: SERVICES_TYPE.WALLET,
                        name: wallet.name,
                        zone_code: wallet.zone_code,
                        theme: this.theme,
                      })
                  : () => {}
              }
              useTouchableHighlight
              style={styles.add_store_action_btn}>
              <View style={this.walletContentContainerStyle}>
                <View style={styles.add_store_action_wallet}>
                  <Typography
                    type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                    style={styles.add_store_action_wallet_text}>
                    <Icon
                      bundle={BundleIconSetName.FONT_AWESOME}
                      name={wallet.icon}
                      style={{fontSize: 16, color: wallet.color}}
                    />{' '}
                    {wallet.name}
                  </Typography>
                </View>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={[
                    styles.add_store_action_wallet_content,
                    {color: wallet.color},
                  ]}>
                  {wallet.balance_view}
                </Typography>
              </View>
            </BaseButton>
          ))}
        </Container>
      </View>
    );
  };

  renderExtWallets = () => {
    const user_info = store.user_info || {ext_wallets: []};
    return (
      <View key="extra_wallets">
        <Container style={this.walletContainerStyle}>
          {user_info.ext_wallets.map((wallet, index) => (
            <BaseButton
              useTouchableHighlight
              key={index}
              onPress={
                wallet.address
                  ? () =>
                      servicesHandler({
                        type: SERVICES_TYPE.WALLET,
                        name: wallet.name,
                        zone_code: wallet.zone_code,
                        theme: this.theme,
                      })
                  : () => {}
              }
              style={styles.add_store_action_btn}>
              <View style={this.walletContentContainerStyle}>
                <View style={styles.add_store_action_wallet}>
                  <Typography style={styles.add_store_action_wallet_text}>
                    <Icon
                      bundle={BundleIconSetName.FONT_AWESOME}
                      name={wallet.icon}
                      style={{fontSize: 16, color: wallet.color}}
                    />{' '}
                    {wallet.name}
                  </Typography>
                </View>
                <Typography
                  style={[
                    styles.add_store_action_wallet_content,
                    {color: wallet.color},
                  ]}>
                  {wallet.balance_view}
                </Typography>
              </View>
            </BaseButton>
          ))}
        </Container>
      </View>
    );
  };

  renderRightPremium = (point, unit) => {
    const isShowPoint = point !== undefined && point !== null;

    return (
      <View style={this.rightPremiumContainerStyle}>
        {isShowPoint && (
          <Typography
            type={TypographyType.LABEL_TINY}
            style={styles.rightPremiumLabel}>
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={styles.rightPremiumHighlight}>
              {numberFormat(+point)}
            </Typography>{' '}
            {unit}
          </Typography>
        )}
        <View style={styles.rightPremiumIconContainer}>
          <IconAngleRight />
        </View>
      </View>
    );
  };

  renderProgressPremium = (point, nextPoint, backgroundColor) => {
    const premiumRatio = point / nextPoint;
    const isMax = premiumRatio >= 1;
    const width = isMax ? '100%' : `${premiumRatio * 100}%`;
    const extraStyle = isMax
      ? {}
      : {
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
        };

    return (
      <View style={this.premiumProgressContainerStyle}>
        <SkeletonLoading
          highlightOpacity={0.8}
          highlightMainDuration={2000}
          highlightColor={LightenColor(backgroundColor, 40)}
          style={{
            backgroundColor,
            ...extraStyle,
          }}
          width={width}
          height="100%"
        />
      </View>
    );
  };

  get avatarContainerStyle() {
    return [styles.profile_avatar_box, styles.profile_avatar_box_container];
  }

  get iconColor() {
    return this.theme.color.white;
  }

  get premiumContainerStyle() {
    return {
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  get premiumBoxIconStyle() {
    return [
      styles.boxIconStyle,
      {
        backgroundColor: this.theme.color.contentBackgroundWeak,
        borderWidth: this.theme.layout.borderWidthSmall,
        borderColor: this.theme.color.border,
      },
    ];
  }

  get rightPremiumContainerStyle() {
    return [
      styles.rightPremiumContainer,
      {
        backgroundColor: this.theme.color.contentBackgroundWeak,
      },
    ];
  }

  get premiumProgressContainerStyle() {
    return [
      styles.premiumProgressContainer,
      {
        backgroundColor: this.theme.color.grey600,
      },
    ];
  }

  get walletContainerStyle() {
    return [
      styles.add_store_actions_box,
      {
        borderBottomWidth: this.theme.layout.borderWidthPixel,
        borderColor: this.theme.color.border,
      },
    ];
  }

  get walletContentContainerStyle() {
    return [
      styles.add_store_action_btn_box,
      {
        borderRightWidth: this.theme.layout.borderWidthPixel,
        borderColor: this.theme.color.border,
      },
    ];
  }

  get footerSiteContainerStyle() {
    return [
      styles.footerSiteContainer,
      {
        backgroundColor: this.theme.color.surface,
        borderColor: this.theme.color.persistPrimary,
      },
    ];
  }

  render() {
    const {user_info = {}} = store;
    const is_login =
      store.user_info != null && store.user_info.username != null;
    const {avatar_loading, logout_loading} = this.state;
    const {t} = this.props;
    const siteContentValue = getValueFromConfigKey(CONFIG_KEY.SITE_CONTENT_KEY);

    return (
      <ScreenWrapper>
        <ScrollView
          ref={(ref) => (this.refs_account = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
            // <RefreshControl
            //   refreshing={this.state.refreshing}
            //   onRefresh={this.onRefresh.bind(this)}
            // />
          }>
          <>
            {is_login ? (
              <Container>
                <BaseButton
                  useTouchableHighlight
                  onPress={this.handleShowProfileDetail}
                  style={[
                    styles.profile_list_opt_btn,
                    styles.profile_user_container,
                  ]}>
                  <>
                    <BaseButton
                      useTouchableHighlight
                      disabled={!!avatar_loading}
                      onPress={this.onTapAvatar.bind(this)}
                      style={this.avatarContainerStyle}>
                      <View>
                        <View style={styles.profile_avatar_box}>
                          {avatar_loading ? (
                            <View style={styles.profile_avatar}>
                              <Indicator size="small" />
                            </View>
                          ) : (
                            <Image
                              mutable
                              resizeMode="cover"
                              source={{
                                uri: store.user_info ? store.user_info.img : '',
                              }}
                            />
                          )}
                        </View>

                        {/* {!!user_info.is_verified ? (
                        <Icon
                          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                          name="check-decagram"
                          style={[
                            styles.verifiedIcon,
                            {
                              color: '#499108'
                            }
                          ]}
                        />
                      ) : (
                        <Icon
                          name="exclamation-circle"
                          style={[
                            styles.verifiedIcon,
                            {
                              color: '#ea8e0c'
                            }
                          ]}
                        />
                      )} */}
                      </View>
                    </BaseButton>

                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        paddingRight: 25,
                      }}>
                      <View>
                        <Typography
                          type={TypographyType.LABEL_HUGE}
                          style={[styles.profile_list_label]}
                          numberOfLines={1}>
                          {user_info.name}
                        </Typography>

                        <Typography
                          type={TypographyType.LABEL_MEDIUM_TERTIARY}
                          style={[styles.profile_list_small_label]}>
                          {user_info.tel}
                        </Typography>
                        {/* {!!!user_info.is_verified && (
                        <Text
                          style={[
                            styles.profile_list_small_label,
                            {
                              fontSize: 10,
                              marginTop: 5,
                              fontStyle: 'italic'
                            }
                          ]}
                        >
                          Tài khoản của bạn chưa được xác thực, vui lòng cập
                          nhật ảnh đại diện để xác thực!
                        </Text>
                      )} */}
                      </View>
                      <View
                        style={[
                          styles.profile_list_icon_box,
                          styles.profile_list_icon_box_angle,
                          {marginRight: 0},
                        ]}>
                        <IconAngleRight />
                      </View>
                    </View>
                  </>
                </BaseButton>
              </Container>
            ) : (
              <Container>
                <BaseButton
                  style={styles.profile_user_container}
                  useTouchableHighlight
                  onPress={this.handleLogin}>
                  <>
                    <Icon
                      bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                      name="account-circle"
                      neutral
                      style={styles.signInLeftIcon}
                    />
                    <View style={styles.profile_button_login_box}>
                      <Typography
                        type={TypographyType.LABEL_LARGE_PRIMARY}
                        style={[styles.profile_button_title]}>
                        {t('signIn')}
                      </Typography>
                    </View>
                    <Icon
                      bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                      name="login-variant"
                      neutral
                      style={styles.signInRightIcon}
                    />
                  </>
                </BaseButton>
              </Container>
            )}
          </>

          {this.options && (
            <SelectionList
              useList={false}
              containerStyle={styles.listOptionsContainer}
              data={this.options}
            />
          )}

          {!!siteContentValue && (
            <CustomAutoHeightWebview
              content={siteContentValue}
              containerStyle={this.footerSiteContainerStyle}
              customStyle={`body {
                overflow-x: hidden;
              }`}
            />
          )}
        </ScrollView>

        <Sticker
          active={this.state.sticker_flag}
          message={t('avatarPicker.messageUpdateSuccessfully')}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  boxIconStyle: {
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15,
  },
  profile_user_container: {
    width: '100%',
    alignItems: 'center',
    height: null,
    paddingVertical: 15,
    paddingLeft: 15,
    flexDirection: 'row',
  },
  profile_avatar_box_container: {
    marginRight: 15,
  },
  profile_avatar_box: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile_avatar: {
    width: '100%',
    height: '100%',
  },
  verifiedIcon: {
    fontSize: 15,
    position: 'absolute',
    bottom: -2,
    right: 0,
    ...elevationShadowStyle(1),
  },

  profile_button_login_box: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 15,
  },
  profile_button_title: {
    fontWeight: 'bold',
  },
  signInLeftIcon: {
    margin: -5,
    fontSize: 46,
  },
  signInRightIcon: {
    position: 'absolute',
    right: 15,
    alignSelf: 'center',
    fontSize: 24,
  },
  profile_list_opt_btn: {
    width: appConfig.device.width,
    height: 52,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4,
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
  },
  profile_list_label: {
    fontWeight: '400',
  },
  profile_list_label_balance: {
    fontWeight: '600',
    left: 20,
  },

  profile_list_label_invite_id: {
    fontWeight: '600',
  },
  profile_list_small_label: {
    marginTop: 5,
  },

  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
  },
  add_store_action_btn: {
    paddingVertical: 12,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(appConfig.device.width / 2),
  },
  add_store_action_wallet_text: {
    marginLeft: 0,
    marginTop: 3,
  },
  add_store_action_wallet_content: {
    fontWeight: '700',
  },
  add_store_action_wallet: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // paddingVertical: 8,
    paddingHorizontal: 8,
    // marginRight: 8
  },
  premiumContainer: {
    height: null,
    minHeight: 80,
    paddingTop: 12,
    paddingBottom: 15,
  },
  premiumLabel: {
    fontFamily: 'SairaStencilOne-Regular',
    // fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 1,
  },
  rightPremiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    paddingVertical: 3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
    marginRight: -15,
  },
  rightPremiumLabel: {
    marginLeft: 10,
    marginRight: -5,
  },
  rightPremiumHighlight: {
    fontWeight: '500',
  },
  rightPremiumIconContainer: {
    marginLeft: 15,
  },
  premiumProgressContainer: {
    width: '100%',
    height: 3,
    position: 'absolute',
    bottom: 0,
  },
  footerSiteContainer: {
    paddingVertical: 12,
    borderTopWidth: 3,
  },
  listOptionsContainer: {
    paddingVertical: 8,
  },
});

export default withTranslation(['account', 'common', 'opRegister', 'gpsStore'])(
  observer(Account),
);
