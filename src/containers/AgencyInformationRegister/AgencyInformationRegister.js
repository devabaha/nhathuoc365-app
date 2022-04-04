import React, {Component, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import {compose} from 'recompose';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import {Actions} from 'react-native-router-flux';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import appConfig from 'app-config';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import store from 'app-store';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

const FORM_DATA = {
  EMAIL: {
    label: 'Email *',
    name: 'email',
    serverName: 'gold_member_email',
    type: 'email',
  },
  ID_CARD: {
    label: 'Số CMND *',
    name: 'id_card',
    type: 'number',
  },
  IMAGE_ID_CARD_FRONT: {
    label: 'Ảnh CMND (mặt trước) *',
    name: 'image_id_card_front',
    serverName: 'gold_member_image_id_card_front',
    type: 'name',
  },
  IMAGE_ID_CARD_BACK: {
    label: 'Ảnh CMND (mặt sau) *',
    name: 'image_id_card_back',
    serverName: 'gold_member_image_id_card_back',
    type: 'name',
  },
  BANK_ACCOUNT: {
    label:
      'Tài khoản ngân hàng (cú pháp: [số tk], [tên chủ tk], [tên ngân hàng]) *',
    name: 'bank_account',
    type: 'name',
  },
  // ADDRESS: {
  //   label: 'Địa chỉ kinh doanh *',
  //   name: 'address',
  //   serverName: 'gold_member_address',
  //   type: 'name'
  // },
  // EXPERT_ID: {
  //   label: 'Ngành nghề kinh doanh *',
  //   name: 'expert_id',
  //   type: 'name'
  // },
  // BRAND: {
  //   label: 'Thương hiệu kinh doanh *',
  //   name: 'brand',
  //   type: 'name'
  // }
};

const REQUIRED_MESSAGE = 'Vui lòng nhập trường này';
const EMAIL_REQUIRED = 'Vui lòng nhập đúng định dạng email';

class AgencyInformationRegister extends Component {
  get validationSchema() {
    const shape = {
      [FORM_DATA.EMAIL.name]: Yup.string()
        .required(REQUIRED_MESSAGE)
        .email(EMAIL_REQUIRED)
        .nullable(REQUIRED_MESSAGE),
      [FORM_DATA.ID_CARD.name]: Yup.string()
        .required(REQUIRED_MESSAGE)
        .nullable(REQUIRED_MESSAGE),
      [FORM_DATA.IMAGE_ID_CARD_FRONT.name]: Yup.string()
        .required(REQUIRED_MESSAGE)
        .nullable(REQUIRED_MESSAGE),
      [FORM_DATA.IMAGE_ID_CARD_BACK.name]: Yup.string()
        .required(REQUIRED_MESSAGE)
        .nullable(REQUIRED_MESSAGE),
      [FORM_DATA.BANK_ACCOUNT.name]: Yup.string()
        .required(REQUIRED_MESSAGE)
        .nullable(REQUIRED_MESSAGE),
      // [FORM_DATA.ADDRESS.name]: Yup.string().required(REQUIRED_MESSAGE).nullable(REQUIRED_MESSAGE),
      // [FORM_DATA.EXPERT_ID.name]: Yup.string().required(REQUIRED_MESSAGE).nullable(REQUIRED_MESSAGE),
      // [FORM_DATA.BRAND.name]: Yup.string().required(REQUIRED_MESSAGE).nullable(REQUIRED_MESSAGE)
    };
    if (isConfigActive(CONFIG_KEY.OPTIONAL_KYC_FORM_REGISTER_KEY)) {
      shape[FORM_DATA.IMAGE_ID_CARD_FRONT.name] = shape[
        FORM_DATA.IMAGE_ID_CARD_FRONT.name
      ].notRequired();
      shape[FORM_DATA.IMAGE_ID_CARD_BACK.name] = shape[
        FORM_DATA.IMAGE_ID_CARD_BACK.name
      ].notRequired();
      shape[FORM_DATA.BANK_ACCOUNT.name] = shape[
        FORM_DATA.BANK_ACCOUNT.name
      ].notRequired();
    }

    return Yup.object().shape(shape);
  }

  getFormDataValue = (key) => {
    let {label, name, ...params} = FORM_DATA[key];
    if (isConfigActive(CONFIG_KEY.OPTIONAL_KYC_FORM_REGISTER_KEY)) {
      if (
        name === FORM_DATA.IMAGE_ID_CARD_FRONT.name ||
        name === FORM_DATA.IMAGE_ID_CARD_BACK.name ||
        name === FORM_DATA.BANK_ACCOUNT.name
      ) {
        label = label.split(/\*/g).join('');
      }
    }

    return {label, name, ...params};
  };

  userInfo = store.user_info || {};
  state = {
    loading: false,
    professions: [],
    // selectedProfession: {
    //   value: this.userInfo[FORM_DATA.EXPERT_ID.name]
    // },
    formData: FORM_DATA,
    [FORM_DATA.IMAGE_ID_CARD_FRONT?.name]: this.userInfo[
      FORM_DATA.IMAGE_ID_CARD_FRONT?.serverName
    ],
    [FORM_DATA.IMAGE_ID_CARD_BACK?.name]: this.userInfo[
      FORM_DATA.IMAGE_ID_CARD_BACK?.serverName
    ],
    // address: this.userInfo[FORM_DATA.ADDRESS.serverName],
    latitude: this.userInfo.gold_member_latitude,
    longitude: this.userInfo.gold_member_longitude,
  };
  unmounted = false;
  refForm = React.createRef();
  takePicture = this.takePicture.bind(this);

  get initialValues() {
    const values = {};
    const {user_info} = store;

    Object.values(this.state.formData).forEach((value) => {
      let itemValue = '';
      if (user_info) {
        itemValue = user_info[value.name];
        if (value.name === FORM_DATA.EMAIL.name) {
          itemValue = user_info[value.serverName];
        }
      }
      values[value.name] = itemValue;
    });
    return values;
  }

  componentDidMount() {
    // this.getProfessions();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  takePicture(key) {
    const options = {
      title: 'Chụp ảnh CMND',
      cancelButtonTitle: 'Hủy',
      takePhotoButtonTitle: 'Chụp ảnh',
      chooseFromLibraryButtonTitle: 'Mở thư viện',
      rotation: 360,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
        this.forceTouchFormData(key);
      } else {
        // console.log(response);
        if (!response.filename) {
          response.filename = `${new Date().getTime()}`;
        }
        this.uploadTempImage(response, key);
      }
    });
  }

  uploadTempImage = (response, key) => {
    this.setState(
      {
        loading: true,
      },
      () => {
        const {t} = this.props;
        const image = {
          name: 'image',
          filename: response.filename,
          data: response.data,
        };
        // call api post my form data
        RNFetchBlob.fetch(
          'POST',
          APIHandler.url_user_upload_image(),
          {
            'Content-Type': 'multipart/form-data',
          },
          [image],
        )
          .then((resp) => {
            if (!this.unmounted) {
              const {data} = resp;
              const response = JSON.parse(data);
              if (response.status == STATUS_SUCCESS && response.data) {
                this.setState({[key]: response.data.url});
                this.handleSetValueFormData(key, response.data.name);
              } else {
                flashShowMessage({
                  type: 'danger',
                  message: response.message || t('common:api.error.message'),
                });
              }
            }
          })
          .catch((error) => {
            console.log('upload_id_card', error);
            flashShowMessage({
              type: 'danger',
              message: t('common:api.error.message'),
            });
          })
          .finally(() => {
            !this.unmounted && this.setState({loading: false});
          });
      },
    );
  };

  async getProfessions() {
    const {t} = this.props;
    try {
      const response = await APIHandler.get_professions();
      if (!this.unmounted) {
        if (response.data && response.status === STATUS_SUCCESS) {
          const state = {...this.state};
          const professions = response.data.professions.map((profession) => ({
            ...profession,
            label: profession.name,
            value: profession.id,
          }));
          state.professions = professions;

          const selectedProfession = professions.find(
            (profession) =>
              profession.value === this.state.selectedProfession.value,
          );
          if (selectedProfession) {
            state.selectedProfession = selectedProfession;
          }
          this.setState(state);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      }
    } catch (error) {
      console.log('get professions', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  }

  onSubmit = async (values) => {
    this.setState({loading: true});
    const {t} = this.props;
    const data = {
      // latitude: this.state.latitude,
      // longitude: this.state.longitude,
      ...values,
    };

    Object.keys(data).map((key) => {
      if (!data[key]) {
        data[key] = '';
      }
    });

    try {
      const response = await APIHandler.user_gold_member_register(data);
      console.log(data, response);
      if (!this.unmounted) {
        if (response.status === STATUS_SUCCESS && response.data) {
          // Actions.replace(appConfig.routes.skv_goldMemberSuccess);
          Actions.pop();
          flashShowMessage({
            type: 'success',
            message: response.message,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      }
    } catch (err) {
      console.log('gold_member_register', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  handleChangeFormData(value, type) {
    const formData = {...this.state.formData};
    Object.keys(formData).forEach((key) => {
      const data = formData[key];
      if (data.name === type) {
        data.value = value;
      }
    });

    this.setState({formData});
  }

  handleSetValueFormData(key, value) {
    if (this.refForm.current) {
      this.refForm.current.setFieldValue(key, value);
    }
  }

  forceTouchFormData(key) {
    if (this.refForm.current) {
      this.refForm.current.setFieldTouched(key, true);
    }
  }

  onSelectProfession = (profession_id) => {
    const selectedProfession = this.state.professions.find(
      (profession) => profession.id === profession_id,
    );
    this.handleSetValueFormData(FORM_DATA.EXPERT_ID.name, profession_id);
    this.setState({
      selectedProfession,
    });
  };

  goToProfessionSelection = () => {
    Keyboard.dismiss();

    Actions.push(appConfig.routes.modalPicker, {
      data: this.state.professions,
      title: 'Chọn ngành nghề',
      onSelect: this.onSelectProfession,
      selectedLabel: this.state.selectedProfession.name,
      selectedValue: this.state.selectedProfession.id,
      defaultValue: this.state.professions[0].id,
      onClose: () => this.forceTouchFormData(FORM_DATA.EXPERT_ID.name),
    });
  };

  goToMapSuggestion = () => {
    Keyboard.dismiss();

    Actions.push(appConfig.routes.modalSearchPlaces, {
      onCloseModal: Actions.pop,
      onPressItem: this.onSelectAddress,
    });
  };

  onSelectAddress = ({map_address}) => {
    this.handleSetValueFormData(
      FORM_DATA.ADDRESS.name,
      map_address.description,
    );
    this.setState({
      address: map_address.description,
      latitude: map_address.lat,
      longitude: map_address.lng,
    });
  };

  onInputFocus = (type) => {
    switch (type) {
      // case FORM_DATA.EXPERT_ID.name:
      //   this.goToProfessionSelection();
      //   break;
      case FORM_DATA.ADDRESS.name:
        this.goToMapSuggestion();
        break;
    }
  };

  renderFormData({values}) {
    return Object.keys(FORM_DATA).map((key, index) => {
      const {label, name, type} = this.getFormDataValue(key);
      let extraProps = null;

      switch (name) {
        // case FORM_DATA.EXPERT_ID.name:
        //   return (
        //     <MyInputTouchable
        //       label={label}
        //       name={name}
        //       type={type}
        //       onFocus={() => this.onInputFocus(FORM_DATA.EXPERT_ID.name)}
        //       onPress={this.goToProfessionSelection}
        //       value={this.state.selectedProfession.name}
        //     />
        //   );
        case FORM_DATA.IMAGE_ID_CARD_FRONT?.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onPress={this.takePicture}
              editable={false}
              uri={this.state[FORM_DATA.IMAGE_ID_CARD_FRONT.name]}
              value={values[FORM_DATA.IMAGE_ID_CARD_FRONT.name]}
            />
          );
        case FORM_DATA.IMAGE_ID_CARD_BACK?.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onPress={this.takePicture}
              uri={this.state[FORM_DATA.IMAGE_ID_CARD_BACK.name]}
              editable={false}
              value={values[FORM_DATA.IMAGE_ID_CARD_BACK.name]}
            />
          );
        // case FORM_DATA.ADDRESS.name:
        //   return (
        //     <MyInputTouchable
        //       label={label}
        //       name={name}
        //       type={type}
        //       onFocus={() => this.onInputFocus(FORM_DATA.ADDRESS.name)}
        //       onPress={this.goToMapSuggestion}
        //       value={this.state.address}
        //     />
        //   );
        case FORM_DATA.ID_CARD?.name:
          extraProps = {
            keyboardType: appConfig.device.isIOS ? 'number-pad' : 'numeric',
          };
        default:
          return (
            <MyInput
              key={index}
              label={label}
              name={name}
              type={type}
              {...extraProps}
            />
          );
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <Loading center />}
        <SafeAreaView style={styles.wrapper}>
          <Formik
            initialValues={this.initialValues}
            onSubmit={this.onSubmit}
            validationSchema={this.validationSchema}
            innerRef={this.refForm}>
            {(props) => {
              const disabled = !(props.isValid && props.dirty);
              return (
                <>
                  <ScrollView
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <Form style={styles.formContainer}>
                      {this.renderFormData(props)}
                    </Form>
                  </ScrollView>

                  <Button
                    title="Đăng ký"
                    onPress={props.handleSubmit}
                    disabled={disabled}
                    btnContainerStyle={disabled && styles.btnDisabled}
                  />
                </>
              );
            }}
          </Formik>
          {appConfig.device.isIOS && <KeyboardSpacer />}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
  },
  formContainer: {
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    letterSpacing: 1,
    paddingHorizontal: 15,
    color: '#555',
    marginBottom: 15,
  },
  btn: {
    padding: 15,
    backgroundColor: '#444',
    marginVertical: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  btnTitle: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fcfcfc',
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputTouchableWrapper: {
    flexDirection: 'row',
  },
});

export default withTranslation()(AgencyInformationRegister);

const MyInputTouchable = ({
  onPress,
  // key,
  label,
  name,
  type,
  onFocus,
  value,
  style,
  uri,
  ...props
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(name)}>
      <View style={[styles.inputTouchableWrapper, style]} pointerEvents="none">
        <MyInput
          label={label}
          name={name}
          type={type}
          onFocus={onFocus}
          value={value}
          containerStyle={{flex: 1}}
          {...props}
        />
        {!!uri && (
          <View style={styles.imageContainer}>
            <Image source={{uri}} style={styles.image} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
