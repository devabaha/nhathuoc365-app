import React, {Component} from 'react';
import {View, StyleSheet, Switch, Keyboard} from 'react-native';
// 3-party libs
import {Actions, ActionConst} from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
import {INPUT_ADDRESS_TYPE} from 'src/helper/configKeyHandler';
import {COMBO_LOCATION_TYPE} from 'src/components/ModalComboLocation/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Button from 'src/components/Button';
import PopupConfirm from 'src/components/PopupConfirm';
import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';
import {
  Container,
  Icon,
  ScreenWrapper,
  ScrollView,
  TextButton,
  Typography,
} from 'src/components/base';

class CreateAddress extends Component {
  static contextType = ThemeContext;

  state = this.initState;

  unmounted = false;
  eventTracker = new EventTracker();

  get initState() {
    const edit_data = this.props.edit_data;
    if (edit_data) {
      return {
        edit_mode: true,
        address_id: edit_data.id,
        name: edit_data.name || '',
        tel: edit_data.tel || '',
        map_address: edit_data.map_address || '',
        address: edit_data.address || '',
        city: edit_data.city || '',
        district: edit_data.district || '',
        latitude: edit_data.latitude || '',
        longitude: edit_data.longitude || '',

        province_id: edit_data.province_id || '',
        district_id: edit_data.district_id || '',
        ward_id: edit_data.ward_id || '',

        province_name: edit_data.province_name || '',
        district_name: edit_data.district_name || '',
        ward_name: edit_data.ward_name || '',

        default_flag: edit_data.default_flag == 1 ? true : false,
        finish_loading: false,
        is_user_address: this.props.from_page == 'account',
      };
    } else {
      return {
        address_id: 0,
        name: '',
        tel: '',
        map_address: '',
        address: '',
        city: '',
        district: '',
        latitude: '',
        longitude: '',

        province_id: '',
        district_id: '',
        ward_id: '',

        province_name: '',
        district_name: '',
        ward_name: '',

        default_flag: false,
        finish_loading: false,
        is_user_address: this.props.from_page == 'account',
      };
    }
  }

  get theme() {
    return getTheme(this);
  }

  get disabled() {
    let disabled = !this.state.name || !this.state.tel || !this.state.address;

    switch (Number(store.store_data[CONFIG_KEY.INPUT_ADDRESS_CONFIG_KEY])) {
      case INPUT_ADDRESS_TYPE.ALL_ADDRESS:
        disabled =
          disabled ||
          !this.state.province_id ||
          !this.state.district_id ||
          !this.state.ward_id ||
          !this.state.map_address;
        break;
      case INPUT_ADDRESS_TYPE.ONLY_COMBO_ADDRESS:
        disabled =
          disabled ||
          !this.state.province_id ||
          !this.state.district_id ||
          !this.state.ward_id;
        break;
      default:
        disabled = disabled || !this.state.map_address;
        break;
    }
    return disabled;
  }

