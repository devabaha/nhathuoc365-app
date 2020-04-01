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
import lockImage from '../../assets/images/locked.png';
import SubmitButton from '../../component/SubmitButton';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AuthenKeyboardModal from 'app-packages/tickid-authen-keyboard';
import { FieldItemWrapper, FieldItem } from '../../component/FieldItem';
import AsyncStorage from '@react-native-community/async-storage';
import { internalFetch } from '../../helper/apiFetch';
import Loading from '@tickid/tickid-rn-loading';
import config from '../../config';
import { showMessage } from '../../constants';

const PASSWORD_STORAGE_KEY = 'PASSWORD_STORAGE_KEY';
const PASSWORD_LENGTH = 4;

class BuyCardConfirm extends Component {
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
    messages: PropTypes.object,
    quantity: PropTypes.number
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
    messages: {
      sourceMoney: 'Nguồn tiền',
      transaction: {
        detail: 'Chi tiết giao dịch',
        type: 'Loại giao dịch',
        form: {
          sendTo: 'Nạp cho',
          tel: 'Số điện thoại',
          network: 'Nhà mạng',
          cardNumber: 'Số thẻ',
          subCardNumber: 'Số phụ',
          month: 'Số tháng',
          value: 'Mệnh giá',
          quantity: 'Số lượng',
          discount: 'Giảm',
          fee: {
            title: 'Phí giao dịch',
            value: 'Miễn phí'
          },
          price: 'Tổng tiền'
        }
      },
      error: {
        passwordNotMatch: {
          title: 'Mật khẩu không khớp',
          message: 'Vui lòng thử lại',
          accept: 'Thử lại'
        },
        network: 'Kết nối mạng có lỗi, vui lòng thử lại'
      },
      fingerprintScanner: {
        authenMessage: 'Sử dụng Touch ID để mở khóa và xác nhận'
      },
      sercure:
        'Bảo mật SSL/TLS, mọi thông tin giao dịch đều được mã hóa an toàn.',
      confirm: 'Xác nhận',
      modal: {
        newPass: {
          title: 'Tạo mật khẩu mới',
          messsage: 'Để đảm bảo an toàn, vui lòng tạo mật khẩu giao dịch'
        },
        renEnterPass: {
          title: 'Nhập lại mật khẩu',
          message: 'Nhập lại mật khẩu để xác nhận'
        }
      }
    }
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
      showLoading: false
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
    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        this.setState({
          biometryType,
          isSensorAvailable: true
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));

