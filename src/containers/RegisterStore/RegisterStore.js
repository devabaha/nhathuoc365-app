import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Keyboard,
  Image
} from 'react-native';
import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput
} from 'react-native-formik';
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import appConfig from 'app-config';

import FloatingLabelInput from '../../components/FloatingLabelInput';
import Loading from '../../components/Loading';
import Button from '../../components/Button';

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

const FORM_DATA = {
  TITLE: {
    label: 'Tên cửa hàng *',
    name: 'store_name',
    type: 'name'
  },
  EMAIL: {
    label: 'Email *',
    name: 'email',
    type: 'email'
  },
  ADDRESS: {
    label: 'Địa chỉ *',
    name: 'address',
    type: 'name'
  },
  SOURCE: {
    label: 'Lĩnh vực kinh doanh *',
    name: 'source_id',
    type: 'name'
  }
};

const REQUIRED_MESSAGE = 'Vui lòng nhập trường này!';
const INVALID_EMAIL_MESSAGE = 'Email không hợp lệ, vui lòng nhập lại!';
const validationSchema = Yup.object().shape({
  [FORM_DATA.TITLE.name]: Yup.string().required(REQUIRED_MESSAGE),
  [FORM_DATA.EMAIL.name]: Yup.string()
    .required(REQUIRED_MESSAGE)
    .email(INVALID_EMAIL_MESSAGE),
  [FORM_DATA.ADDRESS.name]: Yup.string().required(REQUIRED_MESSAGE),
  [FORM_DATA.SOURCE.name]: Yup.string().required(REQUIRED_MESSAGE)
});

class RegisterStore extends Component {
  state = {
    loading: true,
    sources: [],
    selectedSource: {
      value: ''
    },
    formData: FORM_DATA
  };
  unmounted = false;
  refForm = React.createRef();

  get initialValues() {
    const values = {};

    Object.values(this.state.formData).forEach(value => {
      values[value.name] = '';
    });
    return values;
  }

  componentDidMount() {
    this.getSources();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async getSources() {
    const { t } = this.props;
    try {
      const response = await APIHandler.user_list_business_area();
      console.log(response);

      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          const state = { ...this.state };
          const sources = response.data.list_business_area.map(source => ({
            ...source,
            label: source.name,
            value: source.id
          }));
          state.sources = sources;

          const selectedSource = sources.find(
            source => source.value === this.state.selectedSource.value
          );
          if (selectedSource) {
            state.selectedSource = selectedSource;
          }
          this.setState(state);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('get_request_types', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  }

  onSubmit = async data => {
    this.setState({ loading: true });
    const { t } = this.props;
    console.log(data);
    try {
      const response = await APIHandler.user_create_store(data);
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          Actions.pop();
          flashShowMessage({
            type: 'success',
            message: response.message
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (err) {
      console.log('create_request_room', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  handleChangeFormData(value, type) {
    const formData = { ...this.state.formData };
    Object.keys(formData).forEach(key => {
      const data = formData[key];
      if (data.name === type) {
        data.value = value;
      }
    });

    this.setState({ formData });
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

  onSelectSource = source_id => {
    const selectedSource = this.state.sources.find(
      source => source.id === source_id
    );

    this.handleSetValueFormData(FORM_DATA.SOURCE.name, source_id);
    this.setState({
      selectedSource
    });
  };

  goToSourcesSelection = () => {
    Keyboard.dismiss();

    Actions.push(appConfig.routes.modalPicker, {
      data: this.state.sources,
      title: 'Lĩnh vực kinh doanh',
      onSelect: this.onSelectSource,
      selectedLabel: this.state.selectedSource.name,
      selectedValue: this.state.selectedSource.id,
      defaultValue: this.state.sources[0].id,
      onClose: () => this.forceTouchFormData(FORM_DATA.SOURCE.name)
    });
  };

  onInputFocus = type => {
    switch (type) {
      case FORM_DATA.SOURCE.name:
        this.goToSourcesSelection();
        break;
    }
  };

  renderFormData({ values }) {
    return Object.keys(FORM_DATA).map((key, index) => {
      const { label, name, type } = FORM_DATA[key];
      let extraProps = null;
      switch (name) {
        case FORM_DATA.SOURCE.name:
          return (
            <MyInputTouchable
              label={label}
              name={name}
              type={type}
              onFocus={() => this.onInputFocus(FORM_DATA.SOURCE.name)}
              onPress={this.goToSourcesSelection}
              value={this.state.selectedSource.name}
            />
          );
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
            innerRef={this.refForm}
          >
            {props => {
              const disabled = !(props.isValid && props.dirty);
              return (
                <>
                  <ScrollView
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                  >
                    <Form style={styles.formContainer}>
                      {this.renderFormData(props)}
                    </Form>
                  </ScrollView>

                  <Button
                    title="Đăng ký ngay"
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
    backgroundColor: '#fff'
  },
  wrapper: {
    flex: 1
  },
  formContainer: {
    paddingTop: 30
  },
  title: {
    fontSize: 20,
    letterSpacing: 1,
    paddingHorizontal: 15,
    color: '#555',
    marginBottom: 15
  },
  btn: {
    padding: 15,
    backgroundColor: '#444',
    marginVertical: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150
  },
  btnTitle: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase'
  },
  btnDisabled: {
    backgroundColor: '#ccc'
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#fcfcfc',
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  inputTouchableWrapper: {
    flexDirection: 'row'
  }
});

export default withTranslation()(RegisterStore);

const MyInputTouchable = ({
  onPress,
  key,
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
          containerStyle={[{ flex: 1 }]}
          {...props}
        />
        {!!uri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
