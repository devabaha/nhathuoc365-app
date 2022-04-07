import React, {Component} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withTranslation} from 'react-i18next';
import Loading from '@tickid/tickid-rn-loading';
// configs
import config from '../../config';
// network
import {internalFetch} from '../../helper/apiFetch';
// helpers
import {showMessage} from '../../constants';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import EventTracker from 'app-helper/EventTracker';
// images
import lockImage from '../../assets/images/locked.png';
// custom components
import SubmitButton from '../../component/SubmitButton';
import AuthenKeyboardModal from 'app-packages/tickid-authen-keyboard';
import {FieldItemWrapper, FieldItem} from '../../component/FieldItem';
import {
  Container,
  ScreenWrapper,
  Typography,
  TypographyType,
  ScrollView,
} from 'src/components/base';
import Image from 'src/components/Image';

const PASSWORD_STORAGE_KEY = 'PASSWORD_STORAGE_KEY';
const PASSWORD_LENGTH = 4;

class BuyCardConfirm extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    isBuyCard: PropTypes.bool,
    hasPass: PropTypes.bool,
    card: PropTypes.object,
    network: PropTypes.object,
    type: PropTypes.string,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    serviceId: PropTypes.string,
    historyTitle: PropTypes.string,
    quantity: PropTypes.number,
  };

  static defaultProps = {
    isBuyCard: false,
    hasPass: false,
    card: undefined,
    network: undefined,
    type: '',
    contactName: '',
    contactPhone: '',
    serviceId: undefined,
    historyTitle: '',
    quantity: 0,
  };

  state = {
    authenPasswordStored: null,
    passwordValue: [],
    newPasswordValue: [],
    repeatPasswordValue: [],
    showAuthenKeyboard: false,
    showNewPasswordKeyboard: false,
    showRepeatPasswordKeyboard: false,
    isSensorAvailable: false,
    showLoading: false,
  };
  updateNavBarDisposer = () => {};
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  get messages() {
    return {
      sourceMoney: this.props.t('confirm.moneySource'),
      transaction: {
        detail: this.props.t('confirm.transaction.detail'),
        type: this.props.t('confirm.transaction.type'),
        form: {
          sendTo: this.props.t('confirm.transaction.form.sendTo'),
          tel: this.props.t('confirm.transaction.form.tel'),
          network: this.props.t('confirm.transaction.form.network'),
          cardNumber: this.props.t('confirm.transaction.form.cardNumber'),
          subCardNumber: this.props.t('confirm.transaction.form.subCardNumber'),
          month: this.props.t('confirm.transaction.form.month'),
          value: this.props.t('confirm.transaction.form.value'),
          quantity: this.props.t('confirm.transaction.form.quantity'),
          discount: this.props.t('confirm.transaction.form.discount'),
          fee: {
            title: this.props.t('confirm.transaction.form.fee.title'),
            value: this.props.t('confirm.transaction.form.fee.value'),
          },
          price: this.props.t('confirm.transaction.form.price'),
        },
      },
      error: {
        passwordNotMatch: {
          title: this.props.t('confirm.error.passwordNotMatch.title'),
          message: this.props.t('confirm.error.passwordNotMatch.message'),
          accept: this.props.t('confirm.error.passwordNotMatch.accept'),
        },
        network: this.props.t('confirm.error.network'),
      },
      fingerprintScanner: {
        authenMessage: this.props.t('confirm.fingerprintScanner.authenMessage'),
      },
      secure: this.props.t('confirm.secure'),
      confirm: this.props.t('confirm.confirm'),
      modal: {
        newPass: {
          title: this.props.t('confirm.modal.newPass.title'),
          message: this.props.t('confirm.modal.newPass.message'),
        },
        renEnterPass: {
          title: this.props.t('confirm.modal.renEnterPass.title'),
          message: this.props.t('confirm.modal.renEnterPass.message'),
        },
      },
    };
  }

  get passwordValue() {
    return this.state.passwordValue.join('');
  }

  get newPasswordValue() {
    return this.state.newPasswordValue.join('');
  }

  get repeatPasswordValue() {
    return this.state.repeatPasswordValue.join('');
  }

  get isBuyCard() {
    return !!this.props.isBuyCard;
  }

  componentDidMount() {
    // FingerprintScanner.isSensorAvailable()
    //   .then(biometryType => {
    //     this.setState({
    //       biometryType,
    //       isSensorAvailable: true
    //     });
    //   })
    //   .catch(error => this.setState({ errorMessage: error.message }));

    this.loadStoredPassword();
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.updateNavBarDisposer();
    this.eventTracker.clearTracking();
  }

  loadStoredPassword = async () => {
    try {
      const authenPasswordStored = await AsyncStorage.getItem(
        PASSWORD_STORAGE_KEY,
      );
      if (authenPasswordStored !== null) {
        this.setState({authenPasswordStored});
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleConfirm = () => {
    if (!this.props.hasPass) {
      this.setState({
        showNewPasswordKeyboard: true,
      });
    } else {
      this.setState(
        {
          showAuthenKeyboard: true,
        },
        () => {
          // if (this.state.isSensorAvailable && this.state.authenPasswordStored) {
          //   this.handleOpenFingerprint();
          // }
        },
      );
    }
  };

  handleCloseAuthenKeyboard = () => {
    this.setState({
      showAuthenKeyboard: false,
    });

    setTimeout(() => {
      this.setState({
        passwordValue: [],
      });
    }, 500);
  };

  handlePressKeyboard = (buttonValue) => {
    if (this.state.passwordValue.length >= PASSWORD_LENGTH) return;
    this.setState(
      (prevState) => ({
        passwordValue: [...prevState.passwordValue, buttonValue],
      }),
      () => {
        if (this.state.passwordValue.length >= PASSWORD_LENGTH) {
          this.handleBuyCard(this.passwordValue);
        }
      },
    );
  };

  handleClearPassword = () => {
    const passwordValue = [...this.state.passwordValue];
    if (passwordValue.length > 0) {
      passwordValue.pop();
      this.setState({passwordValue});
    }
  };

  handleCloseNewPasswordKeyboard = () => {
    this.setState({
      newPasswordValue: [],
      showNewPasswordKeyboard: false,
    });
  };

  handlePressNewPasswordKeyboard = (buttonValue) => {
    if (this.state.newPasswordValue.length >= PASSWORD_LENGTH) return;

    this.setState(
      (prevState) => ({
        newPasswordValue: [...prevState.newPasswordValue, buttonValue],
      }),
      () => {
        if (this.state.newPasswordValue.length >= PASSWORD_LENGTH) {
          this.setState(
            {
              showNewPasswordKeyboard: false,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  showRepeatPasswordKeyboard: true,
                });
              }, 500);
            },
          );
        }
      },
    );
  };

  handleClearNewPasswordPassword = () => {
    const newPasswordValue = [...this.state.newPasswordValue];
    if (newPasswordValue.length > 0) {
      newPasswordValue.pop();
      this.setState({newPasswordValue});
    }
  };

  handleCloseRepeatPasswordKeyboard = () => {
    this.setState({
      newPasswordValue: [],
      repeatPasswordValue: [],
      showRepeatPasswordKeyboard: false,
    });
  };

  handlePressRepeatPasswordKeyboard = (buttonValue) => {
    if (this.state.repeatPasswordValue.length >= PASSWORD_LENGTH) return;

    this.setState(
      (prevState) => ({
        repeatPasswordValue: [...prevState.repeatPasswordValue, buttonValue],
      }),
      () => {
        if (this.state.repeatPasswordValue.length >= PASSWORD_LENGTH) {
          this.handleMatchCreatPassword();
        }
      },
    );
  };

  saveNewPasswordToStorage = async (newPasswordValue) => {
    try {
      await AsyncStorage.setItem(PASSWORD_STORAGE_KEY, newPasswordValue);
    } catch (error) {
      console.log(error);
    }
  };

  saveNewPasswordToDb = (newPasswordValue) => {
    const options = {
      method: 'POST',
      body: {
        pw4n: newPasswordValue,
      },
    };
    return internalFetch(config.rest.password(), options);
  };

  handleMatchCreatPassword = () => {
    const {newPasswordValue, repeatPasswordValue} = this;
    if (newPasswordValue === repeatPasswordValue) {
      this.setState({
        authenPasswordStored: newPasswordValue,
      });
      this.saveNewPasswordToStorage(newPasswordValue);
      this.saveNewPasswordToDb(newPasswordValue).then((response) => {
        if (response.status === config.httpCode.success) {
          this.setState({showRepeatPasswordKeyboard: false});
          this.handleBuyCard(newPasswordValue);
        } else {
          showMessage({
            type: 'danger',
            message: response.message,
          });
          this.setState({
            showRepeatPasswordKeyboard: false,
            newPasswordValue: [],
            repeatPasswordValue: [],
          });

          setTimeout(() => {
            this.setState({showNewPasswordKeyboard: true});
          }, 2000);
        }
      });
    } else {
      this.handleTryCreatePassword();
    }
  };

  handleTryCreatePassword = () => {
    this.setState({
      showRepeatPasswordKeyboard: false,
      newPasswordValue: [],
      repeatPasswordValue: [],
    });
    const title = this.messages.error.passwordNotMatch.title;
    const message = this.messages.error.passwordNotMatch.message;

    setTimeout(() => {
      Alert.alert(title, message, [
        {
          text: this.messages.error.passwordNotMatch.accept,
          onPress: () => this.setState({showNewPasswordKeyboard: true}),
        },
      ]);
    }, 500);
  };

  handleClearRepeatPasswordPassword = () => {
    const repeatPasswordValue = [...this.state.repeatPasswordValue];
    if (repeatPasswordValue.length > 0) {
      repeatPasswordValue.pop();
      this.setState({repeatPasswordValue});
    }
  };

  handleForgotPress = () => {};

  printScanning;

  handleOpenFingerprint = () => {
    if (this.printScanning) return;
    this.printScanning = true;

    FingerprintScanner.authenticate({
      description: this.messages.fingerprintScanner.authenMessage,
    })
      .then(() => {
        this.setState({
          passwordValue: this.state.authenPasswordStored.split(''),
        });

        setTimeout(() => {
          this.handleBuyCard(this.state.authenPasswordStored);
        }, 250);
      })
      .finally(() => {
        this.printScanning = false;
      });
  };

  handleBuyCard = (authenPasswordStored) => {
    this.handleCloseAuthenKeyboard();

    this.setState({
      showLoading: true,
    });

    const options = {
      method: 'POST',
      body: {
        quantity: this.props.quantity,
        code: this.props.contactPhone
          ? this.props.contactPhone
          : this.props.cardNumber,
        price: this.props.card.price,
        service_id: this.props.network.id,
        zone_code: this.props.wallet.zone_code,
        pw4n: authenPasswordStored,
      },
    };
    if (this.props.times) {
      options.body.times = this.props.times;
      options.body.option = this.props.option;
    }

    internalFetch(config.rest.book(), options)
      .then((response) => {
        if (response.status === config.httpCode.success) {
          if (!this.state.authenPasswordStored) {
            this.saveNewPasswordToStorage(authenPasswordStored);
          }
          setTimeout(() => {
            config.route.push(
              config.routes.buyCardSuccess,
              {
                isBuyCard: this.isBuyCard,
                bookResponse: response,
                serviceId: this.props.serviceId,
                historyTitle: this.props.historyTitle,
              },
              this.theme,
            );
          }, 250);
        } else {
          showMessage({
            type: 'danger',
            message: response.message,
          });

          setTimeout(() => {
            if (!this.state.showAuthenKeyboard) {
              this.setState({
                passwordValue: [],
                showAuthenKeyboard: true,
              });
            }
          }, 2000);
        }
      })
      .catch(() => {
        showMessage({
          type: 'danger',
          message: this.messages.error.network,
        });
      })
      .finally(() => {
        this.setState({
          showLoading: false,
        });
      });
  };

  renderWallet = () => {
    if (!this.props.wallet) return null;
    return (
      <Container style={styles.row}>
        <Typography
          type={TypographyType.TITLE_SEMI_LARGE}
          style={styles.heading}>
          {this.messages.sourceMoney}
        </Typography>

        <View style={styles.walletWrapper}>
          {this.props.wallet.image && (
            <Image
              style={[styles.walletImage, this.walletImageStyle]}
              source={this.props.wallet.image}
            />
          )}
          <View style={styles.walletInfo}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={styles.walletName}>
              {this.props.wallet.name}
            </Typography>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.walletCost}>
              {this.props.wallet.balance_view}
            </Typography>
          </View>
        </View>
      </Container>
    );
  };

  get walletImageStyle() {
    return {
      borderRadius: this.theme.layout.border,
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidthPixel,
    };
  }

  render() {
    return (
      <ScreenWrapper style={styles.container}>
        <ScrollView>
          <View>
            {this.renderWallet()}

            <Container style={[styles.row, {marginTop: 8}]}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.heading}>
                {this.messages.transaction.detail}
              </Typography>

              <View style={styles.cardInfoWrapper}>
                <View style={styles.fieldWrapper}>
                  <FieldItemWrapper separate>
                    <FieldItem
                      label={this.messages.transaction.type}
                      value={this.props.type}
                    />
                    {!!this.props.contactName && (
                      <FieldItem
                        label={this.messages.transaction.form.sendTo}
                        value={this.props.contactName}
                      />
                    )}

                    {!!this.props.contactPhone && (
                      <FieldItem
                        label={this.messages.transaction.form.tel}
                        value={this.props.contactPhone}
                      />
                    )}

                    <FieldItem
                      label={this.messages.transaction.form.network}
                      value={this.props.network.name}
                    />
                    {!!this.props.cardNumber && (
                      <FieldItem
                        label={this.messages.transaction.form.cardNumber}
                        value={this.props.cardNumber}
                      />
                    )}
                    {!!this.props.subCard && (
                      <FieldItem
                        label={this.messages.transaction.form.subCardNumber}
                        value={this.props.subCard}
                      />
                    )}
                    {!!this.props.totalMonth && (
                      <FieldItem
                        label={this.messages.transaction.form.month}
                        value={this.props.totalMonth}
                      />
                    )}
                    <FieldItem
                      label={this.messages.transaction.form.value}
                      value={this.props.card.label}
                    />
                    {this.props.quantity > 0 && (
                      <FieldItem
                        label={this.messages.transaction.form.quantity}
                        value={this.props.quantity}
                      />
                    )}
                    <FieldItem
                      label={this.messages.transaction.form.discount}
                      value={this.props.card.cashbackValue}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper separate>
                    <FieldItem
                      label={this.messages.transaction.form.fee.title}
                      value={this.messages.transaction.form.fee.value}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper>
                    <FieldItem
                      label={this.messages.transaction.form.price}
                      value={this.props.card.total_price}
                      boldValue
                    />
                  </FieldItemWrapper>
                </View>
              </View>
            </Container>

            <View style={styles.secureWrapper}>
              <Typography
                type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                style={styles.secureText}>
                {this.messages.secure}
              </Typography>
            </View>
          </View>
        </ScrollView>

        <SubmitButton
          safeLayout
          title={this.messages.confirm}
          iconSource={lockImage}
          onPress={this.handleConfirm}
        />
        {/* Authen key board */}
        <AuthenKeyboardModal
          hideClose
          showForgotPassword={false}
          visible={this.state.showAuthenKeyboard}
          showFingerprint={
            // !!(this.state.isSensorAvailable && this.state.authenPasswordStored)
            false
          }
          passwordValue={this.passwordValue}
          onClose={this.handleCloseAuthenKeyboard}
          onPressKeyboard={this.handlePressKeyboard}
          onClearPassword={this.handleClearPassword}
          onForgotPress={this.handleForgotPress}
          // onOpenFingerprint={this.handleOpenFingerprint}
        />
        {/* New password keyboard */}
        <AuthenKeyboardModal
          hideClose
          headerTitle={this.messages.modal.newPass.title}
          description={this.messages.modal.newPass.message}
          visible={this.state.showNewPasswordKeyboard}
          showFingerprint={false}
          showForgotPassword={false}
          passwordValue={this.newPasswordValue}
          onClose={this.handleCloseNewPasswordKeyboard}
          onPressKeyboard={this.handlePressNewPasswordKeyboard}
          onClearPassword={this.handleClearNewPasswordPassword}
        />
        {/* Repeast password keyboard */}
        <AuthenKeyboardModal
          hideClose
          headerTitle={this.messages.modal.renEnterPass.title}
          description={this.messages.modal.renEnterPass.message}
          visible={this.state.showRepeatPasswordKeyboard}
          showFingerprint={false}
          showForgotPassword={false}
          passwordValue={this.repeatPasswordValue}
          onClose={this.handleCloseRepeatPasswordKeyboard}
          onPressKeyboard={this.handlePressRepeatPasswordKeyboard}
          onClearPassword={this.handleClearRepeatPasswordPassword}
        />
        {this.state.showLoading && <Loading loading />}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  heading: {
    fontWeight: '600',
    marginTop: 8,
  },
  walletWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  walletImage: {
    width: 60,
    height: 46,
    marginRight: 12,
    resizeMode: 'contain',
  },
  walletInfo: {},
  walletName: {
    fontWeight: '600',
  },
  walletCost: {
    marginTop: 2,
  },
  secureWrapper: {
    margin: 16,
  },
  secureText: {
    lineHeight: 18,
  },
});

export default withTranslation('phoneCard')(BuyCardConfirm);