  get metadata() {
    const {t} = this.props;
    const inputAddressConfig =
      Number(store.store_data[CONFIG_KEY.INPUT_ADDRESS_CONFIG_KEY]) ||
      undefined;

    return [
      {
        title: t('formData.name.label'),
        defaultValue: t('formData.name.placeholder'),
        value: this.state.name,
        onChangeInputValue: (data, name) => {
          this.setState({name});
        },
        input: true,
        inputProps: {
          ref: (ref) => (this.refs_name = ref),
          maxLength: 30,
          onSubmitEditing: () => {
            if (this.refs_tel) {
              this.refs_tel.focus();
            }
          },
          returnKeyType: 'next',
        },
      },
      {
        title: t('formData.tel.label'),
        defaultValue: t('formData.tel.placeholder'),
        value: this.state.tel,
        onChangeInputValue: (data, tel) => {
          this.setState({tel: tel.replace(' ', '')});
        },
        input: true,
        inputProps: {
          ref: (ref) => (this.refs_tel = ref),
          maxLength: 30,
          keyboardType: 'phone-pad',
        },
      },

      {
        title: t('formData.province.label'),
        defaultValue: t('formData.province.placeholder'),
        value: this.state.province_name,
        onSelectedValue: (data) =>
          this.handlePressComboAddress(data, COMBO_LOCATION_TYPE.PROVINCE, {
            id: this.state.province_id,
            name: this.state.province_name,
          }),
        select: true,
        isHidden:
          inputAddressConfig === undefined ||
          inputAddressConfig === INPUT_ADDRESS_TYPE.ONLY_MAP_ADDRESS,
      },
      {
        title: t('formData.district.label'),
        defaultValue: t('formData.district.placeholder'),
        value: this.state.district_name,
        onSelectedValue: (data) =>
          this.handlePressComboAddress(
            data,
            COMBO_LOCATION_TYPE.DISTRICT,
            {
              id: this.state.district_id,
              name: this.state.district_name,
            },
            this.state.province_id,
          ),
        select: true,
        disable: !this.state.province_id,
        isHidden:
          inputAddressConfig === undefined ||
          inputAddressConfig === INPUT_ADDRESS_TYPE.ONLY_MAP_ADDRESS,
      },
      {
        title: t('formData.wards.label'),
        defaultValue: t('formData.wards.placeholder'),
        value: this.state.ward_name,
        onSelectedValue: (data) =>
          this.handlePressComboAddress(
            data,
            COMBO_LOCATION_TYPE.WARDS,
            {
              id: this.state.ward_id,
              name: this.state.ward_name,
            },
            this.state.district_id,
          ),
        select: true,
        disable: !this.state.district_id,
        isHidden:
          inputAddressConfig === undefined ||
          inputAddressConfig === INPUT_ADDRESS_TYPE.ONLY_MAP_ADDRESS,
      },

      {
        title: t('formData.map_address.label'),
        defaultValue: t('formData.map_address.placeholder'),
        value: this.state.map_address,
        onChangeInputValue: (data, value) => this.handlePressAddress(value),
        input: true,
        columnView: true,
        mapField: true,
        multiline: true,
        inputProps: {
          ref: (ref) => (this.refs_map_address = ref),
          maxLength: 250,
        },
        isHidden: inputAddressConfig === INPUT_ADDRESS_TYPE.ONLY_COMBO_ADDRESS,
      },
      {
        title: t('formData.address.label'),
        defaultValue: t('formData.address.placeholder'),
        value: this.state.address,
        onChangeInputValue: (data, address) => {
          this.setState({address});
        },
        input: true,
        columnView: true,
        multiline: true,
        inputProps: {
          ref: (ref) => (this.refs_address = ref),
          maxLength: 250,
        },
      },
    ];
  }

