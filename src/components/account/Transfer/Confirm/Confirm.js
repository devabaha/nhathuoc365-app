import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import lockImage from 'app-packages/tickid-phone-card/assets/images/locked.png';
import SubmitButton from 'app-packages/tickid-phone-card/component/SubmitButton';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AuthenKeyboardModal from 'app-packages/tickid-authen-keyboard';
import {
  FieldItemWrapper,
  FieldItem
} from 'app-packages/tickid-phone-card/component/FieldItem';
import AsyncStorage from '@react-native-community/async-storage';
import { internalFetch } from 'app-packages/tickid-phone-card/helper/apiFetch';
import Loading from '@tickid/tickid-rn-loading';
import config from 'app-packages/tickid-phone-card/config';
import store from 'app-store';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';

const PASSWORD_LENGTH = 4;

class Confirm extends Component {
  static propTypes = {
    isBuyCard: PropTypes.bool,
    card: PropTypes.object,
    network: PropTypes.object,
    type: PropTypes.string,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    serviceId: PropTypes.string,
    historyTitle: PropTypes.string,
    quantity: PropTypes.number,
    wallet: PropTypes.object
  };

  static defaultProps = {
    isBuyCard: false,
    card: undefined,
    network: undefined,
    type: '',
    contactName: '',
    contactPhone: '',
    serviceId: undefined,
    historyTitle: '',
    quantity: 0,
    wallet: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      authenPasswordStored: null,
      passwordValue: [],
      newPasswordValue: [],
      repeatPasswordValue: [],
      showAuthenKeyboard: false,
      showNewPasswordKeyboard: false,
      showRepeatPasswordKeyboard: false,
      isSensorAvailable: false,
      loading: false
    };

    this.unmounted = false;
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
    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        this.setState({
          biometryType,
          isSensorAvailable: true
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));

