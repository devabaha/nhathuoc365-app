import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
// 3-party libs
import {reaction} from 'mobx';
import {withTranslation} from 'react-i18next';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {isConfigActive} from 'app-helper/configKeyHandler';
import {mergeStyles} from 'src/Themes/helper';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
import {servicesHandler} from 'app-helper/servicesHandler';
import {updateEULAUserDecision} from 'app-helper';
// routing
import {pop, push, refresh, reset} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {NAV_BAR_HEIGHT} from 'src/constants';
// entities
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import HorizontalInfoItem from './HorizontalInfoItem';
import Loading from '../Loading';
import {
  Container,
  Typography,
  ScrollView,
  Input,
  Icon,
  ScreenWrapper,
  IconButton,
} from 'src/components/base';
import Button from 'src/components/Button';
import TextPressable from '../TextPressable';

class OpRegister extends Component {
  static contextType = ThemeContext;

  state = {
    name: this.props.name_props || '',
    // email: props.email_props || '',
    // password: props.password_props || '',
    refer: this.props.refer_props || store.refer_code,
    loading: false,
    isCityLoading: false,
    isWarehouseLoading: false,
    referCodeEditable:
      !isConfigActive(CONFIG_KEY.HIDE_REGISTER_REFERRAL_CODE_KEY) &&
      !store?.user_info?.invite_user_id &&
      !store?.refer_code,
    provinceSelected: {
      name: store.user_info ? store.user_info.city : '',
      id: store.user_info ? store.user_info.city_id : '',
    },
    warehouseSelected: {
      id: store?.user_info?.store_id,
      name: store?.user_info?.store_name,
    },
    licenseChecked: false,
    birth: store.user_info ? store.user_info.birth : '',
    cities: [],
    listWarehouse: [],

    eulaTextHeight: 0,
    containerHeight: 0,
  };

  updateReferCodeDisposer = reaction(
    () => store.refer_code,
    this.updateReferCode.bind(this),
  );

  eventTracker = new EventTracker();
  getUserCityRequest = new APIRequest();
  getWarehouseRequest = new APIRequest();
  requests = [this.getUserCityRequest, this.getWarehouseRequest];

  updateNavBarDisposer = () => {};

  unmounted = false;

  get theme() {
    return getTheme(this);
  }

  get isActiveCity() {
    return (
      isConfigActive(CONFIG_KEY.CHOOSE_CITY_SITE_KEY) &&
      this.state.cities.length !== 0
    );
  }

  get isActiveReferCode() {
    return !isConfigActive(CONFIG_KEY.HIDE_REGISTER_REFERRAL_CODE_KEY);
  }