  componentDidMount() {
    const actions = {};
    if (!this.props.title) {
      actions.title = this.props.t('common:screen.address.createTitle');
    }

    actions.onBack = () => {
      this._unMount();

      Actions.pop();
    };

    setTimeout(() => Actions.refresh(actions));

    if (!this.state.edit_mode && this.refs_name) {
      setTimeout(() => {
        this.refs_name.focus();
      }, 450);
    }
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

  _unMount() {
    Keyboard.dismiss();
  }

  _reloadParent() {
    if (this.props.addressReload) {
      this.props.addressReload();
    }
  }

  handlePressComboAddress(data, type, location, parentId) {
    Keyboard.dismiss();

    Actions.push(appConfig.routes.modalComboLocation, {
      type,
      parentId,
      provinceId: this.state.province_id,
      districtId: this.state.district_id,
      wardsId: this.state.ward_id,
      provinceName: this.state.province_name,
      districtName: this.state.district_name,
      wardsName: this.state.ward_name,
      onCloseModal: (province, district, wards) => {
        // console.log(province, district, wards);
      },
      onSelectProvince: (province) => {
        this.setState({
          province_id: province.id,
          province_name: province.name,
        });
      },
      onSelectDistrict: (district) => {
        this.setState({
          district_id: district.id,
          district_name: district.name,
        });
      },
      onSelectWards: (wards) => {
        this.setState({
          ward_id: wards.id,
          ward_name: wards.name,
        });
      },
    });
  }

  _onSave() {
    var {
      name,
      tel,
      map_address,
      address,
      city,
      district,
      latitude,
      longitude,

      province_id,
      district_id,
      ward_id,
    } = this.state;
    const {t} = this.props;

    name = name.trim();
    tel = tel.trim();
    map_address = map_address.trim();
    address = address.trim();
    city = city.trim();
    district = district.trim();
    latitude = latitude.trim();
    longitude = longitude.trim();

    // if (!name) {
    //   return Alert.alert(
    //     t('confirmNotification.title'),
    //     t('confirmNotification.nameDescription'),
    //     [
    //       {
    //         text: t('confirmNotification.accept'),
    //         onPress: () => {
    //           this.refs_name.focus();
    //         },
    //       },
    //     ],
    //     {cancelable: false},
    //   );
    // }

    // if (!tel) {
    //   return Alert.alert(
    //     t('confirmNotification.title'),
    //     t('confirmNotification.telDescription'),
    //     [
    //       {
    //         text: t('confirmNotification.accept'),
    //         onPress: () => {
    //           this.refs_tel.focus();
    //         },
    //       },
    //     ],
    //     {cancelable: false},
    //   );
    // }

    // if (!map_address) {
    //   return Alert.alert(
    //     t('confirmNotification.title'),
    //     t('confirmNotification.mapAddressDescription'),
    //     [
    //       {
    //         text: t('confirmNotification.accept'),
    //         onPress: () => {
    //           Actions.push(appConfig.routes.modalSearchPlaces, {
    //             onCloseModal: Actions.pop,
    //             onPressItem: this.handlePressAddress.bind(this),
    //           });
    //         },
    //       },
    //     ],
    //     {cancelable: false},
    //   );
    // }

    // if (!address) {
    //   return Alert.alert(
    //     t('confirmNotification.title'),
    //     t('confirmNotification.addressDescription'),
    //     [
    //       {
    //         text: t('confirmNotification.accept'),
    //         onPress: () => {
    //           this.refs_address.focus();
    //         },
    //       },
    //     ],
    //     {cancelable: false},
    //   );
    // }

    this.setState(
      {
        finish_loading: true,
      },
      async () => {
        try {
          var data_edit = {
            name,
            tel,
            address,
            map_address,
            city,
            district,
            latitude,
            longitude,
            default_flag: this.state.default_flag ? 1 : 0,

            province_id,
            district_id,
            ward_id,
          };
          var {is_user_address} = this.state;
          console.log(data_edit);
          if (is_user_address) {
            var response = await APIHandler.user_add_address(
              this.state.address_id,
              data_edit,
            );
          } else {
            var response = await APIHandler.site_cart_add_address(
              store.store_id,
              this.state.address_id,
              data_edit,
            );
          }
          console.log(data_edit, response);

          if (response && response.status == STATUS_SUCCESS) {
            this._unMount();

            this.setState({
              finish_loading: false,
            });

            if (is_user_address) {
              // refresh cart
              this._getCart();
            } else {
              // update cart
              action(() => {
                store.setCartData(response.data);
              })();
            }

            this._reloadParent();

            if (this.props.goBack) {
              Actions.pop();
            }
            if (this.props.redirect == 'confirm') {
              Actions.replace(appConfig.routes.paymentConfirm, {
                type: ActionConst.REPLACE,
              });
            } else {
              Actions.pop();
            }

            flashShowMessage({
              type: 'success',
              message: response.message,
            });
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('common:api.error.message'),
            });
          }
        } catch (e) {
          console.log(e + ' add_address');
          flashShowMessage({
            type: 'danger',
            message: t('common:api.error.message'),
          });
        } finally {
          !this.unmounted &&
            this.setState({
              finish_loading: false,
            });
        }
      },
    );
  }

  async _getCart() {
    try {
      const response = await APIHandler.site_cart_show(store.store_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setCartData(response.data);
        } else {
          store.resetCartData();
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
    }
  }

  // show popup confirm delete
  _confirmDeleteAddress() {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.open();
    }
  }

  // confirm is "yes", delete address
  async _removeAddressItem() {
    this._closePopupConfirm();

    try {
      var response = await APIHandler.user_delete_address(
        this.state.address_id,
      );

      if (response && response.status == STATUS_SUCCESS) {
        flashShowMessage({
          type: 'success',
          message: response.message,
        });
        this._unMount();
        // store.setCartData(response.data);
        // auto reload address list
        this._reloadParent();

        Actions.pop();
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || this.props.t('api.error.message'),
        });
      }
    } catch (e) {
      console.log(e + ' user_delete_address');
      flashShowMessage({
        type: 'danger',
        message: this.props.t('api.error.message'),
      });
    }
  }

  // close popup
  _closePopupConfirm() {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.close();
    }
  }

  handlePressAddress({detail_address, map_address}) {
    this.setState({
      address: detail_address.description,
      map_address: map_address.description,
      district: detail_address.district,
      city: detail_address.city,
      latitude: map_address.lat,
      longitude: map_address.lng,
    });
  }

  get defaultAddressBtnContainerStyle() {
    return mergeStyles(styles.input_box, {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderTopWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    });
  }

  get deleteAddressBtnStyle() {
    return [
      this.defaultAddressBtnContainerStyle,
      {
        marginTop: 0,
        justifyContent: 'flex-start',
      },
    ];
  }
  get deleteAddressBtnTitleStyle() {
    return {color: this.theme.color.danger};
  }

  get trackColor() {
    return {
      true: appConfig.device.isAndroid
        ? this.theme.color.persistPrimary20
        : this.theme.color.persistPrimary,
      false: this.theme.color.disabled,
    };
  }

  get thumbColor() {
    return appConfig.device.isAndroid ? this.theme.color.persistPrimary : '';
  }

  get deleteBtnTypoProps() {
    return {type: TypographyType.LABEL_MEDIUM};
  }

  renderInput() {
    const containerStyle = mergeStyles(styles.horizontalInfoStyle, {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    });

    return this.metadata.map((data, index) => {
      return (
        <HorizontalInfoItem
          key={index}
          containerStyle={containerStyle}
          data={data}
          inputProps={data.inputProps}
          onChangeInputValue={data.onChangeInputValue}
          onSelectedValue={data.onSelectedValue}
        />
      );
    });
  }
  renderBtnSaveContent = (is_go_confirm, titleStyle) => {
    const {t} = this.props;

    return (
      <Container
        style={{flexDirection: is_go_confirm ? 'row-reverse' : 'row'}}
        row
        noBackground>
        <View>
          {this.state.continue_loading ? (
            <Indicator size="small" />
          ) : (
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name={
                this.state.edit_mode
                  ? 'save'
                  : is_go_confirm
                  ? 'chevron-right'
                  : 'check'
              }
              style={titleStyle}
              size={18}
            />
          )}
        </View>
        <Typography
          style={[
            titleStyle,
            {
              marginLeft: is_go_confirm ? 0 : 8,
              marginRight: is_go_confirm ? 8 : 0,
            },
          ]}>
          {this.state.edit_mode
            ? t('btn.save')
            : is_go_confirm
            ? t('btn.next')
            : t('btn.finish')}
        </Typography>
      </Container>
    );
  };

  render() {
    var {edit_mode} = this.state;
    var is_go_confirm = this.props.redirect == 'confirm';
    const {t} = this.props;

    const disabled = this.state.finish_loading || this.disabled;

    return (
      <>
        <ScreenWrapper safeLayout={!store.keyboardTop}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.listContentContainer}
            keyboardShouldPersistTaps="handled">
            {this.renderInput()}

            <Container style={this.defaultAddressBtnContainerStyle}>
              <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
                {t('setDefault')}
              </Typography>

              <View style={styles.input_text_box}>
                <Switch
                  onValueChange={(value) => {
                    this.setState({
                      default_flag: value,
                    });
                  }}
                  value={this.state.default_flag}
                  trackColor={this.trackColor}
                  thumbColor={this.thumbColor}
                />
              </View>
            </Container>

            {edit_mode && (
              <Container style={styles.deleteAddressBtnContainer}>
                <TextButton
                  underlayColor="transparent"
                  onPress={this._confirmDeleteAddress.bind(this)}
                  titleStyle={this.deleteAddressBtnTitleStyle}
                  typoProps={this.deleteBtnTypoProps}
                  style={this.deleteAddressBtnStyle}>
                  {t('delete')}
                </TextButton>
              </Container>
            )}
          </ScrollView>

          <Button
            disabled={disabled}
            onPress={this._onSave.bind(this)}
            renderTitleComponent={(titleStyle) =>
              this.renderBtnSaveContent(is_go_confirm, titleStyle)
            }
          />

          <PopupConfirm
            ref_popup={(ref) => (this.refs_remove_item_confirm = ref)}
            title={t('deleteConfirm')}
            height={110}
            noConfirm={this._closePopupConfirm.bind(this)}
            yesConfirm={this._removeAddressItem.bind(this)}
            otherClose={false}
          />
        </ScreenWrapper>
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  input_box: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 12,
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  deleteAddressBtnContainer: {
    marginTop: 12,
  },
  horizontalInfoStyle: {
    paddingHorizontal: 15,
  },
});

export default withTranslation(['createAddress', 'common'])(
  observer(CreateAddress),
);