    this.loadStoredPassword();
    EventTracker.logEvent('transfer_confirm_page');
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  loadStoredPassword = async () => {
    try {
      const authenPasswordStored = await AsyncStorage.getItem(
        PASSWORD_STORAGE_KEY
      );
      if (authenPasswordStored !== null) {
        this.setState({ authenPasswordStored });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleConfirm = () => {
    if (!!!store.user_info.has_pass) {
      this.setState({
        showNewPasswordKeyboard: true
      });
    } else {
      this.setState(
        {
          showAuthenKeyboard: true
        },
        () => {
          if (this.state.isSensorAvailable && this.state.authenPasswordStored) {
            this.handleOpenFingerprint();
          }
        }
      );
    }
  };

  handleCloseAuthenKeyboard = () => {
    this.setState({
      showAuthenKeyboard: false
    });

    setTimeout(() => {
      this.setState({
        passwordValue: []
      });
    }, 500);
  };

  handlePressKeyboard = buttonValue => {
    if (this.state.passwordValue.length >= PASSWORD_LENGTH) return;
    this.setState(
      prevState => ({
        passwordValue: [...prevState.passwordValue, buttonValue]
      }),
      () => {
        if (this.state.passwordValue.length >= PASSWORD_LENGTH) {
          this.transfer(this.passwordValue);
        }
      }
    );
  };

  handleClearPassword = () => {
    const passwordValue = [...this.state.passwordValue];
    if (passwordValue.length > 0) {
      passwordValue.pop();
      this.setState({ passwordValue });
    }
  };

  handleCloseNewPasswordKeyboard = () => {
    this.setState({
      newPasswordValue: [],
      showNewPasswordKeyboard: false
    });
  };

  handlePressNewPasswordKeyboard = buttonValue => {
    if (this.state.newPasswordValue.length >= PASSWORD_LENGTH) return;

    this.setState(
      prevState => ({
        newPasswordValue: [...prevState.newPasswordValue, buttonValue]
      }),
      () => {
        if (this.state.newPasswordValue.length >= PASSWORD_LENGTH) {
          this.setState(
            {
              showNewPasswordKeyboard: false
            },
            () => {
              setTimeout(() => {
                this.setState({
                  showRepeatPasswordKeyboard: true
                });
              }, 500);
            }
          );
        }
      }
    );
  };

  handleClearNewPasswordPassword = () => {
    const newPasswordValue = [...this.state.newPasswordValue];
    if (newPasswordValue.length > 0) {
      newPasswordValue.pop();
      this.setState({ newPasswordValue });
    }
  };

  handleCloseRepeatPasswordKeyboard = () => {
    this.setState({
      newPasswordValue: [],
      repeatPasswordValue: [],
      showRepeatPasswordKeyboard: false
    });
  };

  handlePressRepeatPasswordKeyboard = buttonValue => {
    if (this.state.repeatPasswordValue.length >= PASSWORD_LENGTH) return;

    this.setState(
      prevState => ({
        repeatPasswordValue: [...prevState.repeatPasswordValue, buttonValue]
      }),
      () => {
        if (this.state.repeatPasswordValue.length >= PASSWORD_LENGTH) {
          this.handleMatchCreatPassword();
        }
      }
    );
  };

  saveNewPasswordToStorage = async newPasswordValue => {
    try {
      await AsyncStorage.setItem(PASSWORD_STORAGE_KEY, newPasswordValue);
    } catch (error) {
      console.log(error);
    }
  };

  saveNewPasswordToDb = newPasswordValue => {
    const options = {
      method: 'POST',
      body: {
        pw4n: newPasswordValue
      }
    };
    return internalFetch(config.rest.password(), options);
  };

  handleMatchCreatPassword = () => {
    const { newPasswordValue, repeatPasswordValue } = this;
    if (newPasswordValue === repeatPasswordValue) {
      this.setState({
        authenPasswordStored: newPasswordValue
      });
      this.saveNewPasswordToStorage(newPasswordValue);
      this.saveNewPasswordToDb(newPasswordValue).then(response => {
        if (response.status === config.httpCode.success) {
          this.setState({ showRepeatPasswordKeyboard: false });
          this.transfer(newPasswordValue);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message
          });
          this.setState({
            showRepeatPasswordKeyboard: false,
            newPasswordValue: [],
            repeatPasswordValue: []
          });

          setTimeout(() => {
            this.setState({ showNewPasswordKeyboard: true });
          }, 2000);
        }
      });
    } else {
      this.handleTryCreatePassword();
    }
  };

  handleTryCreatePassword = () => {
    const { t } = this.props;
    this.setState({
      showRepeatPasswordKeyboard: false,
      newPasswordValue: [],
      repeatPasswordValue: []
    });
    const title = t('confirm.modal.wrongPass.title');
    const message = t('confirm.modal.wrongPass.message');

    setTimeout(() => {
      Alert.alert(title, message, [
        {
          text: t('confirm.modal.wrongPass.accept'),
          onPress: () => this.setState({ showNewPasswordKeyboard: true })
        }
      ]);
    }, 500);
  };

  handleClearRepeatPasswordPassword = () => {
    const repeatPasswordValue = [...this.state.repeatPasswordValue];
    if (repeatPasswordValue.length > 0) {
      repeatPasswordValue.pop();
      this.setState({ repeatPasswordValue });
    }
  };

  handleForgotPress = () => {};

  printScanning;

  handleOpenFingerprint = () => {
    if (this.printScanning) return;
    this.printScanning = true;
    const { t } = this.props;

    FingerprintScanner.authenticate({
      description: t('confirm.fingerprintScanner')
    })
      .then(() => {
        this.setState({
          passwordValue: this.state.authenPasswordStored.split('')
        });

        setTimeout(() => {
          this.transfer(this.state.authenPasswordStored);
        }, 250);
      })
      .finally(() => {
        this.printScanning = false;
      });
  };

  transfer = pw4n => {
    const { t } = this.props;
    this.setState(
      {
        showRepeatPasswordKeyboard: false,
        showNewPasswordKeyboard: false,
        showAuthenKeyboard: false
      },
      async () => {
        const data = {
          zone_code: this.props.wallet.zone_code,
          receive_address: this.props.receiver.walletAddress,
          amount: this.props.originPrice,
          pw4n
        };

        try {
          const response = await APIHandler.user_transfer_balance(data);
          if (!this.unmounted) {
            if (response && response.status === STATUS_SUCCESS) {
              flashShowMessage({
                type: 'success',
                message: response.message
              });
              setTimeout(() => {
                if (!this.unmounted) {
                  const resultTitle = t('confirm.message', {
                    money: this.props.originPrice + this.props.wallet.symbol,
                    receiverName: this.props.receiver.name,
                    receiverTel: this.props.receiver.originTel
                  });

                  Actions.push(appConfig.routes.transferResult, {
                    onConfirm: this.handleBackHome,
                    onClose: this.handleCloseModal,
                    mainIconName: 'checkcircle',
                    mainTitle: t('confirm.transaction.success.title'),
                    title: resultTitle,
                    subTitle: t('confirm.transaction.success.subTitle'),
                    btnTitle: t('confirm.transaction.success.message')
                  });
                }
              }, 200);
            } else {
              flashShowMessage({
                type: 'danger',
                message: response.message
              });
            }
          }
        } catch (e) {
          console.log(e);
        } finally {
          !this.unmounted &&
            this.setState({
              loading: false,
              passwordValue: [],
              newPasswordValue: [],
              repeatPasswordValue: []
            });
        }
      }
    );
  };

  handleCloseModal = () => {};

  handleBackHome = () => {
    this.handleCloseModal();
    Actions.pop();
    Actions.reset(appConfig.routes.primaryTabbar);
  };

  renderWallet() {
    const { t } = this.props;
    return (
      <View style={styles.row}>
        <Text style={styles.heading}>{t('confirm.sourceMoney')}</Text>

        <View style={styles.walletWrapper}>
          {this.props.wallet.image && (
            <Image
              style={styles.walletImage}
              source={this.props.wallet.image}
            />
          )}
          <View style={styles.walletInfo}>
            <Text style={styles.walletName}>{this.props.wallet.name}</Text>
            <Text style={styles.walletCost}>
              {this.props.wallet.balance_view}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { t } = this.props;
    const resultTitle = t('confirm.message', {
      money: this.props.originPrice + this.props.wallet.symbol,
      receiverName: this.props.receiver.name,
      receiverTel: this.props.receiver.originTel
    });

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            {this.renderWallet()}

            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.heading}>
                {t('confirm.transaction.detail')}
              </Text>

              <View style={styles.cardInfoWrapper}>
                <View style={styles.fieldWrapper}>
                  <FieldItemWrapper separate>
                    <FieldItem
                      label={t('confirm.transaction.form.sendTo')}
                      value={this.props.receiver.name}
                    />

                    {!!!this.props.receiver.notInContact && (
                      <FieldItem
                        label={this.props.wallet.name}
                        value={this.props.receiver.walletName}
                      />
                    )}

                    <FieldItem
                      label={t('confirm.transaction.form.tel')}
                      value={this.props.receiver.tel}
                    />
                    <FieldItem
                      label={t('confirm.transaction.form.money')}
                      value={this.props.price}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper separate>
                    <FieldItem
                      label={t('confirm.transaction.fee.title')}
                      value={t('confirm.transaction.fee.value')}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper>
                    <FieldItem
                      label={t('confirm.transaction.totalPrice')}
                      value={this.props.totalPrice}
                      boldValue
                    />
                  </FieldItemWrapper>
                </View>
              </View>
            </View>

            <View style={styles.secureWrapper}>
              <Text style={styles.secureText}>
                {t('confirm.transaction.secure')}
              </Text>
            </View>
          </View>
        </ScrollView>

        <SubmitButton
          title={t('confirm.transaction.confirm')}
          iconSource={lockImage}
          onPress={this.handleConfirm}
        />

        {/* Authen key board */}
        <AuthenKeyboardModal
          hideClose
          headerTitle={t('confirm.modal.enterPass.title')}
          showForgotPassword={false}
          visible={this.state.showAuthenKeyboard}
          showFingerprint={
            !!(this.state.isSensorAvailable && this.state.authenPasswordStored)
          }
          passwordValue={this.passwordValue}
          onClose={this.handleCloseAuthenKeyboard}
          onPressKeyboard={this.handlePressKeyboard}
          onClearPassword={this.handleClearPassword}
          onForgotPress={this.handleForgotPress}
          onOpenFingerprint={this.handleOpenFingerprint}
        />

        {/* New password keyboard */}
        <AuthenKeyboardModal
          hideClose
          headerTitle={t('confirm.modal.newPass.title')}
          description={t('confirm.modal.newPass.message')}
          visible={this.state.showNewPasswordKeyboard}
          showFingerprint={false}
          showForgotPassword={false}
          passwordValue={this.newPasswordValue}
          onClose={this.handleCloseNewPasswordKeyboard}
          onPressKeyboard={this.handlePressNewPasswordKeyboard}
          onClearPassword={this.handleClearNewPasswordPassword}
        />

        {/* Repeat password keyboard */}
        <AuthenKeyboardModal
          hideClose
          headerTitle={t('confirm.modal.reEnterPass.title')}
          description={t('confirm.modal.reEnterPass.message')}
          visible={this.state.showRepeatPasswordKeyboard}
          showFingerprint={false}
          showForgotPassword={false}
          passwordValue={this.repeatPasswordValue}
          onClose={this.handleCloseRepeatPasswordKeyboard}
          onPressKeyboard={this.handlePressRepeatPasswordKeyboard}
          onClearPassword={this.handleClearRepeatPasswordPassword}
        />

        {this.state.loading && <Loading loading />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: config.colors.white
  },
  heading: {
    fontSize: 16,
    color: '#656565',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 8
  },
  walletWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  walletImage: {
    width: 60,
    height: 46,
    marginRight: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    resizeMode: 'contain',
    borderWidth: StyleSheet.hairlineWidth
  },
  walletInfo: {},
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555'
  },
  walletCost: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginTop: 2
  },
  secureWrapper: {
    margin: 16
  },
  secureText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 18
  }
});

export default withTranslation('transfer')(observer(Confirm));