  componentDidMount() {
    isConfigActive(CONFIG_KEY.CHOOSE_CITY_SITE_KEY) && this.getCities();
    // isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY) && this.getListWarehouse();
    refresh({
      onBack: () => {
        this._unMount();

        pop();
      },
    });

    // from confirm screen
    if (this.props.registerNow) {
      setTimeout(() => {
        this._onSave();
      }, 500);
    }
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.updateReferCodeDisposer();
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  _unMount() {
    Keyboard.dismiss();
  }

  _onSave() {
    let {name, refer, birth, provinceSelected, warehouseSelected} = this.state; //email, password, refer
    const {t} = this.props;
    name = name.trim();
    const city = provinceSelected.id;
    const store_id = warehouseSelected.id;
    refer = refer.trim();

    if (!name) {
      return Alert.alert(
        t('notification.name.title'),
        t('notification.name.message'),
        [
          {
            text: t('notification.name.accept'),
            onPress: () => {
              this.refs_name.focus();
            },
          },
        ],
        {cancelable: false},
      );
    }

    if (this.state.loading) {
      return;
    }

    this._op_register(name, refer, city, birth, store_id);
  }

  _op_register = (name, refer, city, birth, store_id) => {
    //, password, refer
    const data = {name, refer, city, birth, store_id};

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const response = await APIHandler.user_op_register(data);
          if (response?.status === STATUS_SUCCESS) {
            store.setUserInfo(response.data);
            updateEULAUserDecision();
            reset(appConfig.routes.sceneWrapper);
          }

          flashShowMessage({
            type: response?.status === STATUS_SUCCESS ? 'success' : 'danger',
            message:
              response?.status === STATUS_SUCCESS
                ? response?.message
                : response?.message || this.props.t('common:api.error.message'),
          });
        } catch (e) {
          console.log('op_register', error);
          flashShowMessage({
            type: 'danger',
            message: this.props.t('common:api.error.message'),
          });
        } finally {
          if (this.unmounted) return;

          this.setState({loading: false});
        }
      },
    );
  };

  async getCities() {
    this.setState({isCityLoading: true});
    const {t} = this.props;
    try {
      this.getUserCityRequest.data = APIHandler.user_site_city();
      const response = await this.getUserCityRequest.promise();
      if (this.unmounted) return;

      if (response.data && response.status === STATUS_SUCCESS) {
        let provinceSelected = this.state.provinceSelected;
        if (
          !this.state.provinceSelected.id &&
          response.data.cities.length > 0
        ) {
          provinceSelected = response.data.cities[0];
        } else {
          provinceSelected =
            response.data.cities.find(
              (city) => city.id == provinceSelected.id,
            ) || {};
        }
        this.setState({
          provinceSelected,
          cities: response.data.cities || [],
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response ? response.message : t('common:api.error.message'),
        });
      }
    } catch (err) {
      console.log('user get city', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;

      this.setState({isCityLoading: false});
    }
  }

  async getListWarehouse() {
    this.setState({isWarehouseLoading: true});
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
      let warehouseSelected = this.state.warehouseSelected;
      if (!this.state.warehouseSelected.id && listWarehouse.length > 0) {
        warehouseSelected = listWarehouse[0];
      } else {
        warehouseSelected =
          listWarehouse.find(
            (warehouse) => warehouse.id == warehouseSelected.id,
          ) || {};
      }
      this.setState({
        warehouseSelected,
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

  updateReferCode(refer_code) {
    if (refer_code) {
      this.setState(
        {
          refer: refer_code,
          referCodeEditable: false,
        },
        () => {
          store.setReferCode('');
        },
      );
    }
  }

  onPressSelectProvince = async () => {
    Keyboard.dismiss();
    push(
      appConfig.routes.voucherSelectProvince,
      {
        provinceSelected: this.state.provinceSelected.name,
        onSelectProvince: (provinceSelected) => {
          this.setState({provinceSelected});
        },
        onClose: pop,
        listCities: this.state.cities,
        dataKey: 'name',
        allOption: false,
      },
      this.theme,
    );
  };

  onCheckBox = () => {
    this.setState({licenseChecked: !this.state.licenseChecked});
  };

  onSelectedDate = (birth) => {
    this.setState({birth});
  };

  onSelectWarehouse = (warehouseSelected) => {
    this.setState({warehouseSelected});
  };

  onPressWarehouse = () => {
    Keyboard.dismiss();
    // push(appConfig.routes.modalList, {
    //   heading: this.props.t('modal.warehouse.title'),
    //   data: this.state.listWarehouse,
    //   selectedItem: this.state.warehouseSelected,
    //   onPressItem: this.onSelectWarehouse,
    //   onCloseModal: pop,
    //   modalStyle: {
    //     height: null,
    //     maxHeight: '80%',
    //   },
    // });
    servicesHandler({
      type: SERVICES_TYPE.GPS_LIST_STORE,
      theme: this.theme,
      selectedStore: this.state.warehouseSelected,
      placeholder: this.props.t('gpsStore:searchSalePointPlaceholder'),
      onPress: (store) => {
        pop();
        this.onSelectWarehouse(store);
      },
    });
  };

  onPressScanInvitationCode = () => {
    push(
      appConfig.routes.qrBarCode,
      {
        title: this.props.t('common:screen.qrBarCode.scanTitle'),
        index: 1,
        isVisibleTabBar: false,
        getQRCode: (result) => {
          this.setState({
            refer: result,
          });
        },
      },
      this.theme,
    );
  };

  handleLayoutEULAText = (e) => {
    if (e.nativeEvent.layout.height !== this.state.eulaTextHeight) {
      this.setState({eulaTextHeight: e.nativeEvent.layout.height});
    }
  };

  handleContainerLayout = (e) => {
    if (e.nativeEvent.layout.height > this.state.containerHeight) {
      this.setState({containerHeight: e.nativeEvent.layout.height});
    }
  };

  openEULAAgreement = () => {
    Keyboard.dismiss();

    servicesHandler({type: SERVICES_TYPE.EULA_AGREEMENT});
  };

  renderDOB() {
    if (isConfigActive(CONFIG_KEY.CHOOSE_BIRTH_SITE_KEY)) {
      const dobData = {
        id: 'ngay_sinh',
        title: (
          <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
            {this.props.t('data.birthdate.title')}{' '}
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={this.textRequiredStyle}>
              *
            </Typography>
          </Typography>
        ),
        value: this.state.birth,
        defaultValue: this.props.t('data.birthdate.defaultValue'),
        select: true,
      };

      return (
        <HorizontalInfoItem
          titleStyle={styles.input_label}
          containerStyle={this.infoContainerStyle}
          data={dobData}
          onSelectedDate={this.onSelectedDate}
        />
      );
    }

    return null;
  }

  renderCity() {
    if (this.isActiveCity) {
      const disable = !this.state.cities || this.state.cities.length === 0;
      const cityData = {
        title: (
          <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
            {this.props.t('data.province.title')}{' '}
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={this.textRequiredStyle}>
              *
            </Typography>
          </Typography>
        ),
        value:
          this.state.provinceSelected?.name ||
          this.props.t('data.province.placeholder'),
        isLoading: this.state.isCityLoading,
        select: true,
        disable,
      };

      return (
        <HorizontalInfoItem
          titleStyle={styles.input_label}
          containerStyle={this.infoContainerStyle}
          data={cityData}
          onSelectedValue={this.onPressSelectProvince}
        />
      );
    }

    return null;
  }

  renderWarehouse() {
    if (isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)) {
      const disable = false;
      // !this.state.listWarehouse || this.state.listWarehouse.length === 0;
      const wareHouseData = {
        title: (
          <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
            {this.props.t('data.chooseSalePoint.title')}{' '}
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={this.textRequiredStyle}>
              *
            </Typography>
          </Typography>
        ),
        value:
          this.state.warehouseSelected?.name ||
          this.props.t('data.chooseSalePoint.placeholder'),
        isLoading: this.state.isWarehouseLoading,
        select: true,
        disable,
      };

      if (!this.state.warehouseSelected?.name) {
        wareHouseData.rightTextStyle = {
          color: appConfig.colors.placeholder,
        };
      }

      return (
        <HorizontalInfoItem
          titleStyle={styles.input_label}
          containerStyle={this.infoContainerStyle}
          data={wareHouseData}
          onSelectedValue={this.onPressWarehouse}
        />
      );
    }

    return null;
  }

  renderTitleButton(titleStyle) {
    const {t} = this.props;
    return (
      <Container row noBackground style={[styles.address_continue_content]}>
        <View
          style={{
            minWidth: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            bundle={BundleIconSetName.FONT_AWESOME}
            name={this.state.edit_mode ? 'save' : 'user-plus'}
            style={[styles.iconContinue, titleStyle]}
          />
        </View>

        <Typography
          type={TypographyType.TITLE_SEMI_LARGE}
          style={[styles.address_continue_title, titleStyle]}>
          {this.state.edit_mode
            ? t('confirm.save.title')
            : t('confirm.register.title')}
        </Typography>
      </Container>
    );
  }

  extraReferCodeStyle =
    !this.state.referCodeEditable &&
    mergeStyles(styles.input_text_disabled, {
      borderColor: this.theme.color.onDisabled,
      color: this.theme.color.onDisabled,
    });

  inputIconContainerStyle = mergeStyles(styles.inputIconContainer, {
    borderColor: this.theme.color.persistPrimary,
    borderWidth: this.theme.layout.borderWidth,
  });

  textRequiredStyle = mergeStyles(styles.textRequired, {
    color: this.theme.color.danger,
  });

  inputBoxStyle = mergeStyles(styles.input_box, {
    borderBottomColor: this.theme.color.border,
    borderBottomWidth: this.theme.layout.borderWidthPixel,
  });

  referInputWrapperDisableStyle = mergeStyles(styles.referInputWrapperDisable, {
    backgroundColor: this.theme.color.disabled,
  });

  inputIconStyle = mergeStyles(styles.inputIcon, {
    color: this.theme.color.persistPrimary,
  });

  infoContainerStyle = mergeStyles(styles.infoContainer, {
    borderBottomWidth: this.theme.layout.borderWidthPixel,
    borderColor: this.theme.color.border,
  });

  btnContainerStyle = {
    borderTopWidth: this.theme.layout.borderWidth,
    borderColor: this.theme.color.border,
  };

  render() {
    const {
      name,
      email,
      loading,
      refer,
      birth,
      provinceSelected,
      warehouseSelected,
    } = this.state;
    const {t} = this.props;
    const disabled =
      !name ||
      (this.isActiveCity && !provinceSelected.id) ||
      (isConfigActive(CONFIG_KEY.CHOOSE_BIRTH_SITE_KEY) && !birth) ||
      (isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY) &&
        !warehouseSelected.id) ||
      (!isConfigActive(CONFIG_KEY.HIDE_REGISTER_REFERRAL_CODE_KEY) &&
        isConfigActive(CONFIG_KEY.NEED_INVITE_ID_FLAG) &&
        !store?.user_info?.invite_user_id &&
        !this.state.refer);

    const referCodeTitle = (
      <>
        {t('data.referCode.title')}{' '}
        {isConfigActive(CONFIG_KEY.NEED_INVITE_ID_FLAG) ? (
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={this.textRequiredStyle}>
            *
          </Typography>
        ) : (
          `(${t('data.referCode.optional')})`
        )}
      </>
    );

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper onLayout={this.handleContainerLayout}>
          {loading && <Loading center />}
          <View
            style={{
              height: this.state.containerHeight,
            }}>
            <ScrollView
              contentContainerStyle={
                {
                  // paddingBottom: store.keyboardTop + 60 + this.state.eulaTextHeight,
                }
              }
              keyboardShouldPersistTaps="handled">
              <Container style={this.inputBoxStyle}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={styles.input_label}>
                  {t('data.name.title')}{' '}
                  <Typography
                    type={TypographyType.LABEL_MEDIUM_TERTIARY}
                    style={this.textRequiredStyle}>
                    *
                  </Typography>
                </Typography>

                <Container style={styles.input_text_box}>
                  <Input
                    ref={(ref) => (this.refs_name = ref)}
                    style={styles.input_text}
                    keyboardType="default"
                    maxLength={30}
                    placeholder={t('data.name.placeholder')}
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        name: value,
                      });
                    }}
                    value={this.state.name}
                    onLayout={() => {
                      if (this.refs_name && !this.props.registerNow) {
                        setTimeout(() => this.refs_name.focus(), 300);
                      }
                    }}
                    onSubmitEditing={() => {
                      if (this.refs_refer) {
                        this.refs_refer.focus();
                      }
                    }}
                    returnKeyType="next"
                  />
                </Container>
              </Container>

              {this.renderDOB()}
              {this.renderCity()}
              {this.renderWarehouse()}

              {this.isActiveReferCode && (
                <>
                  <Container
                    style={[
                      this.inputBoxStyle,
                      styles.referInputWrapper,
                      !this.state.referCodeEditable &&
                        this.referInputWrapperDisableStyle,
                    ]}>
                    <Typography
                      type={TypographyType.LABEL_MEDIUM_TERTIARY}
                      style={[
                        styles.input_label,
                        styles.referInputLabel,
                        this.extraReferCodeStyle,
                      ]}>
                      {referCodeTitle}
                    </Typography>

                    <Container
                      noBackground
                      style={[
                        styles.input_text_box,
                        styles.referInputContainer,
                      ]}>
                      <Input
                        editable={this.state.referCodeEditable}
                        ref={(ref) => (this.refs_refer = ref)}
                        style={[
                          styles.input_text,
                          styles.referInput,
                          this.extraReferCodeStyle,
                        ]}
                        keyboardType="default"
                        maxLength={30}
                        placeholder={t('data.referCode.placeholder')}
                        underlineColorAndroid="transparent"
                        onChangeText={(value) => {
                          this.setState({
                            refer: value,
                          });
                        }}
                        value={this.state.refer}
                      />

                      <IconButton
                        disabled={!this.state.referCodeEditable}
                        hitSlop={HIT_SLOP}
                        onPress={this.onPressScanInvitationCode}
                        style={[
                          this.inputIconContainerStyle,
                          this.extraReferCodeStyle,
                        ]}
                        bundle={BundleIconSetName.FONT_AWESOME}
                        name="qrcode"
                        iconStyle={[
                          this.inputIconStyle,
                          this.extraReferCodeStyle,
                        ]}
                      />
                    </Container>
                  </Container>
                  {/* <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.disclaimerText}>
                {t('encourageMessage', {appName: APP_NAME_SHOW})}
              </Typography> */}
                </>
              )}
            </ScrollView>

            {!!this.state.containerHeight && (
              <Container
                shadow
                safeLayout={!store.keyboardTop}
                style={[
                  this.btnContainerStyle,
                  {
                    // bottom: store.keyboardTop,
                  },
                ]}>
                <View style={styles.eulaAgreementMessage}>
                  <Typography
                    type={TypographyType.LABEL_SMALL}
                    onLayout={this.handleLayoutEULAText}>
                    {t('common:agreeToEulaAgreement.prefix', {
                      title: t('confirm.register.title'),
                    })}
                    <TextPressable
                      type={TypographyType.LABEL_SEMI_MEDIUM_PRIMARY}
                      onPress={this.openEULAAgreement}
                      style={styles.eulaAgreementHighlightMessage}>
                      {t('common:eulaAgreement')}
                    </TextPressable>
                    {t('common:agreeToEulaAgreement.suffix')}
                  </Typography>
                </View>

                <Button
                  onPress={this._onSave.bind(this)}
                  disabled={disabled}
                  containerStyle={styles.address_continue}
                  renderTitleComponent={(titleStyle) =>
                    this.renderTitleButton(titleStyle)
                  }
                />
              </Container>
            )}
          </View>
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },
  input_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_text_box: {
    flex: 1,
    justifyContent: 'center',
  },
  input_label: {
    paddingHorizontal: 15,
  },
  input_text: {
    flex: 1,
    padding: 15,
    paddingVertical: 15,
    textAlign: 'right',
  },
  input_text_disabled: {},
  inputIconContainer: {
    marginHorizontal: 15,
    width: appConfig.device.isIOS ? 26 : 28,
    height: appConfig.device.isIOS ? 26 : 28,
    borderStyle: 'dashed',
    borderBottomLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: appConfig.device.isIOS ? 20 : 22,
    top: 1,
    left: 0.1,
  },

  address_continue: {},
  address_continue_content: {},
  address_continue_title: {
    marginLeft: 8,
  },

  disclaimerText: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  link: {
    textDecorationLine: 'underline',
  },

  placeDropDownIcon: {
    marginTop: 4,
  },
  btnDisabled: {},

  infoContainer: {
    marginRight: -5,
    paddingLeft: 15,
  },

  referInputWrapper: {
    flexDirection: undefined,
    alignItems: undefined,
  },
  referInputWrapperDisable: {},
  referInputLabel: {
    paddingTop: 15,
  },
  referInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referInput: {
    textAlign: 'left',
  },

  textRequired: {},
  iconContinue: {
    fontSize: 20,
  },
  eulaAgreementMessage: {
    padding: 15,
  },
  eulaAgreementHighlightMessage: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default withTranslation(['opRegister', 'common', 'gpsStore'])(
  observer(OpRegister),
);