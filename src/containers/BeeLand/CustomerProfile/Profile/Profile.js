import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import appConfig from 'app-config';
import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput
} from 'react-native-formik';
import { Actions } from 'react-native-router-flux';
import FloatingLabelInput from '../../../../components/FloatingLabelInput';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Button from '../../../../components/Button';
import { APIRequest } from '../../../../network/Entity';
import Loading from '../../../../components/Loading';

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

const FORM_DATA = {
  NAME: {
    label: 'Tên khách hàng *',
    name: 'name',
    type: 'name',
    initValue: ''
  },
  TEL: {
    label: 'Số điện thoại *',
    name: 'tel',
    type: 'name',
    initValue: ''
  },
  EMAIL: {
    label: 'Email',
    name: 'email',
    type: 'email',
    initValue: ''
  },
  ADDRESS: {
    label: 'Địa chỉ',
    name: 'address',
    type: 'name',
    initValue: ''
  }
};

const REQUIRED_MESSAGE = 'Vui lòng nhập trường này!';
const validationSchema = Yup.object().shape({
  [FORM_DATA.NAME.name]: Yup.string().required(REQUIRED_MESSAGE),
  [FORM_DATA.TEL.name]: Yup.string().required(REQUIRED_MESSAGE)
});
const ADD_SUBMIT_TITLE = 'Tạo khách hàng';
const EDIT_SUBMIT_TITLE = 'Sửa khách hàng';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  }
});

class Profile extends Component {
  static defaultProps = {
    isEdit: false,
    reloadData: () => {}
  };
  state = {
    loading: false,
    formData: FORM_DATA
  };
  refForm = React.createRef();
  updateCustomerRequest = new APIRequest();
  requests = [this.updateCustomerRequest];

  componentDidMount() {
    if (this.props.customer) {
      this.handleSetValueFormData(
        FORM_DATA.NAME.name,
        this.props.customer.name
      );
      this.handleSetValueFormData(FORM_DATA.TEL.name, this.props.customer.tel);
      this.handleSetValueFormData(
        FORM_DATA.EMAIL.name,
        this.props.customer.email
      );
      this.handleSetValueFormData(
        FORM_DATA.ADDRESS.name,
        this.props.customer.address
      );
    }
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  get initialValues() {
    const values = {};

    Object.values(this.state.formData).forEach(value => {
      values[value.name] = '';
    });
    return values;
  }

  onSubmit = async data => {
    this.setState({ loading: true });
    const { t } = this.props;
    if (this.props.isEdit && this.props.customer) {
      data = {
        ...data,
        code: this.props.customer.code,
        id_code: this.props.customer.id_code,
        company_name: this.props.customer.company_name
      };
    }
    console.log(data);
    try {
      this.updateCustomerRequest.data = APIHandler.user_create_update_customer_beeland(
        data
      );
      const response = await this.updateCustomerRequest.promise();
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          this.props.reloadData();
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
      console.log('update_customer_beeland', err);
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

  renderFormData({ values }) {
    return Object.keys(FORM_DATA).map((key, index) => {
      const { label, name, type } = FORM_DATA[key];
      let extraProps = null;
      switch (name) {
        case FORM_DATA.TEL.name:
          extraProps = {
            keyboardType: appConfig.device.isIOS ? 'number-pad' : 'numeric'
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
                  title={
                    this.props.isEdit ? EDIT_SUBMIT_TITLE : ADD_SUBMIT_TITLE
                  }
                  onPress={props.handleSubmit}
                  disabled={disabled}
                  btnContainerStyle={disabled && styles.btnDisabled}
                />
              </>
            );
          }}
        </Formik>
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </View>
    );
  }
}

export default withTranslation()(Profile);
