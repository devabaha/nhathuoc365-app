import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
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
      referCodeEditable: store?.user_info?.invite_user_id ? false : true,
      provinceSelected: {
        name: store.user_info ? store.user_info.city : '',
        id: store.user_info ? store.user_info.city_id : '',
      },
      warehouseSelected: {id: store?.user_info?.store_id},
      licenseChecked: false,
      birth: store.user_info ? store.user_info.birth : '',
      cities: [],
      listWarehouse: []
    };

    this.eventTracker = new EventTracker();
    this.getUserCityRequest = new APIRequest();
    this.getWarehouseRequest = new APIRequest();
    this.requests = [this.getUserCityRequest, this.getWarehouseRequest];
  }

  get isActiveCity() {
    return (
      isConfigActive(CONFIG_KEY.SELECT_CITY_KEY) &&
      this.state.cities.length !== 0
    );
  }

  componentDidMount() {
    isConfigActive(CONFIG_KEY.SELECT_CITY_KEY) && this.getCities();
    isConfigActive(CONFIG_KEY.SELECT_STORE_KEY) && this.getListWarehouse();
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
    cancelRequests(this.requests);
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

  _op_register(name, refer, city, birth, store_id) {
    //, password, refer
    const data = {name, refer, city, birth, store_id};

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.user_op_register(data);
          if (response) {
            if (response.status == STATUS_SUCCESS) {
              store.setUserInfo(response.data);
              this.setState(
                {
                  loading: false
                },
                () => {
                  Actions.reset(appConfig.routes.sceneWrapper);
                }
              );
            }

            flashShowMessage({
              message: response.message,
              type: response.status == STATUS_SUCCESS ? 'success' : 'danger',
            });
          }
        } catch (e) {
          this.setState({
            loading: false,
          });
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  }

  async getCities() {
    this.setState({isCityLoading: true});
    const {t} = this.props;
    try {
      this.getUserCityRequest.data = APIHandler.user_site_city();
      const response = await this.getUserCityRequest.promise();
      
      if (response.data && response.status === STATUS_SUCCESS) {
        let provinceSelected = this.state.provinceSelected;
        if (!this.state.provinceSelected.id && response.data.cities.length > 0) {
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
      this.setState({isCityLoading: false});
    }
  }

  async getListWarehouse(){
    this.setState({isWarehouseLoading: true});
    const {t} = this.props;
    try {
      this.getWarehouseRequest.data = APIHandler.user_site_store();
      const responseData = await this.getWarehouseRequest.promise();
      const listWarehouse = responseData?.stores?.map(store => ({...store, 
        title: store.name,
        description: store.address,
        image: store.image_url
      })) || [];
      let warehouseSelected = this.state.warehouseSelected;
      if (!this.state.warehouseSelected.id && listWarehouse.length > 0) {
        warehouseSelected = listWarehouse[0];
      } else {
        warehouseSelected = listWarehouse.find(
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
      this.setState({isWarehouseLoading: false});
    }
  }

  updateReferCode() {
    const store_refer_code = store.refer_code;

    if (store_refer_code) {
      this.setState(
        {
          refer: store_refer_code,
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
  }

  onPressWarehouse = () => {
    Keyboard.dismiss();
    Actions.push(appConfig.routes.modalList, {
      heading: this.props.t('modal.warehouse.title'),
      data: this.state.listWarehouse,
      selectedItem: this.state.warehouseSelected,
      onPressItem: this.onSelectWarehouse,
      onCloseModal: Actions.pop,
      modalStyle: {
        height: null, 
        maxHeight: '80%'
      }
    })
  }

  renderDOB() {
    if (isConfigActive(CONFIG_KEY.SELECT_BIRTH_KEY)) {
      const dobData = {
        id: 'ngay_sinh',
        title: this.props.t('data.birthdate.title'),
        value: this.state.birth,
        defaultValue: this.props.t('data.birthdate.defaultValue'),
        select: true,
      };

      return (
        <HorizontalInfoItem
          titleStyle={[styles.input_label, styles.dobTitle]}
          containerStyle={styles.dob}
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
        title: this.props.t('data.province.title'),
        value: this.state.provinceSelected?.name
          || this.props.t('data.province.placeholder'),
        isLoading: this.state.isCityLoading,
        select: true,
        disable,
      };

      return (
        <HorizontalInfoItem
          titleStyle={[styles.input_label, styles.dobTitle]}
          containerStyle={styles.dob}
          data={cityData}
          onSelectedValue={this.onPressSelectProvince}
        />
      );
    }

    return null;
  }

  renderWarehouse() {
    if (isConfigActive(CONFIG_KEY.SELECT_STORE_KEY)) {
      const disable = !this.state.listWarehouse || this.state.listWarehouse.length === 0;
      const wareHouseData = {
        title: this.props.t('data.warehouse.title'),
        value: this.state.warehouseSelected?.name ||
          this.props.t('data.warehouse.placeholder'),
        isLoading: this.state.isWarehouseLoading,
        select: true,
        disable
      };

      if(!this.state.warehouseSelected?.name){
        wareHouseData.rightTextStyle = {
          color: appConfig.colors.placeholder
        }
      }

      return (
        <HorizontalInfoItem
          titleStyle={[styles.input_label, styles.dobTitle]}
          containerStyle={styles.dob}
          data={wareHouseData}
          onSelectedValue={this.onPressWarehouse}
        />
      );
    }

    return null;
  }

  render() {
    const {name, email, loading, refer, birth, provinceSelected, warehouseSelected} = this.state;
    const {t} = this.props;
    this.updateReferCode();
    const disabled =
      !name ||
      (this.isActiveCity && !provinceSelected.id) ||
      (isConfigActive(CONFIG_KEY.SELECT_BIRTH_KEY) && !birth) ||
      (isConfigActive(CONFIG_KEY.SELECT_STORE_KEY) && !warehouseSelected.id);

    return (
      <View style={styles.container}>
        {loading && <Loading center />}
        <ScrollView
          style={{
            marginBottom: store.keyboardTop + 60,
          }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.input_box}>
            <Text style={styles.input_label}>{t('data.name.title')} (*)</Text>

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

          {this.state.referCodeEditable && (
            <>
              <View style={styles.input_box}>
                <Text style={styles.input_label}>
                  {t('data.referCode.title')}
                </Text>

                <View style={styles.input_text_box}>
                  <TextInput
                    editable={this.state.referCodeEditable}
                    ref={(ref) => (this.refs_refer = ref)}
                    style={[
                      styles.input_text,
                      !this.state.referCodeEditable &&
                        styles.input_text_disabled,
                    ]}
                    keyboardType="default"
                    maxLength={30}
                    placeholder={t('data.referCode.placeholder')}
                    underlineColorAndroid="transparent"
                    onChangeText={(value) => {
                      this.setState({
                        refer: value.replaceAll(' ', ''),
                      });
                    }}
                    value={this.state.refer}
                  />
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

    marginBottom: 0,
  },
  input_box: {
    width: '100%',
    height: 44,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  input_label: {
    fontSize: 14,
    color: '#000000',
  },
  input_text: {
    width: '96%',
    height: 38,
    paddingLeft: 8,
    color: '#000000',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0,
  },
  input_text_disabled: {
    color: '#777',
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

  dobTitle: {
    paddingLeft: 15,
    marginLeft: 0,
  },
  dob: {
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    marginRight: -5,
  },
});

export default withTranslation(['opRegister', 'common'])(observer(OpRegister));
