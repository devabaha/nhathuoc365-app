import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../../components/Button';
import appConfig from 'app-config';
import FloatingLabelInput from '../../../../components/FloatingLabelInput';
import { CUSTOMER_INFO_FORM_DATA } from './constants';

import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput
} from 'react-native-formik';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  input: {},
  inputDisabled: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.2)
  },
  btnReset: {
    position: 'absolute',
    right: 15,
    top: 5,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 4,
    zIndex: 99
  },
  btnDisabled: {
    opacity: 0
  },
  resetTitle: {
    color: '#fff'
  },
  scrollView: {
    paddingVertical: 15,
    flexGrow: 1
  }
});

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(FloatingLabelInput);

const Form = withNextInputAutoFocusForm(View);

const REQUIRED_MESSAGE = 'Vui lòng nhập trường này';
const TEL_LENGTH_MESSAGE = 'Số điện thoại chưa đúng định dạng (10 số)';
const validationSchema = Yup.object().shape({
  [CUSTOMER_INFO_FORM_DATA.FULLNAME.name]: Yup.string().required(
    REQUIRED_MESSAGE
  ),
  [CUSTOMER_INFO_FORM_DATA.TEL.name]: Yup.string()
    .length(10, TEL_LENGTH_MESSAGE)
    .required(REQUIRED_MESSAGE)
});

class FormCustomer extends Component {
  defaultProps = {
    formData: { ...CUSTOMER_INFO_FORM_DATA },
    onFocus: () => {},
    onBlur: () => {}
  };

  state = {
    hasInputFocusing: false,
    isFocusing: false
  };
  refForm = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.formData !== this.props.formData) {
      const formData = this.initialValues(nextProps.formData);
      this.updateFormData(formData);
      return true;
    }

    return true;
  }

  initialValues(formData = this.props.formData) {
    const values = {};
    Object.values(formData).forEach(value => {
      values[value.name] = value.initValue;
    });
    return values;
  }

  updateFormData(formData) {
    Object.keys(formData).forEach(key => {
      this.handleSetValueFormData(key, formData[key]);
    });
  }

  handleSetValueFormData(key, value) {
    if (this.refForm.current) {
      this.refForm.current.setFieldValue(key, value);

      if (!!value) {
        setTimeout(() => this.refForm.current.setFieldTouched(key, true));
      }
    }
  }

  handleResetFormData() {
    if (this.refForm.current) {
      this.refForm.current.resetForm();
    }
    this.props.onReset();
  }

  handleInputFocus = () => {
    this.props.onFocus();
    this.setState({
      hasInputFocusing: true,
      isFocusing: true
    });
  };

  handleInputBlur = () => {
    this.setState({ isFocusing: false });
    setTimeout(() => {
      if (!this.state.isFocusing) {
        this.props.onBlur();
        this.setState({ hasInputFocusing: false });
      }
    });
  };

  renderFormData({ values }) {
    const { formData } = this.props;
    return Object.keys(formData).map((key, index) => {
      const { label, name, type } = formData[key];
      let extraProps = {};
      switch (name) {
        case formData.TEL.name:
          extraProps.keyboardType = appConfig.device.isIOS
            ? 'number-pad'
            : 'numeric';
          extraProps.maxLength = 10;
        default:
          return (
            <MyInput
              editable={this.props.formEditable}
              key={index}
              label={label}
              name={name}
              type={type}
              inputContainerStyle={
                !this.props.formEditable && styles.inputDisabled
              }
              containerStyle={[styles.input]}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              blurOnSubmit={false}
              {...extraProps}
            />
          );
      }
    });
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValues(CUSTOMER_INFO_FORM_DATA)}
        onSubmit={this.props.onSubmit}
        validationSchema={validationSchema}
        innerRef={this.refForm}
      >
        {props => {
          const disabled = !(props.isValid && props.dirty);
          const resetDisabled = Object.keys(props.values).some(
            key => !!props.values[key]
          );

          return (
            <View style={styles.container}>
              <View
                style={[styles.btnReset, !resetDisabled && styles.btnDisabled]}
              >
                <TouchableOpacity
                  disabled={!resetDisabled}
                  onPress={this.handleResetFormData.bind(this)}
                >
                  <Text style={styles.resetTitle}>Xóa</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <Form style={styles.formContainer}>
                  {this.renderFormData(props)}
                </Form>
              </ScrollView>

              {this.props.isShowSubmitBtn && (
                <Button
                  title="Xác nhận"
                  onPress={props.handleSubmit}
                  disabled={disabled}
                />
              )}
              {this.props.isShowSubmitBtn && appConfig.device.isIOS && (
                <KeyboardSpacer />
              )}
            </View>
          );
        }}
      </Formik>
    );
  }
}

export default FormCustomer;
