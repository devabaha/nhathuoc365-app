import React, {Component} from 'react';
import {
  StyleSheet,
  // ScrollView,
  View,
  // TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import appConfig from 'app-config';

import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Theme} from 'src/Themes/interface';
import {mergeStyles} from 'src/Themes/helper';
import {TypographyType} from 'src/components/base/Typography/constants';
import {TextButton} from 'src/components/base/Button';
import {Actions} from 'react-native-router-flux';
import Typography from 'src/components/base/Typography/Typography';
import ScrollView from 'src/components/base/ScrollView';
import Input from 'src/components/base/Input';
import ScreenWrapper from 'src/components/base/ScreenWrapper';
import Container from 'src/components/base/Container';

const LOGO_PATH = require('../../../images/btn-cart.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: '30%',
  },
  image: {
    width: 128,
    height: 82,
    top: -30,
  },
  welcomeText: {
    // color: 'black',
    // fontSize: 26,
    fontWeight: '800',
  },
  desText: {
    // color: 'black',
    // fontSize: 18,
    marginTop: 8,
    marginBottom: 22,
    fontWeight: '300',
  },
  phoneContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  countryContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    // backgroundColor: '#dddddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  phoneTextInput: {
    flex: 1,
    borderRadius: 5,
    // backgroundColor: '#dddddd',
    fontSize: 25,
    padding: 5,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  flagStyle: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  countryCode: {
    // fontSize: 25,
  },
  phoneNumber: {
    // fontSize: 15,
  },
  continueText: {
    // color: 'black',
    // fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  txtNote: {
    // color: 'red',
    marginTop: 20,
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20,
    padding: 10,
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

class PhoneRegister extends Component {
  static contextType = ThemeContext;
  static defaultProps = {
    onCloseOTP: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChangePhoneNumber(phoneNumber) {
    this.props.onChangePhoneNumber(phoneNumber);
  }

  onPress() {
    Actions.push(appConfig.routes.homeTab);
  }

  get theme(): Theme {
    return getTheme(this);
  }

  render() {
    const theme = this.theme;
    const {
      t,
      phoneNumber,
      country,
      message,
      registerDisabled,
      onSignIn,
    } = this.props;

    const countryContainerStyle = mergeStyles(styles.countryContainer, {
      backgroundColor: theme.color.neutral1,
    });

    const phoneTextInputStyle = mergeStyles(styles.phoneTextInput, {
      backgroundColor: theme.color.neutral1,
      color: theme.color.black,
    });

    const phoneNumberStyle = mergeStyles(styles.phoneNumber, {
      color: theme.color.black,
    });

    const txtNoteStyle = mergeStyles(styles.txtNote, {
      color: theme.color.danger,
    });

    const continueTextStyle = [
      styles.continueText,
      {
        color: !registerDisabled
          ? theme.color.textPrimary
          : theme.color.textInactive,
      },
    ];

    return (
      <ScreenWrapper>
        <ScrollView
          safeLayout
          keyboardShouldPersistTaps="handled"
          bounces={false}
          style={styles.container}
          contentContainerStyle={styles.content}>
          <Image resizeMode="contain" style={styles.image} source={LOGO_PATH} />
          <Typography
            type={TypographyType.DISPLAY_SMALL}
            style={styles.welcomeText}>
            {t('phoneWelcomeMessage')}
          </Typography>
          <Typography type={TypographyType.TITLE_MEDIUM} style={styles.desText}>
            {t('phoneDescription')}
          </Typography>
          <View style={styles.phoneContainer}>
            <TouchableWithoutFeedback onPress={this.props.onPressCountry}>
              <Container style={countryContainerStyle}>
                <Typography
                  type={TypographyType.DISPLAY_SMALL}
                  style={styles.countryCode}>
                  {country ? country.flag : ''}
                </Typography>
                <Typography
                  type={TypographyType.TITLE_MEDIUM}
                  style={phoneNumberStyle}>
                  {country
                    ? (country.idd.root ? country.idd.root : '') +
                      (country.idd.suffixes[0] ? country.idd.suffixes[0] : '')
                    : ''}
                </Typography>
              </Container>
            </TouchableWithoutFeedback>
            <Input
              style={phoneTextInputStyle}
              value={phoneNumber}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder={t('phonePlaceholder')}
              onChangeText={this.handleChangePhoneNumber.bind(this)}
              onSubmitEditing={() => (!registerDisabled ? onSignIn() : {})}
            />
          </View>
          <TextButton
            activeOpacity={0.5}
            onPress={onSignIn}
            disabled={registerDisabled}>
            <Typography
              type={TypographyType.TITLE_LARGE}
              style={continueTextStyle}>
              {t('phoneConfirmMessage')}
            </Typography>
          </TextButton>
          {!!message && (
            <Typography type={TypographyType.LABEL_MEDIUM} style={txtNoteStyle}>
              {message}
            </Typography>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default withTranslation('phoneAuth')(PhoneRegister);
