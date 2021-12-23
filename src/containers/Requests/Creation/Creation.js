import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
// 3-party libs
import {compose} from 'recompose';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {handleTextInput, withNextInputAutoFocusForm} from 'react-native-formik';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {reaction} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
//routing
import {pop, push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import FloatingLabelInput from 'src/components/FloatingLabelInput';
import Loading from 'src/components/Loading';
import Button from 'src/components/Button';
import Images from './Images';
import RequestTagTitle from '../Request/RequestTagTitle';
import {Container, ScreenWrapper, ScrollView} from 'src/components/base';
import MyInputTouchable from './MyInputTouchable';

const MyInput = compose(handleTextInput)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

class Creation extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    request: {},
    extraSubmitData: {},
    onRefresh: () => {},
  };

  formData = {
    TITLE: {
      label: this.props.t('request:formData.title'),
      name: 'title',
      type: 'name',
      required: true,
    },
    REQUEST_TYPE: {
      label: this.props.t('request:formData.requestType'),
      name: 'code_type',
      type: 'name',
      required: true,
    },
    CONTENT: {
      label: this.props.t('request:formData.content'),
      name: 'content',
      type: 'name',
      required: true,
    },
    IMAGES: {
      label: this.props.t('request:formData.image'),
      name: 'images',
      type: 'name',
    },
  };

  requiredMessage = this.props.t('request:formData.required');
  validationSchema = Yup.object().shape({
    [this.formData.TITLE.name]: Yup.string().required(this.requiredMessage),
    [this.formData.REQUEST_TYPE.name]: Yup.string().required(
      this.requiredMessage,
    ),
    [this.formData.CONTENT.name]: Yup.string().required(this.requiredMessage),
  });

  state = {
    loading: true,
    requestTypes: [],
    selectedRequestType: {
      value: this.props.request?.id
        ? this.props.request[this.formData.REQUEST_TYPE.name] || ''
        : '',
    },
    formData: this.formData,
    uploadImageLoading: false,
    images: this.initImages,
    keyboardTop: store.keyboardTop,
  };
  unmounted = false;
  refForm = React.createRef();
  keyboardTopDisposer = reaction(
    () => store.keyboardTop,
    (keyboardTop) => {
      this.setState({keyboardTop});
    },
  );

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get initImages() {
    const images = this.props.request?.id
      ? this.props.request[this.formData.IMAGES.name]?.length
        ? this.props.request[this.formData.IMAGES.name].map((image) => ({
            ...image,
            url: image.url_image,
          }))
        : []
      : [];
    return images;
  }

  get initialValues() {
    const values = {};

    Object.values(this.state.formData).forEach((value) => {
      let itemValue = '';
      switch (value.name) {
        case this.formData.TITLE.name:
          itemValue = this.props.request?.[this.formData.TITLE.name]
            ? this.props.request[this.formData.TITLE.name] || ''
            : '';
          break;
        case this.formData.REQUEST_TYPE.name:
          itemValue = this.props.request?.[this.formData.REQUEST_TYPE.name]
            ? this.props.request[this.formData.REQUEST_TYPE.name] || ''
            : '';
          break;
        case this.formData.CONTENT.name:
          itemValue = this.props.request?.[this.formData.CONTENT.name]
            ? this.props.request[this.formData.CONTENT.name] || ''
            : '';
          break;
        case this.formData.IMAGES.name:
          itemValue = this.props.request?.[this.formData.IMAGES.name]
            ? this.props.request[this.formData.IMAGES.name].map(
                (image) => image.name,
              ) || ''
            : '';
          break;
      }
      values[value.name] = itemValue;
    });
    return values;
  }

  componentDidMount() {
    this.getRequestTypes();

    if (!this.props.title) {
      setTimeout(() => {
        refresh({
          title: this.props.t('screen.requests.creationTitle'),
        });
      });
    }

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;

    this.updateNavBarDisposer();
    this.keyboardTopDisposer();
  }

  takePicture(key, values) {
    this.setState({uploadImageLoading: true});
    const options = {
      title: this.props.t('request:option.title'),
      cancelButtonTitle: this.props.t('cancel'),
      takePhotoButtonTitle: this.props.t('cameraLabel'),
      chooseFromLibraryButtonTitle: this.props.t('photoLibraryLabel'),
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
    try {
      const response = await APIHandler.site_request_types_room(
        this.props.siteId,
        this.props.roomId,
      );

      if (!this.unmounted && response) {
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
      }
    } catch (error) {
      console.log('get_request_types', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  }

  onSubmit = async (data = {}) => {
    this.setState({loading: true});
    data = {
      ...data,
      object_type: this.props.objectType,
      object_id: this.props.objectId,
    };

    const {t} = this.props;
    const apiHandler = this.props.request?.id
      ? APIHandler.site_update_request(
          this.props.siteId,
          this.props.request.id,
          data,
        )
      : APIHandler.site_request_room(
          this.props.siteId,
          this.props.roomId || 0,
          data,
        );
    try {
      const response = await apiHandler;

      if (this.unmounted) return;
      if (response?.status === STATUS_SUCCESS) {
        this.props.onRefresh(response.data?.request);
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
    } catch (err) {
      console.log('create_request_room', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  handleDeleteImage = (image) => {
    const images = [...this.state.images];
    const imgIndex = images.findIndex((img) => img?.name === image?.name);
    if (imgIndex !== -1) {
      images.splice(imgIndex, 1);

      this.handleSetValueFormData(
        this.formData.IMAGES.name,
        images.map((image) => image.name),
      );
      this.setState({images});
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
    this.handleSetValueFormData(this.formData.REQUEST_TYPE.name, type_id);
    this.setState({
      selectedRequestType,
    });
  };

  goToRequestTypeSelection = () => {
    Keyboard.dismiss();

    push(appConfig.routes.modalPicker, {
      data: this.state.requestTypes,
      title: this.props.t('request:requestTypes'),
      onSelect: this.onSelectRequestType,
      selectedLabel: this.state.selectedRequestType.title,
      selectedValue: this.state.selectedRequestType.id,
      defaultValue: this.state.requestTypes[0].id,
      onClose: () => this.forceTouchFormData(this.formData.REQUEST_TYPE.name),
    });
  };

  isEmptyRequiredData(formValues) {
    return Object.values(this.state.formData)
      .filter((data) => data.required)
      .some((data) => !formValues[data.name]);
  }

  onInputFocus = (type) => {
    switch (type) {
      case this.formData.REQUEST_TYPE.name:
        this.goToRequestTypeSelection();
        break;
    }
  };

  renderFormData({values}) {
    return Object.keys(this.formData).map((key, index) => {
      const {label, name, type} = this.formData[key];
      let extraProps = null;
      switch (name) {
        case this.formData.REQUEST_TYPE.name:
          return (
            <MyInputTouchable
              key={index}
              label={label}
              name={name}
              type={type}
              onFocus={() => this.onInputFocus(this.formData.REQUEST_TYPE.name)}
              onPress={this.goToRequestTypeSelection}
              value={this.state.selectedRequestType.title}
            />
          );
        case this.formData.IMAGES.name:
          return (
            <Images
              key={index}
              images={this.state.images}
              onOpenImageSelector={() =>
                this.takePicture(this.formData.IMAGES.name, values)
              }
              onDelete={this.handleDeleteImage}
              uploadImageLoading={this.state.uploadImageLoading}
            />
          );
        case this.formData.CONTENT.name:
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
      <ScreenWrapper>
        <Container style={styles.container}>
          {this.state.loading && <Loading center />}
          <Formik
            initialValues={this.initialValues}
            onSubmit={this.onSubmit}
            validationSchema={this.validationSchema}
            innerRef={this.refForm}>
            {(props) => {
              const disabled =
                this.isEmptyRequiredData(props.values) ||
                !props.isValid ||
                !props.dirty;
              return (
                <>
                  <ScrollView
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <RequestTagTitle
                      code={this.props.object?.warranty_code}
                      name={this.props.object?.title}
                      containerStyle={styles.tagContainer}
                    />
                    <Form style={styles.formContainer}>
                      {this.renderFormData(props)}
                    </Form>
                  </ScrollView>

                  <Button
                    safeLayout={!this.state.keyboardTop}
                    title={
                      this.props.request?.id
                        ? this.props.t('request:editRequest')
                        : this.props.t('request:createRequest')
                    }
                    onPress={props.handleSubmit}
                    disabled={disabled}
                  />
                </>
              );
            }}
          </Formik>
          {appConfig.device.isIOS && <KeyboardSpacer />}
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  formContainer: {
    paddingTop: 30,
  },
  tagContainer: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 10,
  },
});

export default withTranslation(['common', 'request'])(Creation);
