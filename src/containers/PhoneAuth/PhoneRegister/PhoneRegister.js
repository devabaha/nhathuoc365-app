import React, {Component} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Image} from 'react-native';
// 3-party libs
import {Actions} from 'react-native-router-flux';
//configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// customs components
import {
  TextButton,
  Typography,
  ScrollView,
  Input,
  ScreenWrapper,
  Container,
} from 'src/components/base';

const LOGO_PATH = require('src/images/btn-cart.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '800',
  },
  desText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 25,
    padding: 5,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  countryCode: {
    marginRight: appConfig.device.isAndroid ? 4 : 0,
  },
  phoneNumber: {},
  continueText: {
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  txtNote: {
    marginTop: 20,
  },
  txtCode: {
    fontWeight: '800',
    fontSize: 20,
    padding: 10,
  },
});

class PhoneRegister extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    onCloseOTP: () => {},
  };

  state = {};

  get theme() {
    return getTheme(this);
  }

  handleChangePhoneNumber(phoneNumber) {
    this.props.onChangePhoneNumber(phoneNumber);
  }

  onPress() {
    Actions.push(appConfig.routes.homeTab);
  }

  continueBtnTypoProps = {type: TypographyType.TITLE_LARGE};

  blockStyle = {
    backgroundColor: this.theme.color.contentBackgroundStrong,
  };

  countryContainerStyle = mergeStyles(
    [styles.countryContainer, this.blockStyle],
    {
      borderRadius: this.theme.layout.borderRadiusSmall,
    },
  );

  phoneTextInputStyle = mergeStyles([styles.phoneTextInput, this.blockStyle], {
    borderRadius: this.theme.layout.borderRadiusSmall,
  });

  txtNoteStyle = mergeStyles(styles.txtNote, {
    color: this.theme.color.danger,
  });

  render() {
    const {
      t,
      phoneNumber,
      country,
      message,
      registerDisabled,
      onSignIn,
    } = this.props;

    return (
      <ScreenWrapper>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={false}
          style={styles.container}
          contentContainerStyle={styles.content}>
          <Image resizeMode="contain" style={styles.image} source={LOGO_PATH} />
          <Typography
            type={TypographyType.LABEL_DISPLAY_SMALL}
            style={styles.welcomeText}>
            {t('phoneWelcomeMessage')}
          </Typography>
          <Typography type={TypographyType.TITLE_MEDIUM} style={styles.desText}>
            {t('phoneDescription')}
          </Typography>
          <View style={styles.phoneContainer}>
            <TouchableWithoutFeedback onPress={this.props.onPressCountry}>
              <Container style={this.countryContainerStyle}>
                <Typography
                  type={TypographyType.LABEL_DISPLAY_SMALL}
                  style={styles.countryCode}>
                  {country ? country.flag : ''}
                </Typography>
                <Typography type={TypographyType.TITLE_MEDIUM}>
                  {country
                    ? (country.idd.root ? country.idd.root : '') +
                      (country.idd.suffixes[0] ? country.idd.suffixes[0] : '')
                    : ''}
                </Typography>
              </Container>
            </TouchableWithoutFeedback>
            <Input
              style={this.phoneTextInputStyle}
              value={phoneNumber}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
              placeholder={t('phonePlaceholder')}
              onChangeText={this.handleChangePhoneNumber.bind(this)}
              onSubmitEditing={() => (!registerDisabled ? onSignIn() : {})}
            />
          </View>
          <TextButton
            onPress={onSignIn}
            disabled={registerDisabled}
            typoProps={this.continueBtnTypoProps}
            style={styles.continueText}>
            {t('phoneConfirmMessage')}
          </TextButton>
          {!!message && (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={this.txtNoteStyle}>
              {message}
            </Typography>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default withTranslation('phoneAuth')(PhoneRegister);
