import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

import appConfig from 'app-config';

const LOGO_PATH = require('../../../images/logo-640x410.jpg');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16
  },
  content: {
    paddingTop: '30%'
  },
  image: {
    width: 128,
    height: 82,
    top: -30
  },
  welcomeText: {
    color: 'black',
    fontSize: 26,
    fontWeight: '800'
  },
  desText: {
    color: 'black',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '300'
  },
  phoneContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  countryContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  phoneTextInput: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: '#dddddd',
    fontSize: 25,
    padding: 5,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  flagStyle: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  countryCode: {
    fontSize: 25
  },
  phoneNumber: {
    fontSize: 15
  },
  continueText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20
  },
  txtNote: {
    color: 'red',
    marginTop: 20
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20,
    padding: 10
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

class PhoneRegister extends Component {
  static defaultProps = {
    onCloseOTP: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangePhoneNumber(phoneNumber) {
    this.props.onChangePhoneNumber(phoneNumber);
  }

  render() {
    const {
      t,
      phoneNumber,
      country,
      message,
      registerDisabled,
      onSignIn
    } = this.props;

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Image resizeMode="contain" style={styles.image} source={LOGO_PATH} />
        <Text style={styles.welcomeText}>{t('phoneWelcomeMessage')}</Text>
        <Text style={styles.desText}>{t('phoneDescription')}</Text>
        <View style={styles.phoneContainer}>
          <TouchableWithoutFeedback onPress={this.props.onPressCountry}>
            <View style={styles.countryContainer}>
              <Text style={styles.countryCode}>
                {country ? country.flag : ''}
              </Text>
              <Text style={styles.phoneNumber}>
                {country
                  ? (country.idd.root ? country.idd.root : '') +
                    (country.idd.suffixes[0] ? country.idd.suffixes[0] : '')
                  : ''}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            style={styles.phoneTextInput}
            value={phoneNumber}
            keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
            placeholder={t('phonePlaceholder')}
            onChangeText={this.handleChangePhoneNumber.bind(this)}
            onSubmitEditing={!registerDisabled ? onSignIn : undefined}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onSignIn}
          disabled={registerDisabled}
        >
          <Text
            style={[
              styles.continueText,
              { color: !registerDisabled ? 'black' : 'lightgray' }
            ]}
          >
            {t('phoneConfirmMessage')}
          </Text>
        </TouchableOpacity>
        {!!message && <Text style={styles.txtNote}>{message}</Text>}
      </ScrollView>
    );
  }
}

export default withTranslation('phoneAuth')(PhoneRegister);
