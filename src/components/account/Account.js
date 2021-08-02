import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Picker,
  Easing,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../../store/Store';
import RNFetchBlob from 'rn-fetch-blob';
import Sticker from '../Sticker';
import {reaction} from 'mobx';
import SelectionList from '../SelectionList';
import appConfig from 'app-config';
import {languages} from '../../i18n/constants';
import {setAppLanguage} from '../../i18n/i18n';
import {APIRequest} from '../../network/Entity';
import {
  isActivePackageOptionConfig,
  PACKAGE_OPTIONS_TYPE,
} from '../../helper/packageOptionsHandler';
import EventTracker from '../../helper/EventTracker';
import SkeletonLoading from '../SkeletonLoading';
import BaseAPI from '../../network/API/BaseAPI';
import Loading from '../Loading';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import {getValueFromConfigKey} from 'app-helper/configKeyHandler/configKeyHandler';
import CustomAutoHeightWebview from '../CustomAutoHeightWebview';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listWarehouse: [],
      isWarehouseLoading: true,
      refreshing: false,
      logout_loading: false,
      sticker_flag: false,
      avatar_loading: false,
    };
    this.uploadFaceIDRequest = new APIRequest();
    this.requests = [this.uploadFaceIDRequest];
    reaction(() => store.user_info, this.initial);
    this.eventTracker = new EventTracker();
    this.getWarehouseRequest = new APIRequest();
    this.updateWarehouseRequest = new APIRequest();
    this.requests = [this.getWarehouseRequest];
    this.unmounted = false;
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
      premium_color = '#80AB82',
      // #fafafa, #95acc5, #80AB82, #d2d2e4, #f0b64a, #1eb7dc,
      premium_point = 10000,
      next_premium_point = 15000,
      store_id,
      store_name,
      username,
    } = user_info;
    const isShowPremium =
      premium !== undefined && !isConfigActive(CONFIG_KEY.HIDE_PREMIUM_TAB_KEY);

    return [
      {
        key: '-99',
        icon: 'web',
        label: 'Domain',
        desc: BaseAPI.apiDomain,
        isHidden: !isTestDevice,
        rightIcon: <IconAngleRight />,
        onPress: () =>
          Actions.push(appConfig.routes.domainSelector, {
            back: true,
          }),
        boxIconStyle: [styles.boxIconStyle, styles.boxIconDomainSelector],
        iconColor: '#ffffff',
        iconType: 'MaterialCommunityIcons',
      },

      {
        key: 'premium',
        icon: 'crown',
        iconType: 'MaterialCommunityIcons',
        label: premium_name,
        labelStyle: [
          styles.premiumLabel,
          {
            color: premium_color,
          },
        ],
        desc: premium_info,
        descStyle: {
          color: '#ccc',
        },
        rightIcon: this.renderRightPremium(premium_point, premium_point_unit),
        renderAfter: () =>
          this.renderProgressPremium(
            premium_point,
            next_premium_point,
            premium_color,
          ),
        onPress: () => Actions.push(appConfig.routes.premiumInfo),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#fff',
            borderWidth: 0.5,
            borderColor: '#ccc',
          },
        ],
        iconColor: '#2fc5c5',
        iconSize: 20,
        containerStyle: styles.premiumContainer,
        isHidden: !isShowPremium,
      },

      {
        key: 'default_wallet',
        icon: default_wallet.icon,
        label: (
          <Text style={styles.profile_list_label}>
            {default_wallet.name}:{' '}
            <Text
              style={[
                styles.profile_list_label_balance,
                {color: default_wallet.color},
              ]}>
              {default_wallet.balance_view}
            </Text>
          </Text>
        ),
        isHidden:
          !user_info.default_wallet ||
          isConfigActive(CONFIG_KEY.VIEW_COMMISSIONS_AT_HOMEPAGE),

        rightIcon: <IconAngleRight />,
        onPress: () => {
          Actions.push(appConfig.routes.vndWallet, {
            title: default_wallet.name,
            wallet: default_wallet,
          });
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: default_wallet.color,
          },
        ],
        iconColor: '#fff',
        iconType: default_wallet.iconType,
        marginTop: isShowPremium,
      },

      {
        key: 'revenue_commissions',
        icon: 'clipboard',
        iconColor: '#FFFFFF',
        size: 22,
        iconSize: 14,
        marginTop: 10,
        label: (
          <>
            {this.renderRevenueCommission(
              revenue_commissions?.this_month_commissions?.title,
              revenue_commissions?.this_month_commissions?.value,
            )}

            {this.renderRevenueCommission(
              revenue_commissions?.last_month_commissions?.title,
              revenue_commissions?.last_month_commissions?.value,
            )}
          </>
        ),
        rightIcon: <IconAngleRight />,
        onPress: () => Actions.push(appConfig.routes.commissionIncomeStatement),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#FD6D61',
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
          <Text style={styles.profile_list_label}>
            {`${t('referralCode')}: `}
            <Text style={styles.profile_list_label_invite_id}>
              {user_info.username}
            </Text>
          </Text>
        ),
        desc: user_info.text_invite,
        isHidden: !user_info.username,
        rightIcon: <IconAngleRight />,
        onPress: () => {
          Actions.affiliate({
            title: t('common:screen.affiliate.mainTitle'),
            aff_content: store.store_data
              ? store.store_data.aff_content
              : t('affiliateMarketingProgram', {
                  appName: APP_NAME_SHOW,
                }),
          });
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#51A9FF',
          },
        ],
        iconColor: '#fff',
      },
      {
        key: 'store',
        isHidden: !isActivePackageOptionConfig(
          PACKAGE_OPTIONS_TYPE.CHAIN_STORE,
        ),
        leftIcon: (
          <View>
            <IconMaterialCommunity
              name="store"
              style={{fontSize: 15, left: -3, top: 2, color: '#fff'}}
            />
            <Icon
              name="map-marker"
              style={{
                fontSize: 16,
                color: '#fff',
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
        onPress: () => Actions.push(appConfig.routes.gpsStoreLocation),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#f66',
          },
        ],
      },
      {
        key: 'orders',
        label: t('options.orders.label'),
        desc: t('options.orders.desc'),
        leftIcon: (
          <View>
            <IconMaterialCommunity
              name="cart"
              style={{fontSize: 16, color: '#fff'}}
            />
          </View>
        ),
        rightIcon: <IconAngleRight />,
        onPress: () => servicesHandler({type: SERVICES_TYPE.ORDERS}),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: appConfig.colors.status.success,
          },
        ],
        iconColor: '#ffffff',
      },
      {
        key: 'vouchers',
        isHidden: !isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.VOUCHERS),
        label: t('options.myVoucher.label'),
        desc: t('options.myVoucher.desc'),
        leftIcon: (
          <View>
            <IconMaterialCommunity
              name="sale"
              style={{fontSize: 16, color: '#fff'}}
            />
          </View>
        ),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          Actions.push(appConfig.routes.myVoucher, {
            title: t('common:screen.myVoucher.mainTitle'),
            from: 'home',
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#ffc3c0',
          },
        ],
        iconColor: '#ffffff',
      },
      {
        key: 'address',
        icon: 'map-marker',
        label: t('options.myAdress.label'),
        desc: t('options.myAdress.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          Actions.push(appConfig.routes.myAddress, {
            from_page: 'account',
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#fcb309',
          },
        ],
        iconColor: '#ffffff',
        marginTop: !!premium_name,
      },

      {
        key: 'gold_member',
        icon: 'clipboard-text-multiple',
        iconType: 'MaterialCommunityIcons',
        iconColor: '#ffffff',
        size: 22,
        iconSize: 14,
        label: t('options.agencyInformationRegister.label'),
        desc: t('options.agencyInformationRegister.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => Actions.push(appConfig.routes.agencyInformationRegister),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#527c23',
          },
        ],
        isHidden: !isConfigActive(CONFIG_KEY.DISPLAY_NPP_REGISTER_KEY),
      },
      {
        key: 'warehouse',
        icon: 'warehouse',
        iconType: 'MaterialCommunityIcons',
        label: t('options.warehouse.label'),
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
          Actions.push(appConfig.routes.modalList, {
            heading: this.props.t('opRegister:modal.warehouse.title'),
            data: this.state.listWarehouse,
            selectedItem: {id: store_id},
            onPressItem: this.onSelectWarehouse,
            onCloseModal: Actions.pop,
            modalStyle: {
              height: null,
              maxHeight: '80%',
            },
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#3c6c7d',
          },
        ],
        iconColor: '#ffffff',
        isHidden: !username || !isConfigActive(CONFIG_KEY.SELECT_STORE_KEY),
      },

      {
        key: 'commission_income_statement',
        icon: 'clipboard',
        iconColor: '#ffffff',
        size: 22,
        iconSize: 14,
        label: t('options.commissionIncomeStatement.label'),
        desc: t('options.commissionIncomeStatement.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => Actions.push(appConfig.routes.commissionIncomeStatement),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#fd6d61',
          },
        ],
        isHidden:
          !username || !isConfigActive(CONFIG_KEY.DISPLAY_COMMISSION_KEY),
      },

      {
        key: 'report_npp',
        iconType: 'MaterialCommunityIcons',
        icon: 'script-text',
        iconColor: '#ffffff',
        size: 22,
        iconSize: 14,
        label: t('options.salesReport.label'),
        desc: t('options.salesReport.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => Actions.push(appConfig.routes.salesReport),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#72d4d3',
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
          Actions.push(appConfig.routes.resetPassword);
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#888',
          },
        ],
        iconColor: '#fff',
        iconSize: 18,
        iconType: 'MaterialCommunityIcons',
        marginTop: true,
      },

      {
        key: '2',
        icon: 'facebook-square',
        label: t('options.fanpage.label', {appName: APP_NAME_SHOW}),
        desc: t('options.fanpage.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () => Communications.web(APP_FANPAGE),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#4267b2',
          },
        ],
        iconColor: '#ffffff',
        marginTop: !isAdmin,
      },

      {
        key: '3',
        icon: 'handshake-o',
        label: t('options.termsOfUse.label'),
        rightIcon: <IconAngleRight />,
        onPress: () => {
          servicesHandler({
            type: SERVICES_TYPE.NEWS_DETAIL,
            news: {
              title: t('options.termsOfUse.webViewTitle'),
              id: getValueFromConfigKey(CONFIG_KEY.ABOUT_US_ID),
            },
          });
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: DEFAULT_COLOR,
          },
        ],
        iconColor: '#ffffff',
        isHidden: !getValueFromConfigKey(CONFIG_KEY.ABOUT_US_ID),
        // marginTop: true
      },

      {
        key: '4',
        icon: 'text-box-check-outline',
        iconType: 'MaterialCommunityIcons',
        label: t('options.termsOfUse.desc'),
        rightIcon: <IconAngleRight />,
        onPress: () =>
          servicesHandler({
            type: SERVICES_TYPE.NEWS_CATEGORY_VERTICAL,
            title: t('options.termsOfUse.desc'),
            id: getValueFromConfigKey(CONFIG_KEY.TERMS_OF_USE_ID),
          }),
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#62459b',
          },
        ],
        iconColor: '#ffffff',
        isHidden: !getValueFromConfigKey(CONFIG_KEY.TERMS_OF_USE_ID),
        // marginTop: true
      },

      {
        key: '7',
        icon: 'language',
        label: t('options.language.label'),
        desc: languages[i18n.language].label,
        marginTop: !store.user_info || !store.user_info.tel,
        rightIcon: <View></View>,
        onPress: () => {
          Actions.push(appConfig.routes.modalPicker, {
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
            backgroundColor: '#175189',
          },
        ],
        iconColor: '#ffffff',
        marginTop: true,
      },

      {
        key: 'app_info',
        icon: 'question-circle',
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
            backgroundColor: '#688efb',
          },
        ],
        iconColor: '#ffffff',
        hideAngle: true,
        marginTop: true,
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
            Communications.web(notify.url_update);
          }
        },
        boxIconStyle: [
          styles.boxIconStyle,
          {
            backgroundColor: '#dd4b39',
          },
        ],
        notify: 'updating_version',
        iconColor: '#ffffff',
      },
    ];
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
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
      this.getListWarehouse();
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
    this.getListWarehouse();
    this.initial(() => {
      store.is_stay_account = true;
      store.parentTab = `${appConfig.routes.accountTab}_1`;
    });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    cancelRequests(this.requests);
  }

  async getListWarehouse() {
    if (!isConfigActive(CONFIG_KEY.SELECT_STORE_KEY)) return;
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

  onSelectWarehouse = (warehouse, closeModal) => {
    this.setState({isWarehouseLoading: true});
    closeModal();
    this.updateWarehouse(warehouse);
  };

  handleShowProfileDetail = () => {
    Actions.push(appConfig.routes.profileDetail, {
      userInfo: store.user_info,
    });
    // Actions.push(appConfig.routes.personalProfile, {
    //   isMainUser: true
    // });
  };

  handleLogin = () => {
    Actions.push(appConfig.routes.phoneAuth);
  };

  handleConfirmChangeAppLanguage = (languageValue) => {
    const selectedLanguage = {
      languageTag: languages[languageValue].value,
      isRTL: languages[languageValue].isRTL,
      locale: languages[languageValue].locale,
    };
    setAppLanguage(this.props.i18n, selectedLanguage);
  };

  renderWallets() {
    const user_info = store.user_info || {wallets: []};
    return (
      <View
        key="wallets"
        style={{
          // marginTop: 7,
          borderTopWidth: 0,
          borderColor: '#dddddd',
        }}>
        <View style={styles.add_store_actions_box}>
          {user_info.wallets.map((wallet, index) => (
            <TouchableHighlight
              key={index}
              onPress={
                wallet.address
                  ? () =>
                      Actions.push(appConfig.routes.vndWallet, {
                        title: wallet.name,
                        wallet: wallet,
                      })
                  : () => {}
              }
              underlayColor="transparent"
              style={styles.add_store_action_btn}>
              <View style={styles.add_store_action_btn_box}>
                <View style={styles.add_store_action_wallet}>
                  <Text style={styles.add_store_action_wallet_text}>
                    <Icon name={wallet.icon} size={16} color={wallet.color} />{' '}
                    {wallet.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.add_store_action_wallet_content,
                    {color: wallet.color},
                  ]}>
                  {wallet.balance_view}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    );
  }

  renderExtWallets() {
    const user_info = store.user_info || {ext_wallets: []};
    return (
      <View key="extra_wallets">
        <View style={styles.add_store_actions_box}>
          {user_info.ext_wallets.map((wallet, index) => (
            <TouchableHighlight
              key={index}
              onPress={
                wallet.address
                  ? () =>
                      Actions.push(appConfig.routes.vndWallet, {
                        title: wallet.name,
                        wallet: wallet,
                      })
                  : () => Actions.view_ndt_list()
              }
              underlayColor="transparent"
              style={styles.add_store_action_btn}>
              <View style={styles.add_store_action_btn_box}>
                <View style={styles.add_store_action_wallet}>
                  <Text style={styles.add_store_action_wallet_text}>
                    <Icon name={wallet.icon} size={16} color={wallet.color} />{' '}
                    {wallet.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.add_store_action_wallet_content,
                    {color: wallet.color},
                  ]}>
                  {wallet.balance_view}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </View>
    );
  }

  renderRightPremium(point, unit) {
    const isShowPoint = point !== undefined && point !== null;

    return (
      <View style={styles.rightPremiumContainer}>
        {isShowPoint && (
          <Text style={styles.rightPremiumLabel}>
            <Text style={styles.rightPremiumHighlight}>
              {numberFormat(+point)}
            </Text>{' '}
            {unit}
          </Text>
        )}
        <View style={styles.rightPremiumIconContainer}>
          <IconAngleRight />
        </View>
      </View>
    );
  }

  renderProgressPremium(point, nextPoint, backgroundColor) {
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
      <View style={styles.premiumProgressContainer}>
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
  }

  renderRevenueCommission(label, value) {
    return (
      <View style={styles.viewRevenueCommissions}>
        <Text style={styles.titleRevenueCommissions}>{label}:</Text>
        <Text style={styles.valueRevenueCommissions}>{value}</Text>
      </View>
    );
  }

  render() {
    const {user_info = {}} = store;
    const is_login =
      store.user_info != null && store.user_info.username != null;
    const {avatar_loading, logout_loading} = this.state;
    const {t} = this.props;
    const siteContentValue = getValueFromConfigKey(CONFIG_KEY.SITE_CONTENT_KEY);

    return (
      <View style={styles.container}>
        <ScrollView
          ref={(ref) => (this.refs_account = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          <>
            {is_login ? (
              <TouchableHighlight
                onPress={this.handleShowProfileDetail}
                style={[
                  styles.profile_list_opt_btn,
                  styles.profile_user_container,
                  {flex: 1, flexDirection: 'row'},
                ]}
                underlayColor="rgba(255,255,255,.7)">
                <>
                  <TouchableHighlight
                    onPress={this.onTapAvatar.bind(this)}
                    style={[
                      styles.profile_avatar_box,
                      styles.profile_avatar_box_container,
                    ]}
                    underlayColor="transparent">
                    <>
                      <View style={styles.profile_avatar_box}>
                        {avatar_loading ? (
                          <View style={{width: '100%', height: '100%'}}>
                            <Indicator size="small" />
                          </View>
                        ) : (
                          <CachedImage
                            mutable
                            style={styles.profile_avatar}
                            source={{
                              uri: store.user_info ? store.user_info.img : '',
                            }}
                          />
                        )}
                      </View>

                      {/* {!!user_info.is_verified ? (
                        <IconMaterialCommunity
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
                    </>
                  </TouchableHighlight>

                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                      paddingRight: 25,
                    }}>
                    <View>
                      <Text
                        style={[
                          styles.profile_list_label,
                          {
                            fontSize: 18,
                          },
                        ]}
                        numberOfLines={1}>
                        {user_info.name}
                      </Text>

                      <Text
                        style={[
                          styles.profile_list_small_label,
                          {
                            fontSize: 14,
                            marginTop: 5,
                          },
                        ]}>
                        {user_info.tel}
                      </Text>
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
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={[
                  styles.profile_user_container,
                  {
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    // paddingVertical: 10,
                    // paddingBottom: 0,
                  },
                ]}
                underlayColor="rgba(255,255,255,.7)"
                onPress={this.handleLogin}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <IconMaterialCommunity
                    name="account-circle"
                    size={46}
                    color="#c7c7cd"
                    style={{margin: -5}}
                  />
                  <View
                    style={[
                      styles.profile_button_login_box,
                      {
                        backgroundColor: 'transparent',
                      },
                    ]}>
                    <Text style={[styles.profile_button_title]}>
                      {t('signIn')}
                    </Text>
                  </View>
                  <IconMaterialCommunity
                    name="login-variant"
                    size={24}
                    color="#999999"
                    style={{
                      position: 'absolute',
                      right: 15,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              </TouchableHighlight>
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
              containerStyle={styles.footerSiteContainer}
              contentStyle={styles.footerSiteContent}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
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
  },
  profile_avatar_box_container: {
    marginRight: 15,
  },
  profile_avatar_box: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profile_avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedIcon: {
    fontSize: 15,
    position: 'absolute',
    bottom: -2,
    right: 0,
    ...elevationShadowStyle(1),
  },

  point_icon: {
    width: 30,
    height: 30,
  },
  profile_button_box: {
    bottom: 42,
    right: 0,
    flexDirection: 'row',
  },
  profile_button_login_box: {
    backgroundColor: appConfig.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 15,
  },
  profile_button_title: {
    fontSize: 16,
    color: DEFAULT_COLOR,
    fontWeight: 'bold',
  },
  profile_list_opt: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
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

  profile_list_icon_box_small: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    marginLeft: 3,
    marginRight: 0,
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
  },
  profile_list_label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  profile_list_label_balance: {
    fontSize: 18,
    color: '#922B21',
    fontWeight: '600',
    left: 20,
  },
  profile_list_label_address: {
    fontSize: 16,
    color: '#0E6655',
    fontWeight: '600',
  },

  profile_list_label_point: {
    fontSize: 16,
    color: '#e31b23',
    fontWeight: '600',
  },

  profile_list_label_invite_id: {
    fontSize: 16,
    color: '#51A9FF',
    fontWeight: '600',
  },
  profile_list_small_label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd',
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  profile_list_balance_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 30,
    marginLeft: 4,
    marginRight: 4,
  },
  profile_list_balance_box_angle: {
    position: 'absolute',
    top: 0,
    right: 20,
  },

  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  add_store_action_btn: {
    paddingVertical: 4,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ddd',
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4,
  },
  add_store_action_wallet_text: {
    fontSize: 14,
    color: '#404040',
    marginLeft: 0,
    marginTop: 3,
  },
  add_store_action_wallet_content: {
    fontSize: 16,
    color: '#333333',
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
    backgroundColor: '#242424',
    paddingTop: 12,
    paddingBottom: 15,
    ...elevationShadowStyle(4),
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
    backgroundColor: '#f6f6f6',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
    marginRight: -15,
  },
  rightPremiumLabel: {
    marginLeft: 10,
    marginRight: -5,
    color: '#242424',
    fontSize: 10,
  },
  rightPremiumHighlight: {
    fontWeight: '500',
    fontSize: 12,
  },
  rightPremiumIconContainer: {
    marginLeft: 15,
  },
  boxIcon_domainSelector: {
    backgroundColor: '#333',
  },
  premiumProgressContainer: {
    width: '100%',
    backgroundColor: '#555',
    height: 5,
    position: 'absolute',
    bottom: 0,
    elevation: 4,
  },
  footerSiteContainer: {
    paddingVertical: 12,
    borderColor: appConfig.colors.primary,
    borderTopWidth: 3,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  footerSiteContent: {
    width: appConfig.device.width - 24,
  },
  listOptionsContainer: {
    paddingVertical: 8,
  },
  viewRevenueCommissions: {
    flexDirection: 'row',
    marginBottom: -6,
  },
  titleRevenueCommissions: {
    marginVertical: appConfig.device.isIOS ? 4 : 3,
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  valueRevenueCommissions: {
    width: '100%',
    marginVertical: appConfig.device.isIOS ? 2 : 0,
    marginHorizontal: 5,
    fontSize: 16,
    color: appConfig.colors.primary,
    fontWeight: '600',
  },
});

export default withTranslation(['account', 'common', 'opRegister'])(
  observer(Account),
);

const IconAngleRight = () => (
  <Icon name="angle-right" size={26} color="#999999" />
);