    this.loadStoredPassword();
    EventTracker.logEvent('buy_card_confirm_page');
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
    if (!this.props.hasPass) {
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
          this.handleBuyCard(this.passwordValue);
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
          this.handleBuyCard(newPasswordValue);
        } else {
          showMessage({
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
    this.setState({
      showRepeatPasswordKeyboard: false,
      newPasswordValue: [],
      repeatPasswordValue: []
    });
    const title = this.props.messages.error.passwordNotMatch.title;
    const message = this.props.messages.error.passwordNotMatch.message;

    setTimeout(() => {
      Alert.alert(title, message, [
        {
          text: this.props.messages.error.passwordNotMatch.accept,
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

    FingerprintScanner.authenticate({
      description: this.props.messages.fingerprintScanner.authenMessage
    })
      .then(() => {
        this.setState({
          passwordValue: this.state.authenPasswordStored.split('')
        });

        setTimeout(() => {
          this.handleBuyCard(this.state.authenPasswordStored);
        }, 250);
      })
      .finally(() => {
        this.printScanning = false;
      });
  };

  handleBuyCard = authenPasswordStored => {
    this.handleCloseAuthenKeyboard();

    this.setState({
      showLoading: true
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
        pw4n: authenPasswordStored
      }
    };
    if (this.props.times) {
      options.body.times = this.props.times;
      options.body.option = this.props.option;
    }

    internalFetch(config.rest.book(), options)
      .then(response => {
        if (response.status === config.httpCode.success) {
          if (!this.state.authenPasswordStored) {
            this.saveNewPasswordToStorage(authenPasswordStored);
          }
          setTimeout(() => {
            config.route.push(config.routes.buyCardSuccess, {
              isBuyCard: this.isBuyCard,
              bookResponse: response,
              serviceId: this.props.serviceId,
              historyTitle: this.props.historyTitle
            });
          }, 250);
        } else {
          showMessage({
            type: 'danger',
            message: response.message
          });

          setTimeout(() => {
            if (!this.state.showAuthenKeyboard) {
              this.setState({
                passwordValue: [],
                showAuthenKeyboard: true
              });
            }
          }, 2000);
        }
      })
      .catch(() => {
        showMessage({
          type: 'danger',
          message: this.props.messages.error.network
        });
      })
      .finally(() => {
        this.setState({
          showLoading: false
        });
      });
  };

  renderWallet = () => {
    if (!this.props.wallet) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.heading}>{this.props.messages.sourceMoney}</Text>

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
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            {this.renderWallet()}

            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.heading}>
                {this.props.messages.transaction.detail}
              </Text>

              <View style={styles.cardInfoWrapper}>
                <View style={styles.fieldWrapper}>
                  <FieldItemWrapper separate>
                    <FieldItem
                      label={this.props.messages.transaction.type}
                      value={this.props.type}
                    />
                    {!!this.props.contactName && (
                      <FieldItem
                        label={this.props.messages.transaction.form.sendTo}
                        value={this.props.contactName}
                      />
                    )}

                    {!!this.props.contactPhone && (
                      <FieldItem
                        label={this.props.messages.transaction.form.tel}
                        value={this.props.contactPhone}
                      />
                    )}

                    <FieldItem
                      label={this.props.messages.transaction.form.network}
                      value={this.props.network.name}
                    />
                    {!!this.props.cardNumber && (
                      <FieldItem
                        label={this.props.messages.transaction.form.cardNumber}
                        value={this.props.cardNumber}
                      />
                    )}
                    {!!this.props.subCard && (
                      <FieldItem
                        label={
                          this.props.messages.transaction.form.subCardNumber
                        }
                        value={this.props.subCard}
                      />
                    )}
                    {!!this.props.totalMonth && (
                      <FieldItem
                        label={this.props.messages.transaction.form.month}
                        value={this.props.totalMonth}
                      />
                    )}
                    <FieldItem
                      label={this.props.messages.transaction.form.value}
                      value={this.props.card.label}
                    />
                    {this.props.quantity > 0 && (
                      <FieldItem
                        label={this.props.messages.transaction.form.quantity}
                        value={this.props.quantity}
                      />
                    )}
                    <FieldItem
                      label={this.props.messages.transaction.form.discount}
                      value={this.props.card.cashbackValue}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper separate>
                    <FieldItem
                      label={this.props.messages.transaction.form.fee.title}
                      value={this.props.messages.transaction.form.fee.value}
                    />
                  </FieldItemWrapper>

                  <FieldItemWrapper>
                    <FieldItem
                      label={this.props.messages.transaction.form.price}
                      value={this.props.card.total_price}
                      boldValue
                    />
                  </FieldItemWrapper>
                </View>
              </View>
            </View>

            <View style={styles.secureWrapper}>
              <Text style={styles.secureText}>
                {this.props.messages.sercure}
              </Text>
            </View>
          </View>
        </ScrollView>

        <SubmitButton
          title={this.props.messages.confirm}
          iconSource={lockImage}
          onPress={this.handleConfirm}
        />

        {/* Authen key board */}
        <AuthenKeyboardModal
          hideClose
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
          headerTitle={this.props.messages.modal.newPass.title}
          description={this.props.messages.modal.newPass.message}
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
          headerTitle={this.props.messages.modal.renEnterPass.title}
          description={this.props.messages.modal.renEnterPass.message}
          visible={this.state.showRepeatPasswordKeyboard}
          showFingerprint={false}
          showForgotPassword={false}
          passwordValue={this.repeatPasswordValue}
          onClose={this.handleCloseRepeatPasswordKeyboard}
          onPressKeyboard={this.handlePressRepeatPasswordKeyboard}
          onClearPassword={this.handleClearRepeatPasswordPassword}
        />

        {this.state.showLoading && <Loading loading />}
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
    fontSize: 18,
    color: config.colors.black,
    fontWeight: '600',
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
    color: config.colors.black
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
    fontSize: 12,
    color: '#666',
    lineHeight: 18
  }
});

export default BuyCardConfirm;
