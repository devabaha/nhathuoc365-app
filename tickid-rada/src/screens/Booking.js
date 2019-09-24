import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  InputAccessoryView,
  Button,
  Keyboard
} from 'react-native';
// import { Constants, Location, Permissions } from 'expo'
import PropTypes from 'prop-types';
import Indicator from './Indicator';
import APIHandler from '../services/services';
import { SCREEN_WIDTH } from '../services/constants';
import { config } from '../services/config';

class Booking extends Component {
  static propTypes = {
    customerName: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    onBookingSuccess: PropTypes.func,
    onBookingFail: PropTypes.func,
    onCallWebHookSuccess: PropTypes.func,
    onCallWebHookFail: PropTypes.func
  };

  static defaultProps = {
    customerName: '',
    phone: '',
    address: '',
    onBookingSuccess: () => {},
    onBookingFail: () => {},
    onCallWebHookSuccess: () => {},
    onCallWebHookFail: () => {}
  };

  constructor(props) {
    super(props);
    const { customerName, phone, address } = this.props;
    this.state = {
      isShowIndicator: false,
      customerName: customerName,
      phone: phone,
      address: address,
      description: '',
      userCurrentLocation: config.defaultLocation
    };
    this.isEnabledOrderButton = false;
  }

  _onPressOrderNow() {
    if (this.isEnabledOrderButton) {
      this.doBooking();
    }
  }

  componentDidMount() {
    this.getUserLocation();
  }

  getUserLocation = () => {
    if (Platform.OS === 'ios') {
      // eslint-disable-next-line no-undef
      navigator.geolocation.requestAuthorization();
    }
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(
      position => {
        var crd = position.coords;
        const latitude = crd.latitude;
        const longitude = crd.longitude;
        console.log(`${latitude},${longitude}`);
        this.setState({ userCurrentLocation: `${latitude},${longitude}` });
      },
      err => {
        navigator.geolocation.requestAuthorization();
        console.warn(`ERROR(${err.code}): ${err.message}`);
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  getCurrentPositionAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        userCurrentLocation: `${location.latitude},${location.longitude}`
      });
    }
  };

  async doBooking() {
    try {
      const { service } = this.props;
      const {
        phone,
        address,
        customerName,
        description,
        userCurrentLocation
      } = this.state;
      let partnerAuthor = config.partnerAuthorization;
      let serviceId = service.id;
      let location = address;
      let latlng = userCurrentLocation;
      let appoint = Date.now();
      this.appoint = appoint;
      this.setState({ isShowIndicator: true });
      var response = await APIHandler.createRequest(
        partnerAuthor,
        serviceId,
        phone,
        location,
        customerName,
        description,
        appoint,
        latlng
      );
      if (response && response.status == 200) {
        this.setState({ isShowIndicator: false }, function() {
          if (config.webhookUrl) {
            this.callToWebHook(response);
          } else {
            this.props.onBookingSuccess(response);
          }
        });
      } else {
        this.setState({ isShowIndicator: false }, function() {
          this.props.onBookingFail(Error(response.message));
        });
      }
    } catch (e) {
      this.setState({ isShowIndicator: false }, function() {
        this.props.onBookingFail(e);
      });
    }
  }

  async callToWebHook(request) {
    try {
      const { service, config } = this.props.service;
      const {
        phone,
        address,
        customerName,
        description,
        userCurrentLocation
      } = this.state;
      let partnerAuthor = config.partnerAuthorization;
      let url = config.webhookUrl;
      let serviceId = service.id;
      let location = address;
      let requestId = request.id;
      this.setState({ isShowIndicator: true });
      var response = await APIHandler.callWebHook(
        partnerAuthor,
        serviceId,
        phone,
        location,
        customerName,
        description,
        appoint,
        userCurrentLocation,
        requestId,
        url
      );
      if (response && response.status == 200) {
        this.setState({ isShowIndicator: false }, function() {
          this.props.onCallWebHookSuccess(response);
        });
      } else {
        this.setState({ isShowIndicator: false }, function() {
          this.props.onCallWebHookFail(Error(response.message));
        });
      }
    } catch (e) {
      this.setState({ isShowIndicator: false }, function() {
        this.props.onCallWebHookFail(e);
      });
    }
  }

  render() {
    const { customerName, phone, address, isShowIndicator } = this.state;
    this.isEnabledOrderButton =
      customerName !== '' && phone !== '' && address !== '';
    const inputAccessoryViewID = 'radaDoneButton';
    return (
      <View style={styles.container}>
        <ScrollView keyboardDismissMode="interactive">
          <View style={styles.contentView}>
            <Indicator loading={isShowIndicator} />
            <View style={styles.textInputView}>
              <Image
                style={styles.iconImage}
                source={require('../assets/ic_user.png')}
              />
              <TextInput
                value={customerName}
                style={styles.textInput}
                placeholder="Tên của bạn"
                numberOfLines={1}
                onChangeText={text => this.setState({ customerName: text })}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                style={styles.iconImage}
                source={require('../assets/ic_phone.png')}
              />
              <TextInput
                value={phone}
                style={styles.textInput}
                placeholder="Số điện thoại"
                numberOfLines={1}
                keyboardType="phone-pad"
                onChangeText={text => this.setState({ phone: text })}
                inputAccessoryViewID={inputAccessoryViewID}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                style={styles.iconImage}
                source={require('../assets/ic_location.png')}
              />
              <TextInput
                value={address}
                style={styles.textInput}
                placeholder="Số nhà, tên đường, tỉnh thành,..."
                numberOfLines={1}
                onChangeText={text => this.setState({ address: text })}
              />
            </View>
            <View style={styles.textArea}>
              <TextInput
                style={styles.descriptionText}
                placeholder="Mô tả yêu cầu của bạn tại đây..."
                multiline={true}
                numberOfLines={4}
                onChangeText={text => this.setState({ description: text })}
                inputAccessoryViewID={inputAccessoryViewID}
              />
            </View>
            <TouchableOpacity onPress={this._onPressOrderNow.bind(this)}>
              <View
                style={
                  this.isEnabledOrderButton
                    ? styles.orderButtonViewEnabled
                    : styles.orderButtonViewDisabled
                }
              >
                <Text style={styles.orderButtonText}>ĐẶT NGAY</Text>
              </View>
            </TouchableOpacity>
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <View
                style={{ alignItems: 'flex-end', backgroundColor: 'white' }}
              >
                <Button onPress={() => Keyboard.dismiss()} title="Xong" />
              </View>
            </InputAccessoryView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#F9F9F9'
  },
  contentView: {
    marginTop: 20,
    alignItems: 'center'
  },
  iconImage: {
    width: 25,
    height: 25,
    marginLeft: 0
  },
  textInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 8,
    marginHorizontal: 16,
    paddingLeft: 10
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 15,
    paddingVertical: 15
  },
  textArea: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 20,
    marginHorizontal: 16,
    height: 140,
    paddingBottom: 5,
    paddingHorizontal: 8
  },
  descriptionText: {
    fontSize: 15,
    flex: 1
  },
  orderButtonViewEnabled: {
    width: SCREEN_WIDTH - 32,
    backgroundColor: '#772F80',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  orderButtonViewDisabled: {
    width: SCREEN_WIDTH - 32,
    backgroundColor: 'lightgray',
    borderRadius: 10
  },
  orderButtonText: {
    padding: 14,
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'
  }
});

export default Booking;
