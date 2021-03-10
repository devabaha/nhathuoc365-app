import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Keyboard,
} from 'react-native';

import HorizontalInfoItem from './HorizontalInfoItem';
import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import {isEmpty} from 'lodash';
import Loading from '../Loading';
import Button from '../Button';
import appConfig from 'app-config';
import store from 'app-store';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import EventTracker from '../../helper/EventTracker';
import {APIRequest} from '../../network/Entity';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cityLoading: true,
      sections: this.sections,
      provinceSelected: {
        name: store.user_info ? store.user_info.city : '',
        id: store.user_info ? store.user_info.city_id : '',
      },
      cities: [],
    };
    this.eventTracker = new EventTracker();
    this.getUserCityRequest = new APIRequest();
  }

  get sections() {
    return [
      {
        id: 'id_section_1',
        data: [
          {
            id: 'ho_ten',
            title: this.props.t('sections.fullName.title'),
            value: store.user_info.name,
            input: true,
          },
          {
            id: 'so_dien_thoai',
            title: this.props.t('sections.phoneNumber.title'),
            value: store.user_info.tel,
            disable: true,
          },
        ],
      },
      {
        id: 'id_section_2',
        data: [
          {
            id: 'ngay_sinh',
            title: this.props.t('sections.birthdate.title'),
            value: store.user_info.birth,
            defaultValue: this.props.t('sections.birthdate.defaultValue'),
            select: true,
          },
          {
            id: 'gioi_tinh',
            title: this.props.t('sections.gender.title'),
            value: store.user_info.gender,
            defaultValue: this.props.t('sections.gender.defaultValue'),
            select: true,
          },
          {
            id: 'email',
            title: this.props.t('sections.email.title'),
            value: store.user_info.email,
            input: true,
          },
        ],
      },
      {
        id: 'id_section_3',
        data: [
          {
            id: 'dia_chi',
            title: this.props.t('sections.address.title'),
            value: store.user_info.address,
            input: true,
          },
          {
            id: 'thanh_pho',
            title: this.props.t('sections.city.title'),
            select: true,
          },
        ],
      },
    ];
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
    isConfigActive(CONFIG_KEY.SELECT_CITY_KEY) && this.getCities();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
    this.getUserCityRequest.cancel();
  }

  _renderRightButton = () => {
    const {t} = this.props;
    return (
      <TouchableHighlight
        style={styles.rightBtnEdit}
        underlayColor="transparent"
        onPress={this._onSaveProfile}>
        <Text style={styles.txtEdit}>{t('save')}</Text>
      </TouchableHighlight>
    );
  };

  _onSaveProfile = async () => {
    let name = '';
    let email = '';
    let birth = '';
    let address = '';
    let gender = '';
    let city = '';
    let errorMessage = '';
    const {user_info: userInfo} = store;
    const {t} = this.props;

    this.state.sections.forEach((element) => {
      element.data.forEach((item) => {
        if (item.id === 'ho_ten') {
          name = item.value;
        } else if (item.id === 'ngay_sinh') {
          birth = item.value || '';
        } else if (item.id === 'gioi_tinh') {
          gender = item.value;
        } else if (item.id === 'email') {
          email = item.value || '';
        } else if (item.id === 'dia_chi') {
          address = item.value;
        } else if (item.id === 'thanh_pho') {
          city = this.state.provinceSelected.id;
        }
      });
    });

    if (
      name === userInfo.name &&
      email === userInfo.email &&
      address === userInfo.address &&
      gender === userInfo.gender &&
      birth === userInfo.birth &&
      city === userInfo.city
    ) {
      flashShowMessage({
        type: 'info',
        message: t('noChangeMessage'),
      });
      return;
    } else {
      if (!isEmpty(email) && !this._is_email(email)) {
        errorMessage = t('invalidEmailMessage');
      }
    }

    if (!isEmpty(errorMessage)) {
      flashShowMessage({
        type: 'danger',
        message: errorMessage,
      });
      return;
    }
    Keyboard.dismiss();

    const param = {
      name,
      email,
      birth,
      address,
      gender,
      city,
    };

    this.setState({loading: true}, async () => {
      try {
        const response = await APIHandler.user_update_profile(param);
        this.setState({loading: false});

        if (response && response.status == STATUS_SUCCESS) {
          Actions.pop();
        }

        if (response) {
          flashShowMessage({
            type: response.status == STATUS_SUCCESS ? 'success' : 'danger',
            message: response.message,
          });
        }
      } catch (e) {
        this.setState({loading: false});
        console.log('user_update_profile ' + e);
      }
    });
  };

  getCities = async () => {
    Keyboard.dismiss();
    this.setState({cityLoading: true});
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
          cities: response.data.cities || [],
          provinceSelected,
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
      this.setState({cityLoading: false});
    }
  };

  onPressProvince = () => {
    Actions.push(appConfig.routes.voucherSelectProvince, {
      provinceSelected: this.state.provinceSelected.name,
      onSelectProvince: (provinceSelected) => {
        this.setState({provinceSelected});
        this._onUpdateSections('thanh_pho', provinceSelected.name);
      },
      onClose: Actions.pop,
      listCities: this.state.cities,
      dataKey: 'name',
      allOption: false,
    });
  };

  _is_email = (str) => {
    const regexp = /\S+[a-z0-9]@[a-z0-9\.]+/gim;
    if (regexp.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({item, index, section}) => {
    if (item.id === 'thanh_pho') {
      const disable = !this.state.cities || this.state.cities.length === 0;
      item.value =
        this.state.provinceSelected.name ||
        this.props.t('opRegister:data.province.title');
      item.isHidden = !isConfigActive(CONFIG_KEY.SELECT_CITY_KEY);
      item.isLoading = this.state.cityLoading;
      item.disable = disable;
      item.select = !disable;
    }
    return (
      <HorizontalInfoItem
        data={item}
        onChangeInputValue={this._onChangeInputValue}
        onSelectedValue={this._onSelectedValue}
        onSelectedDate={this._onSelectedDate}
      />
    );
  };

  _onSelectedDate = (date) => {
    this._onUpdateSections('ngay_sinh', date);
  };

  _onChangeInputValue = (data, value) => {
    this._onUpdateSections(data.id, value);
  };

  _onSelectedValue = (data) => {
    if (data.id === 'gioi_tinh') {
      if (this.actionSheet) {
        this.actionSheet.show();
      }
    } else if (data.id === 'thanh_pho') {
      this.onPressProvince();
    }
  };

  _onChangeGender = (value) => {
    this._onUpdateSections('gioi_tinh', value);
  };

  _onUpdateSections = (id, value, keys = [], values = []) => {
    let _sections = [...this.state.sections];
    _sections.forEach((element) => {
      element.data.forEach((item) => {
        if (item.id === id) {
          if (keys.length !== 0) {
            keys.forEach((key, index) => {
              item[key] = values[index];
            });
          } else {
            item.value = value;
          }
        }
      });
    });

    this.setState({sections: _sections});
  };

  render() {
    const {t} = this.props;

    return (
      <SafeAreaView style={{flex: 1}}>
        <SectionList
          style={{flex: 1}}
          renderItem={this._renderItems}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={this.state.sections}
          keyExtractor={(item, index) => `${item.title}-${index}`}
        />
        <ActionSheet
          ref={(ref) => (this.actionSheet = ref)}
          options={[
            t('sections.gender.female'),
            t('sections.gender.male'),
            t('sections.gender.cancel'),
          ]}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index !== 2) {
              this._onChangeGender(
                index === 1
                  ? t('sections.gender.male')
                  : t('sections.gender.female'),
              );
            }
          }}
        />
        {this.state.loading && <Loading center />}
        <Button title={t('saveChanges')} onPress={this._onSaveProfile} />
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    width: '100%',
    backgroundColor: '#EFEFF4',
  },

  separatorSection: {
    width: '100%',
    height: 5,
  },

  separatorItem: {
    height: 1,
    backgroundColor: '#EFEFF4',
  },

  rightBtnEdit: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },

  txtEdit: {
    fontSize: 14,
    color: '#ffffff',
  },

  mainScroll: {
    flex: 1,
  },
});

export default withTranslation(['editProfile', 'opRegister'])(
  observer(EditProfile),
);
