import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  Modal as ModalRN,
  Keyboard
} from 'react-native';
import appConfig from 'app-config';
import EnterPhone from 'app-packages/tickid-phone-card/component/EnterPhone/EnterPhone';
import { Actions } from 'react-native-router-flux';
import { config as phoneCardConfig } from 'app-packages/tickid-phone-card';
import { ScrollView } from 'react-native-gesture-handler';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import Modal from './Payment/Modal';
import store from 'app-store';
import EventTracker from '../../../helper/EventTracker';

class Transfer extends Component {
  state = {
    contactThumbnail: '',
    contactName: '',
    contactPhone: '',
    errorMessage: '',
    modalVisible: false,
    loading: false
  };
  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  goToScanQR = () => {
    const { t } = this.props;
    Actions.push(appConfig.routes.qrBarCode, {
      title: t('common:screen.transfer.mainTitle'),
      index: 1,
      from: appConfig.routes.transfer,
      wallet: this.props.wallet,
      address: this.props.address
    });
  };

  handleInputPhoneBlur = () => {};

  handleChangePhoneNumber = contactPhone => {
    this.setState({ contactPhone });
  };

  handleShowHistory = () => {
    // config.route.push(config.routes.cardHistory, {
    //     title: this.currentService.history_title,
    //     serviceId: this.currentService.id
    //   });
  };

  handleOpenContact = () => {
    const { t } = this.props;
    Actions.push(phoneCardConfig.routes.contact, {
      onPressContact: this.handlePressContact,
      requestContactsPermissionTitle: t(
        'contact.requestContactsPermissionTitle'
      ),
      requestContactsPermissionMessage: t(
        'contact.requestContactsPermissionMessage'
      ),
      notInContactsFamilyName: t('contact.notInContactsFamilyName'),
      allowAccessContactsMessage: t('contact.allowAccessContactsMessage'),
      searchContactsPlaceholder: t('contact.searchContactsPlaceholder')
    });
  };

  handlePressContact = contact => {
    Keyboard.dismiss();
    const { name, displayPhone, data, notInContact } = contact;
    const { t } = this.props;

    if (displayPhone.trim()) {
      let receiverTel = displayPhone.replace(/ /g, '');
      receiverTel = receiverTel.split('+84').join('0');
      if (receiverTel.slice(0, 2) === '84') {
        receiverTel = receiverTel.replace('84', '0');
      }

      if (receiverTel !== store.user_info.tel) {
        this.setState({
          contactName: name,
          contactPhone: displayPhone,
          contactThumbnail: data.thumbnailPath
        });

        this.checkReceiverExistence(
          receiverTel,
          receiverInfo => {
            Actions.push(appConfig.routes.transferPayment, {
              title: t('transferPaymentTitle', {
                walletName: this.props.wallet.name
              }),
              wallet: this.props.wallet,
              receiver: {
                id: receiverInfo.id,
                walletAddress: receiverInfo.wallet_address,
                name: notInContact ? receiverInfo.name : name.trim(),
                walletName: receiverInfo.name,
                tel: displayPhone,
                originTel: receiverInfo.tel,
                avatar: receiverInfo.avatar || data.thumbnailPath,
                notInContact
              }
            });
          },
          () => {
            Keyboard.dismiss();
            this.setState({
              modalVisible: true
            });
          }
        );
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('error.sameAccount')
        });
      }
    } else {
      flashShowMessage({
        type: 'danger',
        message: t('error.noTel')
      });
    }
  };

  checkReceiverExistence = async (tel, callBackSuccess, callBackError) => {
    const data = { tel };
    this.setState({ loading: true });

    try {
      const response = await APIHandler.user_get_info_by_phone_number(data);

      if (!this.unmounted) {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            if (
              response.status === STATUS_SUCCESS &&
              response.data &&
              !this.unmounted
            ) {
              callBackSuccess({
                id: response.data.id,
                name: response.data.name,
                wallet_address: response.data.wallet_address,
                avatar: response.data.img,
                tel: response.data.tel
              });
            } else {
              callBackError();
            }
          }, 500);
        });
      }
    } catch (error) {
      console.log(error);
      !this.unmounted && this.setState({ loading: false });
    }
  };

  onCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  onCancelModal = () => {
    this.onCloseModal();
  };

  onOkModal = () => {
    Communications.textWithoutEncoding(
      this.state.contactPhone,
      store.user_info.text_sms
    );
  };

  render() {
    const { t } = this.props;
    const title = t('accountNotRegisterYet.title', { appName: APP_NAME_SHOW });
    const content = t('accountNotRegisterYet.message', {
      tel: this.state.contactPhone,
      appName: APP_NAME_SHOW
    });
    const okText = t('accountNotRegisterYet.accept');
    const cancelText = t('accountNotRegisterYet.cancel');

    return (
      <ScrollView
        style={styles.container}
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'interactive'}
      >
        <ModalRN visible={this.state.loading} animationType="fade" transparent>
          <View style={styles.loading}>
            <Indicator />
          </View>
        </ModalRN>

        <Modal
          visible={this.state.modalVisible}
          title={title}
          content={content}
          okText={okText}
          cancelText={cancelText}
          onRequestClose={this.onCloseModal}
          onCancel={this.onCancelModal}
          onOk={this.onOkModal}
        />

        <SafeAreaView style={{ flex: 1 }}>
          <EnterPhone
            editable={false}
            showHistory={false}
            errorMessage={this.state.errorMessage}
            title={t('contactInput.title')}
            // contactName={this.state.contactName}
            // contactPhone={this.state.contactPhone}
            onOpenContact={this.handleOpenContact}
            onBlur={this.handleInputPhoneBlur}
            onChangeText={this.handleChangePhoneNumber}
            onShowHistory={this.handleShowHistory}
            hideChangeNetwork
            hideContact
            placeholder={t('contactInput.placeholder')}
            customRightComponent={
              <ScanQRButton onOpenScanQR={this.goToScanQR} />
            }
            inputContainerStyle={styles.inputStyle}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff'
  },
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1
  },
  scanQRContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 15
  },
  inputStyle: {
    backgroundColor: '#ffffff'
  }
});

export default withTranslation(['transfer', 'common'])(Transfer);

const ScanQRButton = props => (
  <Button containerStyle={styles.scanQRContainer} onPress={props.onOpenScanQR}>
    <Icon name="qrcode" size={50} color="#333333" />
  </Button>
);
