import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {reaction} from 'mobx';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import Button from 'react-native-button';
import EventTracker from '../../helper/EventTracker';
import {APIRequest} from '../.../../../network/Entity';
import HorizontalInfoItem from './HorizontalInfoItem';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';
import Loading from '../Loading';

class OpRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name_props || '',
      // email: props.email_props || '',
      // password: props.password_props || '',
      refer: props.refer_props || store.refer_code,
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
      warehouseSelected: {id: store?.user_info?.store_id},
      licenseChecked: false,
      birth: store.user_info ? store.user_info.birth : '',
      cities: [],
      listWarehouse: [],
    };

    this.updateReferCodeDisposer = reaction(
      () => store.refer_code,
      this.updateReferCode.bind(this),
    );

    this.eventTracker = new EventTracker();
    this.getUserCityRequest = new APIRequest();
    this.getWarehouseRequest = new APIRequest();
    this.requests = [this.getUserCityRequest, this.getWarehouseRequest];

    this.unmounted = false;
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
    isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY) && this.getListWarehouse();
    Actions.refresh({
      onBack: () => {
        this._unMount();

        Actions.pop();
      },
    });

    // from confirm screen
    if (this.props.registerNow) {
      setTimeout(() => {
        this._onSave();
      }, 500);
    }
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.updateReferCodeDisposer();
    this.eventTracker.clearTracking();
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
            Actions.reset(appConfig.routes.sceneWrapper);
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
    Actions.push(appConfig.routes.voucherSelectProvince, {
      provinceSelected: this.state.provinceSelected.name,
      onSelectProvince: (provinceSelected) => {
        this.setState({provinceSelected});
      },
      onClose: Actions.pop,
      listCities: this.state.cities,
      dataKey: 'name',
      allOption: false,
    });
  };

  onCheckBox = () => {
    this.setState({licenseChecked: !this.state.licenseChecked});
  };

  onSelectedDate = (birth) => {
    this.setState({birth});
  };

  onSelectWarehouse = (warehouseSelected, closeModal) => {
    this.setState({warehouseSelected});
    closeModal();
  };

  onPressWarehouse = () => {
    Keyboard.dismiss();
    Actions.push(appConfig.routes.modalList, {
      heading: this.props.t('modal.store.title'),
      data: this.state.listWarehouse,
      selectedItem: this.state.warehouseSelected,
      onPressItem: this.onSelectWarehouse,
      onCloseModal: Actions.pop,
      modalStyle: {
        height: null,
        maxHeight: '80%',
      },
    });
  };

  onPressScanInvitationCode = () => {
    Actions.push(appConfig.routes.qrBarCode, {
      title: this.props.t('common:screen.qrBarCode.scanTitle'),
      index: 1,
      isVisibleTabBar: false,
      getQRCode: (result) => {
        this.setState({
          refer: result,
        });
      },
    });
  };

  renderDOB() {
    if (isConfigActive(CONFIG_KEY.CHOOSE_BIRTH_SITE_KEY)) {
      const dobData = {
        id: 'ngay_sinh',
        title: (
          <Text>
            {this.props.t('data.birthdate.title')}{' '}
            <Text style={styles.textRequired}>*</Text>
          </Text>
        ),
        value: this.state.birth,
        defaultValue: this.props.t('data.birthdate.defaultValue'),
        select: true,
      };

      return (
        <HorizontalInfoItem
          titleStyle={styles.input_label}
          containerStyle={styles.infoContainer}
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
          <Text>
            {this.props.t('data.province.title')}{' '}
            <Text style={styles.textRequired}>*</Text>
          </Text>
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
          containerStyle={styles.infoContainer}
          data={cityData}
          onSelectedValue={this.onPressSelectProvince}
        />
      );
    }

    return null;
  }

  renderWarehouse() {
    if (isConfigActive(CONFIG_KEY.CHOOSE_STORE_SITE_KEY)) {
      const disable =
        !this.state.listWarehouse || this.state.listWarehouse.length === 0;
      const wareHouseData = {
        title: (
          <Text>
            {this.props.t('data.chooseStore.title')}{' '}
            <Text style={styles.textRequired}>*</Text>
          </Text>
        ),
        value:
          this.state.warehouseSelected?.name ||
          this.props.t('data.chooseStore.placeholder'),
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
          containerStyle={styles.infoContainer}
          data={wareHouseData}
          onSelectedValue={this.onPressWarehouse}
        />
      );
    }

    return null;
  }

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
      <Text>
        {t('data.referCode.title')}{' '}
        {isConfigActive(CONFIG_KEY.NEED_INVITE_ID_FLAG) ? (
          <Text style={styles.textRequired}>*</Text>
        ) : (
          `(${t('data.referCode.optional')})`
        )}
      </Text>
    );

    const extraReferCodeStyle =
      !this.state.referCodeEditable && styles.input_text_disabled;

    return (
      <View style={styles.container}>
        {loading && <Loading center />}
        <ScrollView
          style={{
            marginBottom: store.keyboardTop + 60,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.input_box}>
            <Text style={styles.input_label}>
              {t('data.name.title')} <Text style={styles.textRequired}>*</Text>
            </Text>

            <View style={styles.input_text_box}>
              <TextInput
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
            </View>
          </View>

          {this.renderDOB()}
          {this.renderCity()}
          {this.renderWarehouse()}

          {this.isActiveReferCode && (
            <>
              <View
                style={[
                  styles.input_box,
                  styles.referInputWrapper,
                  !this.state.referCodeEditable &&
                    styles.referInputWrapperDisable,
                ]}>
                <Text
                  style={[
                    styles.input_label,
                    styles.referInputLabel,
                    extraReferCodeStyle,
                  ]}>
                  {referCodeTitle}
                </Text>

                <View
                  style={[styles.input_text_box, styles.referInputContainer]}>
                  <TextInput
                    editable={this.state.referCodeEditable}
                    ref={(ref) => (this.refs_refer = ref)}
                    style={[
                      styles.input_text,
                      styles.referInput,
                      extraReferCodeStyle,
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

                  <TouchableOpacity
                    disabled={!this.state.referCodeEditable}
                    hitSlop={HIT_SLOP}
                    onPress={this.onPressScanInvitationCode}
                    style={[styles.inputIconContainer, extraReferCodeStyle]}>
                    <Icon
                      name="qrcode"
                      style={[styles.inputIcon, extraReferCodeStyle]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <Text style={styles.disclaimerText}>
                {t('encourageMessage', {appName: APP_NAME_SHOW})}
              </Text> */}
            </>
          )}
        </ScrollView>

        <Button
          onPress={this._onSave.bind(this)}
          disabled={disabled}
          containerStyle={[
            styles.address_continue,
            {bottom: store.keyboardTop},
          ]}>
          <View
            style={[
              styles.address_continue_content,
              disabled && styles.btnDisabled,
            ]}>
            <View
              style={{
                minWidth: 20,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* {this.state.loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : ( */}
              <Icon
                name={this.state.edit_mode ? 'save' : 'user-plus'}
                size={20}
                color="#ffffff"
              />
              {/* )} */}
            </View>

            <Text style={styles.address_continue_title}>
              {this.state.edit_mode
                ? t('confirm.save.title')
                : t('confirm.register.title')}
            </Text>
          </View>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    height: 210,
    borderRadius: 2,
    marginTop: -(NAV_HEIGHT / 2),
    alignItems: 'center',
  },
  verify_title: {
    fontSize: 14,
    marginTop: 16,
  },
  verify_desc: {
    marginTop: 8,
    fontSize: 12,
    paddingHorizontal: 16,
    color: '#666666',
  },
  input_text_verify: {
    borderWidth: Util.pixel,
    borderColor: '#cccccc',
    marginTop: 20,
    height: 40,
    width: '69%',
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#404040',
  },
  verify_btn: {
    backgroundColor: DEFAULT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginTop: 20,
    flexDirection: 'row',
  },
  verify_btn_title: {
    color: '#ffffff',
    marginLeft: 4,
  },

  container: {
    flex: 1,
    backgroundColor: appConfig.colors.sceneBackground,
    marginBottom: 0,
  },
  input_box: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_text_box: {
    flex: 1,
    justifyContent: 'center',
  },
  input_label: {
    color: '#888',
    paddingHorizontal: 15,
  },
  input_text: {
    flex: 1,
    padding: 15,
    paddingVertical: 15,
    color: '#242424',
    textAlign: 'right',
  },
  input_text_disabled: {
    color: '#aaa',
    borderColor: '#aaa',
  },
  inputIconContainer: {
    marginHorizontal: 15,
    width: appConfig.device.isIOS ? 26 : 28,
    height: appConfig.device.isIOS ? 26 : 28,
    borderWidth: 1,
    borderColor: appConfig.colors.primary,
    borderStyle: 'dashed',
    borderBottomLeftRadius: 0,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    color: appConfig.colors.primary,
    fontSize: appConfig.device.isIOS ? 20 : 22,
    top: 1,
    left: 0.1,
  },
  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666',
  },
  input_address_text: {
    width: '100%',
    color: '#000000',
    fontSize: 14,
    marginTop: 4,
    paddingVertical: 0,
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60,
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
  },

  disclaimerText: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 13,
    color: '#555',
  },
  link: {
    color: appConfig.colors.primary,
    textDecorationLine: 'underline',
  },

  placeNameWrapper: {
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  placeName: {
    color: '#455',
  },
  placeDropDownIcon: {
    marginTop: 4,
  },
  license: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#aaa',
  },

  infoContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    marginRight: -5,
    paddingLeft: 15,
  },

  referInputWrapper: {
    flexDirection: undefined,
    alignItems: undefined,
  },
  referInputWrapperDisable: {
    backgroundColor: '#eee',
  },
  referInputLabel: {
    paddingTop: 10,
  },
  referInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
  },
  referInput: {
    textAlign: 'left',
  },

  textRequired: {
    color: appConfig.colors.status.danger,
  },
});

export default withTranslation(['opRegister', 'common'])(observer(OpRegister));
