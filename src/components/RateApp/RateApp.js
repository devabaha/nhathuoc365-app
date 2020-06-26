import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { default as ModalBox } from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import Button from '../Button';
import APIHandler from '../../network/APIHandler';
import Loading from '../Loading';
import store from 'app-store';

const PLATFROM_STORE = appConfig.device.isIOS ? 'App Store' : 'Play Store';
const BACKGROUND_IMAGE = require('../../images/thanks.jpg');

class RateApp extends PureComponent {
  state = {
    loading: false
  };
  ref_modal = React.createRef();
  unmounted = false;

  rateApp = async () => {
    const { t } = this.props;
    this.setState({ loading: true });
    const url = store.store_data ? store.store_data.link_update : null;
    url && Linking.openURL(url);

    try {
      const response = await APIHandler.user_rate_app();
      if (response && response.status === STATUS_SUCCESS) {
        flashShowMessage({
          type: 'success',
          message: response.message
        });
        this.onClose();
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('common:api.error.message')
        });
      }
    } catch (err) {
      console.log('rate_app', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  };

  onClose = () => {
    if (this.ref_modal.current) {
      this.ref_modal.current.close();
    }
  };

  onClosedModal = () => {
    Actions.pop();
  };

  render() {
    const { t } = this.props;
    return (
      <ModalBox
        entry="top"
        position="top"
        style={[styles.modal]}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        onClosed={this.onClosedModal}
        useNativeDriver
        swipeToClose={false}
        backdropPressToClose={false}
      >
        {this.state.loading && <Loading center />}
        <CachedImage source={BACKGROUND_IMAGE} style={styles.image} />
        <View style={styles.container}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>{t('title')}</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.body}>
              {t('message.first', {
                appName: APP_NAME_SHOW,
                storeName: PLATFROM_STORE
              })}
            </Text>
            <Text style={styles.body}>{t('message.second')}</Text>
          </View>
          <View style={styles.footerContainer}>
            <Button
              title={t('btn.cancel')}
              containerStyle={styles.btnContainer}
              btnContainerStyle={styles.btnCancel}
              onPress={this.onClose}
            />
            <Button
              title={t('btn.accept')}
              containerStyle={styles.btnContainer}
              btnContainerStyle={styles.btnAccept}
              onPress={this.rateApp}
            />
          </View>
        </View>
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    height: null,
    width: '80%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: '1%'
  },
  image: {
    width: '100%',
    height: appConfig.device.height * 0.35,
    resizeMode: 'cover'
  },
  headingContainer: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#444',
    letterSpacing: 1.6
  },
  bodyContainer: {
    padding: 10,
    paddingTop: 0
  },
  body: {
    marginTop: 15,
    fontSize: 15,
    lineHeight: 20,
    color: '#444'
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 0
  },
  btnAccept: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  btnCancel: {
    backgroundColor: '#aaa',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
});

export default withTranslation(['rateApp', 'common'])(RateApp);
