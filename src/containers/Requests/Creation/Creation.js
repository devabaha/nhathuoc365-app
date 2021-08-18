import React, {Component} from 'react';
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
import KeyboardSpacer from 'react-native-keyboard-spacer';
import appConfig from 'app-config';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

import FloatingLabelInput from '../../../components/FloatingLabelInput';
import Loading from '../../../components/Loading';
import Button from '../../../components/Button';
import Images from './Images';
import {APIRequest} from 'src/network/Entity';

const MyInput = compose(
  handleTextInput,
  // withNextInputAutoFocusInput
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

const FORM_DATA = {
  TITLE: {
    label: 'Tiêu đề *',
    name: 'title',
    type: 'name',
  },
  REQUEST_TYPE: {
    label: 'Loại phản ánh *',
    name: 'code_type',
    type: 'name',
  },
  CONTENT: {
    label: 'Nội dung *',
    name: 'content',
    type: 'name',
  },
  IMAGES: {
    label: 'Hình ảnh',
    name: 'images',
    type: 'name',
  },
};

const REQUIRED_MESSAGE = 'Vui lòng nhập trường này';
const validationSchema = Yup.object().shape({
  [FORM_DATA.TITLE.name]: Yup.string().required(REQUIRED_MESSAGE),
  [FORM_DATA.REQUEST_TYPE.name]: Yup.string().required(REQUIRED_MESSAGE),
  [FORM_DATA.CONTENT.name]: Yup.string().required(REQUIRED_MESSAGE),
});

class Creation extends Component {
  state = {
    loading: true,
    requestTypes: [],
    selectedRequestType: {
      value: '',
    },
    formData: FORM_DATA,
    uploadImageLoading: false,
    images: [],
  };
  unmounted = false;
  requestTypesRequest = new APIRequest();
  makeRequestRequest = new APIRequest();
  requests = [this.requestTypesRequest, this.makeRequestRequest];
  refForm = React.createRef();
  takePicture = this.takePicture.bind(this);

  get initialValues() {
    const values = {};

    Object.values(this.state.formData).forEach((value) => {
      let itemValue = value.name === FORM_DATA.IMAGES.name ? [] : '';
      values[value.name] = itemValue;
    });
    return values;
  }

  componentDidMount() {
    this.getRequestTypes();
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
  }

  takePicture(key, values) {
    this.setState({uploadImageLoading: true});
    const options = {
      title: 'Tải ảnh phản ánh',
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
        !this.unmounted && this.setState({uploadImageLoading: false});
      } else if (response.didCancel) {
        console.log(response);
        !this.unmounted && this.setState({uploadImageLoading: false});
      } else {
        // console.log(response);
        if (!response.filename) {
          response.filename = `${new Date().getTime()}`;
        }
        this.uploadTempImage(response, (image) => {
          const imageValues = [...values[key]];
          imageValues.push(image.name);
          this.handleSetValueFormData(key, imageValues);
        });
      }
    });
  }

  uploadTempImage = (response, callBack) => {
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
            const images = [...this.state.images];
            images.push(response.data);
            this.setState({images});
            callBack(response.data);
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
        !this.unmounted &&
          this.setState({
            uploadImageLoading: false,
          });
      });
  };

  async getRequestTypes() {
    const {t} = this.props;
    this.requestTypesRequest.data = ADMIN_APIHandler.site_request_types_site(
      this.props.siteId,
    );
    try {
      const response = await this.requestTypesRequest.promise();
      if (response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          const state = {...this.state};
          const requestTypes = response.data.request_types.map((type) => ({
            ...type,
            label: type.title,
            value: type.id,
          }));
          state.requestTypes = requestTypes;

          const selectedRequestType = requestTypes.find(
            (type) => type.value === this.state.selectedRequestType.value,
          );
          if (selectedRequestType) {
            state.selectedRequestType = selectedRequestType;
          }
          this.setState(state);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('get_request_types', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({loading: false});
    }
  }

  onSubmit = async (data) => {
    this.setState({loading: true});
    const {t} = this.props;
    console.log(data);
    this.makeRequestRequest.data = ADMIN_APIHandler.site_request_site(
      this.props.siteId,
      data,
    );
    try {
      const response = await this.makeRequestRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          this.props.onRefresh();
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
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log('create_request_room', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({loading: false});
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

  onSelectRequestType = (type_id) => {
    const selectedRequestType = this.state.requestTypes.find(
      (type) => type.id === type_id,
    );
    this.handleSetValueFormData(FORM_DATA.REQUEST_TYPE.name, type_id);
    this.setState({
      selectedRequestType,
    });
  };

  goToRequestTypeSelection = () => {
    Keyboard.dismiss();

    Actions.push(appConfig.routes.modalPicker, {
      data: this.state.requestTypes,
      title: 'Chọn loại phản ánh',
      onSelect: this.onSelectRequestType,
      selectedLabel: this.state.selectedRequestType.title,
      selectedValue: this.state.selectedRequestType.id,
      defaultValue: this.state.requestTypes[0].id,
      onClose: () => this.forceTouchFormData(FORM_DATA.REQUEST_TYPE.name),
    });
  };

  onInputFocus = (type) => {
    switch (type) {
      case FORM_DATA.REQUEST_TYPE.name:
        this.goToRequestTypeSelection();
        break;
    }
  };

  renderFormData({values}) {
    return Object.keys(FORM_DATA).map((key, index) => {
      const {label, name, type} = FORM_DATA[key];
      let extraProps = null;
      switch (name) {
        case FORM_DATA.REQUEST_TYPE.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onFocus={() => this.onInputFocus(FORM_DATA.REQUEST_TYPE.name)}
              onPress={this.goToRequestTypeSelection}
              value={this.state.selectedRequestType.title}
            />
          );
        case FORM_DATA.IMAGES.name:
          return (
            <Images
              key={index}
              images={this.state.images}
              onOpenImageSelector={() =>
                this.takePicture(FORM_DATA.IMAGES.name, values)
              }
              uploadImageLoading={this.state.uploadImageLoading}
            />
          );
        case FORM_DATA.CONTENT.name:
          extraProps = {
            multiline: true,
            inputContainerStyle: {height: 60},
            inputStyle: {paddingBottom: 10},
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
            validationSchema={validationSchema}
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
                    title="Tạo phản ánh"
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

export default withTranslation()(Creation);

const MyInputTouchable = ({
  onPress,
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
          containerStyle={[{flex: 1}]}
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