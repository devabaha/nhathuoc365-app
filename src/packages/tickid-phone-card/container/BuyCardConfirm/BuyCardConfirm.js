import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import lockImage from '../../assets/images/locked.png';
import SubmitButton from '../../component/SubmitButton';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AuthenKeyboardModal from 'app-packages/tickid-authen-keyboard';
import { FieldItemWrapper, FieldItem } from '../../component/FieldItem';
import config from '../../config';

class BuyCardConfirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordValue: [],
      showAuthenKeyboard: false,
      isSensorAvailable: false
    };
  }

  get passwordValue() {
    return this.state.passwordValue.join('');
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
  }

  handleConfirm = () => {
    this.setState({
      showAuthenKeyboard: true
    });
  };

  handleCloseAuthenKeyboard = () => {
    this.setState({
      passwordValue: [],
      showAuthenKeyboard: false
    });
  };

  handlePressKeyboard = buttonValue => {
    this.setState(
      prevState => ({
        passwordValue: [...prevState.passwordValue, buttonValue]
      }),
      () => {
        if (this.state.passwordValue.length >= 6) {
          this.handleBuyCard();
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

  handleForgotPress = () => {};

  printScanning;

  handleOpenFingerprint = () => {
    if (this.printScanning) return;
    this.printScanning = true;

    FingerprintScanner.authenticate({
      description: 'Sử dụng Touch ID để mở khóa và xác nhận'
    })
      .then(this.handleBuyCard)
      .finally(() => {
        this.printScanning = false;
      });
  };

  handleBuyCard = () => {
    this.handleCloseAuthenKeyboard();
    setTimeout(() => {
      config.route.push(config.routes.buyCardSuccess);
    }, 250);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.row}>
              <Text style={styles.heading}>Nguồn tiền</Text>

              <View style={styles.walletWrapper}>
                <Image style={styles.walletImage} source={null} />
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>Ví TickID</Text>
                  <Text style={styles.walletCost}>1.000.000đ</Text>
                </View>
              </View>
            </View>

            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.heading}>Chi tiết giao dịch</Text>

              <View style={styles.cardInfoWrapper}>
                <View style={styles.fieldWrapper}>
                  <FieldItemWrapper separate>
                    <FieldItem label="Nhà mạng" value="Viettel" />
                    <FieldItem label="Mệnh giá" value="20.000" />
                    <FieldItem label="Số lượng" value="5" />
                    <FieldItem label="Hoàn lại" value="400đ" />
                  </FieldItemWrapper>

                  <FieldItemWrapper separate>
                    <FieldItem label="Phí giao dịch" value="Miễn phí" />
                  </FieldItemWrapper>

                  <FieldItemWrapper>
                    <FieldItem label="Tổng tiền" value="20.000đ" boldValue />
                  </FieldItemWrapper>
                </View>
              </View>
            </View>

            <View style={styles.secureWrapper}>
              <Text style={styles.secureText}>
                Bảo mật SSL/TSL, mọi thông tin giao dịch đều được mã hóa an
                toàn.
              </Text>
            </View>
          </View>
        </ScrollView>

        <SubmitButton
          title="Xác nhận"
          iconSource={lockImage}
          onPress={this.handleConfirm}
        />

        <AuthenKeyboardModal
          visible={this.state.showAuthenKeyboard}
          showFingerprint={this.state.isSensorAvailable}
          passwordValue={this.passwordValue}
          onClose={this.handleCloseAuthenKeyboard}
          onPressKeyboard={this.handlePressKeyboard}
          onClearPassword={this.handleClearPassword}
          onForgotPress={this.handleForgotPress}
          onOpenFingerprint={this.handleOpenFingerprint}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: config.colors.white
  },
  heading: {
    fontSize: 18,
    color: config.colors.black,
    fontWeight: '600'
  },
  walletWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  walletImage: {
    width: 60,
    height: 46,
    borderRadius: 8,
    borderColor: '#ccc',
    resizeMode: 'contain',
    borderWidth: StyleSheet.hairlineWidth
  },
  walletInfo: {
    marginLeft: 12
  },
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
