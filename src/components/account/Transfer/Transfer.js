import React, {Component} from 'react';
import {View, Platform, StyleSheet, Keyboard} from 'react-native';
// 3-party libs
import {config as phoneCardConfig} from 'app-packages/tickid-phone-card';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// entities
import Communications from 'app-helper/Communications';
// custom components
import EnterPhone from 'app-packages/tickid-phone-card/component/EnterPhone/EnterPhone';
import Modal from './Payment/Modal';
import {ScreenWrapper, ScrollView, IconButton} from 'src/components/base';
import Indicator from 'src/components/Indicator';

class Transfer extends Component {
  static contextType = ThemeContext;

  state = {
    contactThumbnail: '',
    contactName: '',
    contactPhone: '',
    errorMessage: '',
    modalVisible: false,
    loading: false,
  };
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
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  goToScanQR = () => {
    const {t} = this.props;
    push(
      appConfig.routes.qrBarCode,
      {
        title: t('common:screen.transfer.mainTitle'),
        index: 1,
        from: appConfig.routes.transfer,
        wallet: this.props.wallet,
        address: this.props.address,
      },
      this.theme,
    );
  };

  handleInputPhoneBlur = () => {};

  handleChangePhoneNumber = (contactPhone) => {
    this.setState({contactPhone});
  };

  handleShowHistory = () => {
    // config.route.push(config.routes.cardHistory, {
    //     title: this.currentService.history_title,
    //     serviceId: this.currentService.id
    //   });
  };

  handleOpenContact = () => {
    const {t} = this.props;
    push(
      phoneCardConfig.routes.contact,
      {
        onPressContact: this.handlePressContact,
        requestContactsPermissionTitle: t(
          'contact.requestContactsPermissionTitle',
        ),
        requestContactsPermissionMessage: t(
          'contact.requestContactsPermissionMessage',
        ),
        notInContactsFamilyName: t('contact.notInContactsFamilyName'),
        allowAccessContactsMessage: t('contact.allowAccessContactsMessage'),
        searchContactsPlaceholder: t('contact.searchContactsPlaceholder'),
      },
      this.theme,
    );
  };

  handlePressContact = (contact) => {
    Keyboard.dismiss();
    const {name, displayPhone, data, notInContact} = contact;
    const {t} = this.props;

    if (displayPhone.trim()) {
      let receiverTel = displayPhone.replace(/ /g, '');
      // receiverTel = receiverTel.split('+84').join('0');
      if (receiverTel.slice(0, 2) === '84') {
        receiverTel = receiverTel.replace('84', '0');
      }

      if (receiverTel !== store.user_info.tel) {
        this.setState({
          contactName: name,
          contactPhone: displayPhone,
          contactThumbnail: data.thumbnailPath,
        });

        this.checkReceiverExistence(
          receiverTel,
          (receiverInfo) => {
            push(
              appConfig.routes.transferPayment,
              {
                title: t('transferPaymentTitle', {
                  walletName: this.props.wallet.name,
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
                  notInContact,
                },
              },
              this.theme,
            );
          },
          () => {
            Keyboard.dismiss();
            this.setState({
              modalVisible: true,
            });
          },
        );
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('error.sameAccount'),
        });
      }
    } else {
      flashShowMessage({
        type: 'danger',
        message: t('error.noTel'),
      });
    }
  };

  checkReceiverExistence = async (tel, callBackSuccess, callBackError) => {
    const data = {tel};
    this.setState({loading: true});

    try {
      const response = await APIHandler.user_get_info_by_phone_number(data);

      if (!this.unmounted) {
        this.setState({loading: false}, () => {
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
                tel: response.data.tel,
              });
            } else {
              callBackError();
            }
          }, 500);
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.unmounted) return;

      this.setState({loading: false});
    }
  };

  onCloseModal = () => {
    this.setState({modalVisible: false});
  };

  onCancelModal = () => {
    this.onCloseModal();
  };

  onOkModal = () => {
    Communications.textWithoutEncoding(
      this.state.contactPhone,
      store.user_info.text_sms,
    );
  };

  render() {
    const {t} = this.props;
    const title = t('accountNotRegisterYet.title', {appName: APP_NAME_SHOW});
    const content = t('accountNotRegisterYet.message', {
      tel: this.state.contactPhone,
      appName: APP_NAME_SHOW,
    });
    const okText = t('accountNotRegisterYet.accept');
    const cancelText = t('accountNotRegisterYet.cancel');

    return (
      <ScreenWrapper>
        {this.state.loading && (
          <View style={styles.loading}>
            <Indicator />
          </View>
        )}

        <ScrollView
          style={styles.container}
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'on-drag' : 'interactive'
          }>
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
              <IconButton
                bundle={BundleIconSetName.FONT_AWESOME}
                name="qrcode"
                onPress={this.goToScanQR}
                style={styles.scanQRContainer}
                iconStyle={styles.scanQRIcon}
              />
            }
          />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  loading: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  scanQRContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 15,
  },
  scanQRIcon: {
    fontSize: 50,
  },
});

export default withTranslation(['transfer', 'common'])(Transfer);
