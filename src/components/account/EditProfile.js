import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';

import HorizontalInfoItem from './HorizontalInfoItem';
import { Actions, ActionConst } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import { isEmpty } from 'lodash';
import Loading from '../Loading';
import Button from '../Button';
import appConfig from 'app-config';
import store from 'app-store';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      sections: [
        {
          id: 'id_section_1',
          data: [
            {
              id: 'ho_ten',
              title: props.t('sections.fullName.title'),
              value: store.user_info.name,
              input: true
            },
            {
              id: 'so_dien_thoai',
              title: props.t('sections.phoneNumber.title'),
              value: store.user_info.tel,
              disable: true
            }
          ]
        },
        {
          id: 'id_section_2',
          data: [
            {
              id: 'ngay_sinh',
              title: props.t('sections.birthdate.title'),
              value: store.user_info.birth,
              defaultValue: props.t('sections.birthdate.defaultValue'),
              select: true
            },
            {
              id: 'gioi_tinh',
              title: props.t('sections.gender.title'),
              value: store.user_info.gender,
              defaultValue: props.t('sections.gender.defaultValue'),
              select: true
            },
            {
              id: 'email',
              title: props.t('sections.email.title'),
              value: store.user_info.email,
              input: true
            }
          ]
        },
        {
          id: 'id_section_3',
          data: [
            {
              id: 'dia_chi',
              title: props.t('sections.address.title'),
              value: store.user_info.address,
              input: true
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    EventTracker.logEvent('edit_profile_page');
  }

  _renderRightButton = () => {
    const { t } = this.props;
    return (
      <TouchableHighlight
        style={styles.rightBtnEdit}
        underlayColor="transparent"
        onPress={this._onSaveProfile}
      >
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
    let errorMessage = '';
    const { user_info: userInfo } = store;
    const { t } = this.props;

    this.state.sections.forEach(element => {
      element.data.forEach(item => {
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
        }
      });
    });

    // if (isEmpty(name)) {
    //   errorMessage = 'Hãy điền tên của bạn';
    // } else if (isEmpty(email)) {
    //   errorMessage = 'Hãy điền email của bạn';
    // } else if (!this._is_email(email)) {
    //   errorMessage = 'Email của bạn không đúng định dạng';
    // } else if (isEmpty(address)) {
    //   errorMessage = 'Hãy điền địa chỉ của bạn';
    // }

    if (
      name === userInfo.name &&
      email === userInfo.email &&
      address === userInfo.address &&
      gender === userInfo.gender &&
      birth === userInfo.birth
    ) {
      flashShowMessage({
        type: 'info',
        message: t('noChangeMessage')
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
        message: errorMessage
      });
      return;
    }
    Keyboard.dismiss();

    const param = {
      name: name,
      email: email,
      birth: birth,
      address: address,
      gender: gender
    };

    this.setState({ loading: true }, async () => {
      try {
        const response = await APIHandler.user_update_profile(param);
        this.setState({ loading: false });

        if (response && response.status == STATUS_SUCCESS) {
          Actions._account({ type: ActionConst.REFRESH });
        }

        if (response) {
          flashShowMessage({
            type: response.status == STATUS_SUCCESS ? 'success' : 'danger',
            message: response.message
          });
        }
      } catch (e) {
        this.setState({ loading: false });
        console.log('user_update_profile ' + e);
      }
    });
  };

  _is_email = str => {
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

  _renderItems = ({ item, index, section }) => {
    return (
      <HorizontalInfoItem
        data={item}
        onChangeInputValue={this._onChangeInputValue}
        onSelectedValue={this._onSelectedValue}
        onSelectedDate={this._onSelectedDate}
      />
    );
  };

  _onSelectedDate = date => {
    this._onUpdateSections('ngay_sinh', date);
  };

  _onChangeInputValue = (data, value) => {
    this._onUpdateSections(data.id, value);
  };

  _onSelectedValue = data => {
    if (data.id === 'gioi_tinh') {
      if (this.actionSheet) {
        this.actionSheet.show();
      }
    }
  };

  _onChangeGender = value => {
    this._onUpdateSections('gioi_tinh', value);
  };

  _onUpdateSections = (id, value) => {
    let _sections = [...this.state.sections];
    _sections.forEach(element => {
      element.data.forEach(item => {
        if (item.id === id) {
          item.value = value;
        }
      });
    });

    this.setState({ sections: _sections });
  };

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={appConfig.device.isIOS ? 'padding' : null}
        >
          <KeyboardAwareScrollView style={styles.mainScroll}>
            <SectionList
              style={{ flex: 1 }}
              renderItem={this._renderItems}
              SectionSeparatorComponent={this._renderSectionSeparator}
              ItemSeparatorComponent={this._renderItemSeparator}
              sections={this.state.sections}
              keyExtractor={(item, index) => `${item.title}-${index}`}
            />
          </KeyboardAwareScrollView>
          <ActionSheet
            ref={ref => (this.actionSheet = ref)}
            options={[
              t('sections.gender.female'),
              t('sections.gender.male'),
              t('sections.gender.cancel')
            ]}
            cancelButtonIndex={2}
            onPress={index => {
              if (index !== 2) {
                this._onChangeGender(
                  index === 1
                    ? t('sections.gender.male')
                    : t('sections.gender.female')
                );
              }
            }}
          />
          {this.state.loading == true && <Loading center />}
          <Button title={t('saveChanges')} onPress={this._onSaveProfile} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    width: '100%',
    backgroundColor: '#EFEFF4'
  },

  separatorSection: {
    width: '100%',
    height: 5
  },

  separatorItem: {
    height: 1,
    backgroundColor: '#EFEFF4'
  },

  rightBtnEdit: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0
  },

  txtEdit: {
    fontSize: 14,
    color: '#ffffff'
  },

  mainScroll: {
    flex: 1
  }
});

export default withTranslation('editProfile')(observer(EditProfile));
