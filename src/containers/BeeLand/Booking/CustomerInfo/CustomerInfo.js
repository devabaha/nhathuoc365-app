import React, { Component, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Keyboard } from 'react-native';

import Animated, { set, useCode, Easing } from 'react-native-reanimated';
import appConfig from 'app-config';
import Block from '../Block';
import SearchCustomer from './SearchCustomer';
import APIRequest from '../../../../network/Entity/APIRequest';
import Loading from '../../../../components/Loading';
import FormCustomer from './FormCustomer';
import { CUSTOMER_INFO_FORM_DATA } from './constants';
import { Actions } from 'react-native-router-flux';
import { getProgressDataActivedComponent } from '../helper';
import { useValue, timing } from 'react-native-redash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchBlock: {
    backgroundColor: '#f0f0f0',
    paddingBottom: 15
  }
});

class CustomerInfo extends Component {
  state = {
    loading: false,
    searchValue: '',
    customerInfoFormData: { ...CUSTOMER_INFO_FORM_DATA },
    formEditable: true,
    isAnimateLayoutForInputFocusing: false,
    isSearchInputFocusing: false
  };
  searchCustomerRequest = new APIRequest();
  addCustomerRequest = new APIRequest();
  requests = [this.searchCustomerRequest, this.addCustomerRequest];

  animatedTranslateY = new Animated.Value(0);

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  handleChangeText = searchValue => {
    this.setState({ searchValue });
  };

  async handleSeachCustomer() {
    Keyboard.dismiss();
    this.setState({ loading: true });
    const { t } = this.props;
    const data = {
      keyword: this.state.searchValue,
      id_code: this.props.staff.id_code,
      company_name: this.props.staff.company_name
    };
    try {
      this.searchCustomerRequest.data = APIHandler.user_search_customer_beeland(
        data
      );
      const response = await this.searchCustomerRequest.promise();
      console.log(response);
      if (response.status === STATUS_SUCCESS && response.data) {
        if (response.data.list_user && response.data.list_user.length !== 0) {
          const customerInfoFormData = this.normalizeCustomerInfoToFormData(
            response.data.list_user[0]
          );

          this.setState({
            customerInfoFormData,
            formEditable: false
          });
        } else {
          this.handleResetCustomerInfoFormData();
          flashShowMessage({
            type: 'danger',
            message: 'Không tìm thấy người dùng'
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
    } catch (err) {
      console.log('search_customer_beeland', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  normalizeCustomerInfoToFormData(customerInfo) {
    const customerInfoFormData = { ...this.state.customerInfoFormData };
    Object.keys(customerInfoFormData).forEach(key => {
      const info = { ...customerInfoFormData[key] };
      Object.keys(customerInfo).forEach(paramName => {
        if (info.name === paramName) {
          info.initValue = customerInfo[paramName];
        }
      });
      customerInfoFormData[key] = info;
    });

    return customerInfoFormData;
  }

  handleResetCustomerInfoFormData() {
    Keyboard.dismiss();
    this.setState({
      customerInfoFormData: { ...CUSTOMER_INFO_FORM_DATA },
      formEditable: true
    });
  }

  async handleSubmit(values) {
    Keyboard.dismiss();
    this.setState({ loading: true });

    Object.keys(values).forEach(key => {
      values[key] = values[key].trim();
    });

    const { t } = this.props;
    const data = {
      ...values,
      id_code: this.props.staff.id_code,
      company_name: this.props.staff.company_name
    };
    try {
      this.addCustomerRequest.data = APIHandler.user_add_customer_beeland(data);
      const response = await this.addCustomerRequest.promise();
      console.log(response);
      if (response.status === STATUS_SUCCESS && response.data) {
        const customer = response.data.user;
        if (customer) {
          const customerInfoFormData = this.normalizeCustomerInfoToFormData(
            customer
          );

          this.setState({
            customerInfoFormData,
            formEditable: false
          });

          Actions.push(appConfig.routes.confirmBookingBeeLand, {
            customer,
            room: this.props.room,
            staff: this.props.staff,
            siteId: this.props.siteId
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
    } catch (err) {
      console.log('search_customer_beeland', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  handleHeaderLayout(e) {
    if (this.state.headerHeight === undefined) {
      this.setState({ headerHeight: e.nativeEvent.layout.height });
    }
  }
  handleInputFocus() {
    this.setState({
      isAnimateLayoutForInputFocusing: true
    });
  }

  handleInputBlur() {
    this.setState({
      isAnimateLayoutForInputFocusing: false
    });
  }

  handleSearchInputFocus() {
    this.setState({
      isSearchInputFocusing: true
    });
  }

  handleSearchInputBlur() {
    this.setState({
      isSearchInputFocusing: false
    });
  }

  render() {
    const isShowSubmitBtn = !this.state.isSearchInputFocusing;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        <AnimatedWrapper isActive={this.state.isAnimateLayoutForInputFocusing}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            scrollEnabled={false}
          >
            {getProgressDataActivedComponent(0)}
            <Block
              containerStyle={styles.searchBlock}
              title="Thông tin bên mua"
            >
              <SearchCustomer
                disabled={!this.state.searchValue}
                onChangeText={this.handleChangeText}
                onPress={this.handleSeachCustomer.bind(this)}
                onSearchInputFocus={this.handleSearchInputFocus.bind(this)}
                onSearchInputBlur={this.handleSearchInputBlur.bind(this)}
              />
            </Block>
          </ScrollView>
        </AnimatedWrapper>

        <FormCustomer
          formData={this.state.customerInfoFormData}
          formEditable={this.state.formEditable}
          onReset={this.handleResetCustomerInfoFormData.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          onFocus={this.handleInputFocus.bind(this)}
          onBlur={this.handleInputBlur.bind(this)}
          isShowSubmitBtn={isShowSubmitBtn}
        />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(CustomerInfo);

const AnimatedWrapper = ({ children, isActive }) => {
  const [height, setHeight] = useState(undefined);
  const [active, setActive] = useState(false);
  const animatedHeight = useValue(0);

  React.useEffect(() => {
    setTimeout(() => {
      setActive(isActive);
    });
  }, [isActive]);

  useCode(() => {
    return set(
      animatedHeight,
      timing({
        from: animatedHeight,
        to: active ? 1 : 0,
        easing: Easing.out(Easing.quad),
        duration: 300
      })
    );
  }, [active]);

  function handleLayout(e) {
    if (height === undefined) {
      setHeight(e.nativeEvent.layout.height);
    }
  }

  return (
    <Animated.View
      style={{
        height:
          height !== undefined
            ? animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0]
              })
            : undefined
      }}
      onLayout={handleLayout}
    >
      {children}
    </Animated.View>
  );
};
