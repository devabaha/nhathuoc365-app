import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Switch,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import PopupConfirm from '../PopupConfirm';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';

class CreateAddress extends Component {
  constructor(props) {
    super(props);

    var edit_data = props.edit_data;

    if (edit_data) {
      this.state = {
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
        default_flag: edit_data.default_flag == 1 ? true : false,
        finish_loading: false,
        is_user_address: props.from_page == 'account'
      };
    } else {
      this.state = {
        address_id: 0,
        name: '',
        tel: '',
        map_address: '',
        address: '',
        city: '',
        district: '',
        latitude: '',
        longitude: '',
        default_flag: false,
        finish_loading: false,
        is_user_address: props.from_page == 'account'
      };
    }

    this.unmounted = false;
    this.eventTracker = new EventTracker();
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
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  _unMount() {
    Keyboard.dismiss();
  }

  _reloadParent() {
    if (this.props.addressReload) {
      this.props.addressReload(450);
    }
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
      longitude
    } = this.state;
    const { t } = this.props;

    name = name.trim();
    tel = tel.trim();
    map_address = map_address.trim();
    address = address.trim();
    city = city.trim();
    district = district.trim();
    latitude = latitude.trim();
    longitude = longitude.trim();

    if (!name) {
      return Alert.alert(
        t('confirmNotification.title'),
        t('confirmNotification.nameDescription'),
        [
          {
            text: t('confirmNotification.accept'),
            onPress: () => {
              this.refs_name.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (!tel) {
      return Alert.alert(
        t('confirmNotification.title'),
        t('confirmNotification.telDescription'),
        [
          {
            text: t('confirmNotification.accept'),
            onPress: () => {
              this.refs_tel.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (!map_address) {
      return Alert.alert(
        t('confirmNotification.title'),
        t('confirmNotification.mapAddressDescription'),
        [
          {
            text: t('confirmNotification.accept'),
            onPress: () => {
              Actions.push(appConfig.routes.modalSearchPlaces, {
                onCloseModal: Actions.pop,
                onPressItem: this.handlePressAddress.bind(this)
              });
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (!address) {
      return Alert.alert(
        t('confirmNotification.title'),
        t('confirmNotification.addressDescription'),
        [
          {
            text: t('confirmNotification.accept'),
            onPress: () => {
              this.refs_address.focus();
            }
          }
        ],
        { cancelable: false }
      );
    }

    this.setState(
      {
        finish_loading: true
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
            default_flag: this.state.default_flag ? 1 : 0
          };
          console.log(data_edit);
          var { is_user_address } = this.state;

          if (is_user_address) {
            var response = await APIHandler.user_add_address(
              this.state.address_id,
              data_edit
            );
          } else {
            var response = await APIHandler.site_cart_add_address(
              store.store_id,
              this.state.address_id,
              data_edit
            );
          }

          if (response && response.status == STATUS_SUCCESS) {
            this._unMount();

            this.setState({
              finish_loading: false
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

            if (this.props.redirect == 'confirm') {
              Actions.replace(appConfig.routes.paymentConfirm, {
                type: ActionConst.REPLACE
              });
            } else {
              Actions.pop();
            }
          }
        } catch (e) {
          console.log(e + ' add_address');
        }
      }
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
        this.state.address_id
      );

      if (response && response.status == STATUS_SUCCESS) {
        this._unMount();
        store.setCartData(response.data);
        // auto reload address list
        this._reloadParent();

        Actions.pop();
      }
    } catch (e) {
      console.log(e + ' user_delete_address');
    }
  }

  // close popup
  _closePopupConfirm() {
    if (this.refs_remove_item_confirm) {
      this.refs_remove_item_confirm.close();
    }
  }

  handlePressAddress({ detail_address, map_address }) {
    this.setState({
      address: detail_address.description,
      map_address: map_address.description,
      district: detail_address.district,
      city: detail_address.city,
      latitude: map_address.lat,
      longitude: map_address.lng
    });
  }

  render() {
    var { edit_mode } = this.state;
    var is_go_confirm = this.props.redirect == 'confirm';
    const { t } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            marginBottom: store.keyboardTop + 60
          }}
        >
          <View style={styles.input_box}>
            <Text style={styles.input_label}>{t('formData.name.label')}</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => (this.refs_name = ref)}
                style={styles.input_text}
                keyboardType="default"
                maxLength={30}
                placeholder={t('formData.name.placeholder')}
                placeholderTextColor={appConfig.colors.placeholder}
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({
                    name: value
                  });
                }}
                value={this.state.name}
                onSubmitEditing={() => {
                  if (this.refs_tel) {
                    this.refs_tel.focus();
                  }
                }}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.input_box}>
            <Text style={styles.input_label}>{t('formData.tel.label')}</Text>

            <View style={styles.input_text_box}>
              <TextInput
                ref={ref => (this.refs_tel = ref)}
                style={styles.input_text}
                keyboardType="phone-pad"
                maxLength={30}
                placeholder={t('formData.tel.placeholder')}
                placeholderTextColor={appConfig.colors.placeholder}
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({
                    tel: value.replaceAll(' ', '')
                  });
                }}
                value={this.state.tel}
              />
            </View>
          </View>

          <View style={styles.input_address_box}>
            <TouchableHighlight
              underlayColor="#ffffff"
              // onPress={() => {
              //   if (this.refs_map_address) {
              //     this.refs_map_address.focus();
              //   }
              // }}
            >
              <View>
                <Text style={styles.input_label}>
                  {t('formData.map_address.label')}
                </Text>
                {!!t('formData.map_address.description') && (
                  <Text style={styles.input_label_help}>
                    {t('formData.map_address.description')}
                  </Text>
                )}
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor="#ffffff"
              onPress={() => {
                Actions.push(appConfig.routes.modalSearchPlaces, {
                  onCloseModal: Actions.pop,
                  onPressItem: this.handlePressAddress.bind(this)
                });
              }}
            >
              <View pointerEvents="none">
                <TextInput
                  ref={ref => (this.refs_map_address = ref)}
                  style={[
                    styles.input_address_text,
                    {
                      minHeight: this.state.address_height | 50,
                      maxHeight: 100
                    }
                  ]}
                  keyboardType="default"
                  maxLength={250}
                  placeholder={t('formData.map_address.placeholder')}
                  placeholderTextColor={appConfig.colors.placeholder}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  // onContentSizeChange={e => {
                  //   this.setState({
                  //     address_height: e.nativeEvent.contentSize.height
                  //   });
                  // }}
                  value={this.state.map_address}
                />
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.input_address_box}>
            <View>
              <Text style={styles.input_label}>
                {t('formData.address.label')}
              </Text>
              {!!t('formData.address.description') && (
                <Text style={styles.input_label_help}>
                  {t('formData.address.description')}
                </Text>
              )}
            </View>

            <TextInput
              ref={ref => (this.refs_address = ref)}
              style={[
                styles.input_address_text,
                {
                  minHeight: this.state.address_height | 50,
                  maxHeight: 100
                }
              ]}
              keyboardType="default"
              maxLength={250}
              placeholder={t('formData.address.placeholder')}
              placeholderTextColor={appConfig.colors.placeholder}
              multiline={true}
              underlineColorAndroid="transparent"
              // onContentSizeChange={e => {
              //   this.setState({
              //     address_height: e.nativeEvent.contentSize.height
              //   });
              // }}
              onChangeText={value => {
                this.setState({
                  address: value
                });
              }}
              value={this.state.address}
            />
          </View>

          <View
            style={[
              styles.input_box,
              {
                marginTop: 12,
                borderTopWidth: Util.pixel,
                borderColor: '#dddddd'
              }
            ]}
          >
            <Text style={styles.input_label}>{t('setDefault')}</Text>

            <View style={styles.input_text_box}>
              <Switch
                onValueChange={value => {
                  this.setState({
                    default_flag: value
                  });
                }}
                value={this.state.default_flag}
                trackColor={DEFAULT_COLOR}
              />
            </View>
          </View>

          {edit_mode && (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._confirmDeleteAddress.bind(this)}
              style={[
                styles.input_box,
                {
                  marginTop: 12,
                  borderTopWidth: Util.pixel,
                  borderColor: '#dddddd'
                }
              ]}
            >
              <Text style={[styles.input_label, { color: 'red' }]}>
                {t('delete')}
              </Text>
            </TouchableHighlight>
          )}
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onSave.bind(this)}
          style={[styles.address_continue, { bottom: store.keyboardTop }]}
        >
          <View
            style={[
              styles.address_continue_content,
              { flexDirection: is_go_confirm ? 'row-reverse' : 'row' }
            ]}
          >
            <View
              style={{
                minWidth: 20,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {this.state.finish_loading ? (
                <Indicator size="small" color="#ffffff" />
              ) : (
                <Icon
                  name={
                    this.state.edit_mode
                      ? 'save'
                      : is_go_confirm
                      ? 'chevron-right'
                      : 'check'
                  }
                  size={20}
                  color="#ffffff"
                />
              )}
            </View>
            <Text
              style={[
                styles.address_continue_title,
                {
                  marginLeft: is_go_confirm ? 0 : 8,
                  marginRight: is_go_confirm ? 8 : 0
                }
              ]}
            >
              {this.state.edit_mode
                ? t('btn.save')
                : is_go_confirm
                ? t('btn.next')
                : t('btn.finish')}
            </Text>
          </View>
        </TouchableHighlight>

        <PopupConfirm
          ref_popup={ref => (this.refs_remove_item_confirm = ref)}
          title={t('deleteConfirm')}
          height={110}
          noConfirm={this._closePopupConfirm.bind(this)}
          yesConfirm={this._removeAddressItem.bind(this)}
          otherClose={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0
  },
  input_box: {
    width: '100%',
    height: 52,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  input_text_box: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  input_label: {
    fontSize: 14,
    color: '#000'
  },
  input_text: {
    width: '96%',
    height: 44,
    paddingLeft: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'right',
    paddingVertical: 0
  },

  input_address_box: {
    width: '100%',
    minHeight: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd'
  },
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666'
  },
  input_address_text: {
    width: '100%',
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    paddingVertical: 0
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18
  }
});

export default withTranslation('createAddress')(observer(CreateAddress));
