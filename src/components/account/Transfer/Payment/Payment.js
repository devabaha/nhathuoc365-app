import React, {Component} from 'react';
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
// helpers
import {formatMoney} from './helper';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import Input from './Input';
import Button from 'src/components/Button';
import PaymentWallet from './PaymentWallet';
import Image from 'src/components/Image';
import {
  Container,
  ScreenWrapper,
  ScrollView,
  Typography,
} from 'src/components/base';

const MAX_NOTE_LENGTH = 160;

class Payment extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    contactThumbnail: PropTypes.string,
    receiver: PropTypes.object,
  };
  static defaultProps = {
    contactName: '',
    contactPhone: '',
    contactThumbnail: '',
    receiver: {},
  };

  state = {
    note: '',
    moneyError: '',
  };
  moneyInput = React.createRef();
  noteInput = React.createRef();
  unmounted = false;
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  onNoteChange = (e, note) => {
    this.setState({note});
  };

  goToConfirm = () => {
    if (this.moneyInput.current) {
      const isValid = this.checkValidate(this.moneyInput.current.inputText);
      if (isValid) {
        const price =
          this.moneyInput.current.formattedText +
          ' ' +
          this.props.wallet.symbol;

        push(appConfig.routes.transferConfirm, {
          receiver: this.props.receiver,
          wallet: this.props.wallet,
          originPrice: this.moneyInput.current.inputText,
          price,
          originTotalPrice: this.moneyInput.current.formattedText,
          totalPrice: price,
        });
      }
    }
  };

  checkValidate(text) {
    let moneyError = '';
    const min_transfer_view = formatMoney(this.props.wallet.min_transfer);
    const max_transfer_view = formatMoney(this.props.wallet.max_transfer);
    const {t} = this.props;

    try {
      if (!text) {
        moneyError = t('validate.empty');
      } else if (text < Number(this.props.wallet.min_transfer)) {
        moneyError = t('validate.min', {
          money: min_transfer_view + this.props.wallet.symbol,
        });
      } else if (text > Number(this.props.wallet.max_transfer)) {
        moneyError = t('validate.max', {
          money: max_transfer_view + this.props.wallet.symbol,
        });
      }

      this.setState({moneyError});

      return !!!moneyError;
    } catch (err) {
      console.log('money input error', err);
    }

    return false;
  }

  clearMoneyError = () => {
    this.setState({moneyError: ''});
  };

  handleOnBlurMoney = () => {
    const text = this.moneyInput.current
      ? this.moneyInput.current.inputText
      : '';
    this.checkValidate(text);
  };

  renderAvatar = () => {
    let shortTitle = '',
      contactName = this.props.receiver.name;

    if (contactName) {
      contactName = contactName.split(' ');
      contactName.map(
        (name, index) =>
          index <= 2 && (shortTitle += name.charAt(0).toUpperCase()),
      );
    }

    return (
      <>
        {!!this.props.receiver.avatar ? (
          <Image
            style={styles.avatar}
            source={{uri: this.props.receiver.avatar}}
            resizeMode="cover"
          />
        ) : (
          <Typography
            type={TypographyType.LABEL_DISPLAY_SMALL}
            style={styles.shortContactName}>
            {shortTitle}
          </Typography>
        )}
      </>
    );
  };

  get activeBoxStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidth,
      borderBottomWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  get avatarContainerStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.primaryHighlight,
      backgroundColor: this.theme.color.contentBackgroundStrong,
    };
  }

  render() {
    const {t} = this.props;
    const extraStyle = this.props.showWallet && {top: -60};
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={appConfig.device.isIOS ? 'padding' : null}>
        <ScreenWrapper safeLayout>
          <ScrollView keyboardShouldPersistTaps="handled">
            {!!this.props.showWallet && (
              <PaymentWallet
                sourceTitle="Nguồn tiền"
                sourceValue={this.props.wallet.name}
                balanceTitle="Số dư"
                balanceValue={this.props.wallet.balance_view}
              />
            )}

            <Container style={[styles.box, this.activeBoxStyle, extraStyle]}>
              <View style={styles.user}>
                <View
                  style={[this.avatarContainerStyle, styles.avatarContainer]}>
                  {this.renderAvatar()}
                </View>

                <View style={styles.informationContainer}>
                  <Typography
                    type={TypographyType.LABEL_HUGE}
                    style={styles.title}>
                    {this.props.receiver.name}
                  </Typography>
                  <Typography
                    type={TypographyType.LABEL_LARGE}
                    style={styles.subTitle}>
                    {this.props.receiver.tel}
                  </Typography>
                  {!!this.props.receiver.address && (
                    <Typography
                      type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                      style={styles.subTitle}>
                      {this.props.receiver.address}
                    </Typography>
                  )}
                </View>
              </View>

              <Input
                ref={this.moneyInput}
                placeholder={t('input.money.placeholder')}
                keyboardType="number-pad"
                title={t('input.money.title')}
                errorMess={this.state.moneyError}
                onChange={this.clearMoneyError}
                onClear={this.clearMoneyError}
                onBlur={this.handleOnBlurMoney}
              />

              <Input
                ref={this.noteInput}
                onChange={this.onNoteChange}
                placeholder={t('input.note.placeholder')}
                title={t('input.note.title', {
                  counter: `${this.state.note.length}/${MAX_NOTE_LENGTH}`,
                })}
                multiline
                maxLength={MAX_NOTE_LENGTH}
                containerStyle={{marginBottom: 0}}
              />
            </Container>
          </ScrollView>
          <Button title={t('transferBtnTitle')} onPress={this.goToConfirm} />
        </ScreenWrapper>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  box: {
    marginTop: 60,
    marginBottom: 10,
    paddingBottom: 15,
    justifyContent: 'flex-end',
  },
  user: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: -40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    overflow: 'hidden',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  shortContactName: {
    fontWeight: 'bold',
  },
  informationContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
  },
  subTitle: {
    marginTop: 5,
  },
});

export default withTranslation('payment')(observer(Payment));
