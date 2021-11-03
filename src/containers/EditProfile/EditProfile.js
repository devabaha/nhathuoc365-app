import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Keyboard,
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';
import {Actions, ActionConst} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import {isEmpty} from 'lodash';
import Loading from 'src/components/Loading';
import Button from 'src/components/Button';
import appConfig from 'app-config';
import EventTracker from 'app-helper/EventTracker';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      latitude: this.props.user_info.latitude,
      longitude: this.props.user_info.longitude,
      sections: [
        {
          id: 'id_section_1',
          data: [
            {
              id: 'ho_ten',
              title: props.t('sections.fullName.title'),
              value: this.props.user_info.name,
              input: true,
              defaultValue: '..........'
            },
            {
              id: 'quote',
              title: props.t('sections.quote.title'),
              value: this.props.user_info.quote,
              input: true,
              defaultValue: '..........'
            },
            {
              id: 'so_dien_thoai',
              title: props.t('sections.phoneNumber.title'),
              value: this.props.user_info.tel,
              disable: true,
            },
          ],
        },
        {
          id: 'id_section_2',
          data: [
            {
              id: 'ngay_sinh',
              title: props.t('sections.birthdate.title'),
              value: this.props.user_info.birth,
              defaultValue: props.t('sections.birthdate.defaultValue'),
              select: true,
            },
            {
              id: 'gioi_tinh',
              title: props.t('sections.gender.title'),
              value: this.props.user_info.gender,
              defaultValue: props.t('sections.gender.defaultValue'),
              select: true,
            },
            {
              id: 'email',
              title: props.t('sections.email.title'),
              value: this.props.user_info.email,
              input: true,
              defaultValue: '..........'
            },
            {
              id: 'facebook',
              title: props.t('sections.facebook.title'),
              value: this.props.user_info.facebook,
              input: true,
              defaultValue: '..........'
            },
            {
              id: 'youtube',
              title: props.t('sections.youtube.title'),
              value: this.props.user_info.youtube,
              input: true,
              defaultValue: '..........'
            },
          ],
        },
        {
          id: 'id_section_3',
          data: [
            {
              id: 'dia_chi',
              title: props.t('sections.address.title'),
              value: this.props.user_info.address_view,
              input: true,
              // mapField: true,
              // map_address: true,
              columnView: true,
              multiline: true,
              param: 'address',
              defaultValue: '..........'
            },
          ],
        },
        {
          id: 'id_section_4',
          data: [
            {
              id: 'intro',
              title: props.t('sections.intro.title'),
              value: this.props.user_info.intro,
              input: true,
              columnView: true,
              multiline: true,
              defaultValue: '..........'
            },
          ],
        },
      ],
    };

    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
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

  handleSaveMapAddress(data, {map_address}) {
    this.setState({
      latitude: map_address.lat,
      longitude: map_address.lng,
    });
    this._onUpdateSections(data.id, map_address.description);
  }

  _onSaveProfile = async () => {
    let name = '';
    let email = '';
    let birth = '';
    // let map_address = '';
    let address = '';
    let gender = '';
    let quote = '';
    let intro = '';
    let facebook = '';
    let youtube = '';
    let errorMessage = '';
    const {user_info: userInfo} = this.props;
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
          // map_address = item.value;
          address = item.value;
        } else if (item.id === 'quote') {
          quote = item.value;
        } else if (item.id === 'intro') {
          intro = item.value;
        } else if (item.id === 'facebook') {
          facebook = item.value;
        } else if (item.id === 'youtube') {
          youtube = item.value;
        }
      });
    });

    // if (isEmpty(name)) {
    //   errorMessage = 'Hãy điền tên của bạn';
    // } else if (isEmpty(email)) {
    //   errorMessage = 'Hãy điền email của bạn';
    // } else if (!this._is_email(email)) {
    //   errorMessage = 'Email của bạn không đúng định dạng';
    // } else if (isEmpty(map_address)) {
    //   errorMessage = 'Hãy điền địa chỉ của bạn';
    // }

    if (
      name === userInfo.name &&
      email === userInfo.email &&
      // map_address === userInfo.address_view &&
      address === userInfo.address_view &&
      gender === userInfo.gender &&
      birth === userInfo.birth &&
      quote === userInfo.quote &&
      intro === userInfo.intro &&
      facebook === userInfo.facebook &&
      youtube === userInfo.youtube
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
      // map_address,
      address,
      gender,
      quote,
      intro,
      facebook,
      youtube,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };

    this.setState({loading: true}, async () => {
      try {
        const response = await APIHandler.user_update_profile(param);
        this.setState({loading: false});

        if (response && response.status == STATUS_SUCCESS) {
          this.props.refresh();
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
    const extraProps = item.columnView
      ? {
          containerStyle: styles.itemContainer,
          titleStyle: styles.itemTitle,
          detailTitleStyle: styles.itemDetailTitle,
        }
      : {};

    return (
      <HorizontalInfoItem
        data={item}
        onChangeInputValue={this._onChangeInputValue}
        onSelectedValue={this._onSelectedValue}
        onSelectedDate={this._onSelectedDate}
        {...extraProps}
      />
    );
  };

  _onSelectedDate = (date) => {
    this._onUpdateSections('ngay_sinh', date);
  };

  _onChangeInputValue = (data, value) => {
    if (data.map_address) {
      this.handleSaveMapAddress(data, value);
    } else {
      this._onUpdateSections(data.id, value);
    }
  };

  _onSelectedValue = (data) => {
    if (data.id === 'gioi_tinh') {
      if (this.actionSheet) {
        this.actionSheet.show();
      }
    }
  };

  _onChangeGender = (value) => {
    this._onUpdateSections('gioi_tinh', value);
  };

  _onUpdateSections = (id, value) => {
    let _sections = [...this.state.sections];
    _sections.forEach((element) => {
      element.data.forEach((item) => {
        if (item.id === id) {
          item.value = value;
        }
      });
    });

    this.setState({sections: _sections});
  };

  render() {
    const {t} = this.props;

    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAwareScrollView>
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
          {this.state.loading == true && <Loading center />}
          {/* {appConfig.device.isIOS && <KeyboardSpacer />} */}
        </KeyboardAwareScrollView>
        <Button title={t('saveChanges')} onPress={this._onSaveProfile} />
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
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    height: null,
    paddingHorizontal: 15,
  },
  itemTitle: {
    flex: 0,
    marginLeft: 0,
    marginBottom: appConfig.isIOS ? 10 : 0,
  },
  itemDetailTitle: {
    textAlign: 'left',
    marginRight: 0,
    flex: 1,
    width: '100%',
    color: '#242244',
  },
});

export default withTranslation('editProfile')(observer(EditProfile));
