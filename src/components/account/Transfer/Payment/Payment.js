import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  SafeAreaView
} from 'react-native';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import Input from './Input';
import Button from '../../../Button';
import { formatMoney } from './helper';

const MAX_NOTE_LENGTH = 160;

class Payment extends Component {
  static propTypes = {
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    contactThumbnail: PropTypes.string,
    receiver: PropTypes.object
  };
  static defaultProps = {
    contactName: '',
    contactPhone: '',
    contactThumbnail: '',
    receiver: {}
  };

  state = {
    note: '',
    moneyError: ''
  };
  moneyInput = React.createRef();
  noteInput = React.createRef();
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  onNoteChange = (e, note) => {
    this.setState({ note });
  };

  goToConfirm = () => {
    if (this.moneyInput.current) {
      const isValid = this.checkValidate(this.moneyInput.current.inputText);
      if (isValid) {
        const price =
          this.moneyInput.current.formattedText +
          ' ' +
          this.props.wallet.symbol;

        Actions.push(appConfig.routes.transferConfirm, {
          receiver: this.props.receiver,
          wallet: this.props.wallet,
          originPrice: this.moneyInput.current.inputText,
          price,
          originTotalPrice: this.moneyInput.current.formattedText,
          totalPrice: price
        });
      }
    }
  };

  checkValidate(text) {
    let moneyError = '';
    const min_transfer_view = formatMoney(this.props.wallet.min_transfer);
    const max_transfer_view = formatMoney(this.props.wallet.max_transfer);
    const { t } = this.props;

    try {
      if (!text) {
        moneyError = t('validate.empty');
      } else if (text < Number(this.props.wallet.min_transfer)) {
        moneyError = t('validate.min', {
          money: min_transfer_view + this.props.wallet.symbol
        });
      } else if (text > Number(this.props.wallet.max_transfer)) {
        moneyError = t('validate.max', {
          money: max_transfer_view + this.props.wallet.symbol
        });
      }

      this.setState({ moneyError });

      return !!!moneyError;
    } catch (err) {
      console.log('money input error', err);
    }

    return false;
  }

  clearMoneyError = () => {
    this.setState({ moneyError: '' });
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
          index <= 2 && (shortTitle += name.charAt(0).toUpperCase())
      );
    }

    return (
      <>
        <Text style={styles.shortContactName}>{shortTitle}</Text>
        {!!this.props.receiver.avatar && (
          <Image
            style={styles.avatar}
            source={{ uri: this.props.receiver.avatar }}
            resizeMode="cover"
          />
        )}
      </>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={appConfig.device.isIOS ? 'padding' : null}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={[styles.container, styles.scrollView]}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.box}>
              <View style={styles.user}>
                <View style={styles.avatarContainer}>
                  {this.renderAvatar()}
                </View>

                <View style={styles.informationContainer}>
                  <Text style={styles.title}>{this.props.receiver.name}</Text>
                  <Text style={styles.subTitle}>{this.props.receiver.tel}</Text>
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
                  counter: `${this.state.note.length}/${MAX_NOTE_LENGTH}`
                })}
                multiline
                maxLength={MAX_NOTE_LENGTH}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </ScrollView>
          <Button title={t('transferBtnTitle')} onPress={this.goToConfirm} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  scrollView: {
    backgroundColor: '#eae9ef'
  },
  box: {
    backgroundColor: 'white',
    marginTop: 60,
    marginBottom: 10,
    paddingBottom: 15,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    justifyContent: 'flex-end'
  },
  user: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: -40
  },
  avatarContainer: {
    width: 80,
    height: 80,
    overflow: 'hidden',
    borderRadius: 40,
    borderColor: appConfig.colors.primary,
    backgroundColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1
  },
  shortContactName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
  informationContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginTop: 15,
    fontSize: 18
  },
  subTitle: {
    marginTop: 5,
    color: '#a5a5a5',
    fontSize: 16
  }
});

export default withTranslation('payment')(observer(Payment));
