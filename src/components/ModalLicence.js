import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modalbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CheckBox} from 'react-native-elements';
import AutoHeightWebView from 'react-native-autoheight-webview';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  modalConfirm: {
    width: appConfig.device.width * 0.8,
    maxHeight: appConfig.device.height / 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  titleContainer: {
    marginVertical: 16,
  },
  title: {
    textAlign: 'center',
    color: '#111',
    fontSize: 18,
    fontWeight: '500',
  },
  modalContentContainer: {
    paddingTop: 8,
    width: '100%',
    minHeight: '50%',
    paddingHorizontal: 16,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  webview: {},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalActionBtnContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  actionLeftButton: {
    borderRightWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  actionButtonLabel: {
    color: appConfig._primaryColor,
  },
});

class LicenseModal extends Component {
  state = {
    confirmed: false,
  };

  required = false;

  componentWillUnmount() {
    this.setState({
      confirmed: false,
    });
  }
  toggleCheckbox = () => {
    this.setState((prevState) => {
      return {confirmed: !prevState.confirmed};
    });
  };

  handleConfirmPress = () => {
    if (this.required) {
      if (this.state.confirmed) {
        if (this.props.onConfirm) {
          this.props.onConfirm();
        }
      }
    } else {
      this.props.onConfirm();
    }
  };

  render() {
    const {t} = this.props;
    return (
      <Modal
        ref={this.props.ref_popup}
        isOpen={true}
        entry="top"
        swipeToClose={false}
        style={[styles.modal, styles.modalConfirm]}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Điều khoản sử dụng</Text>
          </View>

          <View style={styles.modalContentContainer}>
            <AutoHeightWebView
              ref={this.handleRefWebview}
              onShouldStartLoadWithRequest={(result) => {
                return true;
              }}
              style={[styles.webview, this.props.contentStyle]}
              onSizeUpdated={this.props.onSizeUpdated}
              source={{
                html: `${this.props.content}`,
              }}
              zoomable={this.props.zoomable}
              scrollEnabled={this.props.scrollEnabled}
              viewportContent={'width= device-width, user-scalable=no'}
              javaScriptEnabled
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                checked={this.state.confirmed}
                checkedColor={DEFAULT_COLOR}
                onPress={this.toggleCheckbox}
              />
              <Text>Tôi đồng ý với điều khoản</Text>
            </View>
          </View>

          <View style={styles.modalActionBtnContainer}>
            <TouchableOpacity
              onPress={this.handleConfirmPress}
              style={[styles.actionButton, styles.actionLeftButton]}>
              <Text style={styles.actionButtonLabel}>
                {t('common:confirm')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.props.onCancel}
              style={styles.actionButton}>
              <Text style={styles.actionButtonLabel}>{t('common:cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(LicenseModal);
