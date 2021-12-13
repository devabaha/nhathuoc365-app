import React, {Component} from 'react';
import {StyleSheet, Keyboard} from 'react-native';
// 3-party libs
import {compose} from 'recompose';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import {observer} from 'mobx-react';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import FloatingLabelInput from 'src/components/FloatingLabelInput';
import Loading from 'src/components/Loading';
import Button from 'src/components/Button';
import MyInputTouchable from './MyInputTouchable';
import {Container, ScreenWrapper, ScrollView} from 'src/components/base';

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(Container);

class AgencyInformationRegister extends Component {
  static contextType = ThemeContext;

  formData = {
    EMAIL: {
      label: this.props.t('formData.email'),
      name: 'email',
      serverName: 'gold_member_email',
      type: 'email',
    },
    ID_CARD: {
      label: this.props.t('formData.IDCard'),
      name: 'id_card',
      type: 'number',
    },
    IMAGE_ID_CARD_FRONT: {
      label: this.props.t('formData.imageIDCardFront'),
      name: 'image_id_card_front',
      serverName: 'gold_member_image_id_card_front',
      type: 'name',
    },
    IMAGE_ID_CARD_BACK: {
      label: this.props.t('formData.imageIDCardBack'),
      name: 'image_id_card_back',
      serverName: 'gold_member_image_id_card_back',
      type: 'name',
    },
    BANK_ACCOUNT: {
      label: this.props.t('formData.bankAccount'),
      name: 'bank_account',
      type: 'name',
    },
  };

  requiredMessage = this.props.t('requiredField');
  emailRequired = this.props.t('emailFomartRequried');
  validationSchema = Yup.object().shape({
    [this.formData.EMAIL.name]: Yup.string()
      .required(this.requiredMessage)
      .email(this.emailRequired)
      .nullable(this.requiredMessage),
    [this.formData.ID_CARD.name]: Yup.string()
      .required(this.requiredMessage)
      .nullable(this.requiredMessage),
    [this.formData.IMAGE_ID_CARD_FRONT.name]: Yup.string()
      .required(this.requiredMessage)
      .nullable(this.requiredMessage),
    [this.formData.IMAGE_ID_CARD_BACK.name]: Yup.string()
      .required(this.requiredMessage)
      .nullable(this.requiredMessage),
    [this.formData.BANK_ACCOUNT.name]: Yup.string()
      .required(this.requiredMessage)
      .nullable(this.requiredMessage),
  });

  userInfo = store.user_info || {};
  state = {
    loading: false,
    professions: [],
    // selectedProfession: {
    //   value: this.userInfo[this.formData.EXPERT_ID.name]
    // },
    formData: this.formData,
    [this.formData.IMAGE_ID_CARD_FRONT?.name]: this.userInfo[
      this.formData.IMAGE_ID_CARD_FRONT?.serverName
    ],
    [this.formData.IMAGE_ID_CARD_BACK?.name]: this.userInfo[
      this.formData.IMAGE_ID_CARD_BACK?.serverName
    ],
    // address: this.userInfo[this.formData.ADDRESS.serverName],
    latitude: this.userInfo.gold_member_latitude,
    longitude: this.userInfo.gold_member_longitude,
  };
  unmounted = false;
  refForm = React.createRef();
  takePicture = this.takePicture.bind(this);

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get initialValues() {
    const values = {};
    const {user_info} = store;

    Object.values(this.state.formData).forEach((value) => {
      let itemValue = '';
      if (user_info) {
        itemValue = user_info[value.name];
        if (value.name === this.formData.EMAIL.name) {
          itemValue = user_info[value.serverName];
        }
      }
      values[value.name] = itemValue;
    });
    return values;
  }

  componentDidMount() {
    // this.getProfessions();
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.updateNavBarDisposer();
  }

  takePicture(key) {
    const {t} = this.props;

    const options = {
      title: t('takePicture.title'),
      cancelButtonTitle: t('takePicture.cancel'),
      takePhotoButtonTitle: t('takePicture.takePhoto'),
      chooseFromLibraryButtonTitle: t('takePicture.chooseFromLibrary'),
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
    try {
      const response = await APIHandler.user_gold_member_register(data);
      console.log(data, response);
      if (!this.unmounted) {
        if (response.status === STATUS_SUCCESS && response.data) {
          // Actions.replace(appConfig.routes.skv_goldMemberSuccess);
          pop();
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
    this.handleSetValueFormData(this.formData.EXPERT_ID.name, profession_id);
    this.setState({
      selectedProfession,
    });
  };

  goToProfessionSelection = () => {
    Keyboard.dismiss();

    push(appConfig.routes.modalPicker, {
      data: this.state.professions,
      title: this.props.t('chooseCareer'),
      onSelect: this.onSelectProfession,
      selectedLabel: this.state.selectedProfession.name,
      selectedValue: this.state.selectedProfession.id,
      defaultValue: this.state.professions[0].id,
      onClose: () => this.forceTouchFormData(this.formData.EXPERT_ID.name),
    });
  };

  goToMapSuggestion = () => {
    Keyboard.dismiss();

    push(appConfig.routes.modalSearchPlaces, {
      onCloseModal: pop,
      onPressItem: this.onSelectAddress,
    });
  };

  onSelectAddress = ({map_address}) => {
    this.handleSetValueFormData(
      this.formData.ADDRESS.name,
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
      // case this.formData.EXPERT_ID.name:
      //   this.goToProfessionSelection();
      //   break;
      case this.formData.ADDRESS.name:
        this.goToMapSuggestion();
        break;
    }
  };

  renderFormData({values}) {
    return Object.keys(this.formData).map((key, index) => {
      const {label, name, type} = this.formData[key];
      let extraProps = null;

      switch (name) {
        case this.formData.IMAGE_ID_CARD_FRONT?.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onPress={this.takePicture}
              editable={false}
              uri={this.state[this.formData.IMAGE_ID_CARD_FRONT.name]}
              value={values[this.formData.IMAGE_ID_CARD_FRONT.name]}
            />
          );
        case this.formData.IMAGE_ID_CARD_BACK?.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onPress={this.takePicture}
              uri={this.state[this.formData.IMAGE_ID_CARD_BACK.name]}
              editable={false}
              value={values[this.formData.IMAGE_ID_CARD_BACK.name]}
            />
          );
        case this.formData.ID_CARD?.name:
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

  get containerStyle() {
    return {
      // backgroundColor: this.theme.color.surface,
    };
  }

  render() {
    return (
      <ScreenWrapper
        safeLayout={!store.keyboardTop}
        style={this.containerStyle}>
        {this.state.loading && <Loading center />}
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
                  title={this.props.t('register')}
                  onPress={props.handleSubmit}
                  disabled={disabled}
                />
              </>
            );
          }}
        </Formik>
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: 30,
  },
});

export default withTranslation('agencyInformationRegister')(
  observer(AgencyInformationRegister),
);
