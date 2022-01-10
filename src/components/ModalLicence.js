import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Modal from 'react-native-modalbox';
import {CheckBox} from 'react-native-elements';
import AutoHeightWebView from 'react-native-autoheight-webview';
import appConfig from 'app-config';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  modalLicense: {
    width: appConfig.device.width * 0.8,
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
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContentWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    borderTopWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  contentContainer: {
    maxHeight: appConfig.device.height / 4,
  },
  contentHtmlContainer: {
    height: appConfig.device.height / 4,
  },
  webviewContent: {
    width: '100%',
    // marginTop: 8,
  },
  contentTextContainer: {
    paddingVertical: 8,
  },
  checkboxesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxesContainer: {
    margin: 0,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ffffff',
    borderWidth: 0,
    flex: 1,
  },
  checkboxLabel: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 0,
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
    color: '#0b0b0b',
  },
  actionAgreeBtnLabel: {
    fontWeight: '700',
  },
});

class LicenseModal extends Component {
  static defaultProps = {
    html: false,
    onDisagree: Actions.pop,
  };

  state = {
    checkboxes: this.props.checkboxes,
    agreeBtnDisabled: true,
  };

  componentDidMount() {
    if (this.props.checkboxes?.length === 0) {
      this.setState({
        agreeBtnDisabled: false,
      });
    } else {
      this.handleBtnAgreeDisabled();
    }
  }

  toggleCheckbox = (index) => {
    this.setState(
      (prevState) => {
        let toggleConfirmed = !prevState.checkboxes[index]?.confirmed;
        let currentCheckbox = {
          ...this.state.checkboxes[index],
          confirmed: toggleConfirmed,
        };
        //replace to the old one
        prevState.checkboxes?.splice(index, 1, currentCheckbox);

        return {checkboxes: prevState.checkboxes};
      },
      () => this.handleBtnAgreeDisabled(),
    );
  };

  handlePressAgree = () => {
    const listCheckboxesConfirmed = this.state.checkboxes?.filter(
      (checkbox) => {
        return checkbox.confirmed;
      },
    );
    this.props.onAgree(this.state.checkboxes, listCheckboxesConfirmed);
  };

  handleBtnAgreeDisabled = () => {
    let passed = this.state.checkboxes?.some((checkbox) => {
      if (checkbox.required) {
        return !checkbox.confirmed;
      }
    });
    if (!passed) {
      this.setState({agreeBtnDisabled: false});
    } else {
      this.setState({agreeBtnDisabled: true});
    }
  };

  render() {
    const {t} = this.props;
    return (
      <Modal
        ref={this.props.refModalLicense}
        isOpen={true}
        entry="top"
        swipeToClose={false}
        style={[styles.modal, styles.modalLicense]}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>

          <View style={styles.modalContentWrapper}>
            <View style={styles.contentContainer}>
              {this.props.html ? (
                <View style={styles.contentHtmlContainer}>
                  <AutoHeightWebView
                    style={styles.webviewContent}
                    source={{
                      html: `${this.props.content}`,
                    }}
                    viewportContent={'width=device-width, user-scalable=no'}
                    javaScriptEnabled
                  />
                </View>
              ) : (
                <ScrollView contentContainerStyle={styles.contentTextContainer}>
                  <Text>{this.props.content}</Text>
                </ScrollView>
              )}
            </View>

            {this.props.checkboxes?.map((item, index) => {
              const requiredColor = item.required
                ? appConfig._primaryColor
                : '#0e0e0e';
              const requiredTitleMarker = ` ${item.required ? '(*)' : ''}`;

              return (
                <View key={index} style={styles.checkboxesWrapper}>
                  <CheckBox
                    iconType={'material-community'}
                    containerStyle={styles.checkboxesContainer}
                    textStyle={[
                      styles.checkboxLabel,
                      {
                        color: item.required
                          ? appConfig._primaryColor
                          : '#0e0e0e',
                        fontWeight: item.required ? '500' : '400',
                        fontSize: item.required ? 14 : 13,
                      },
                    ]}
                    checkedIcon={
                      item.required
                        ? 'checkbox-marked-outline'
                        : 'checkbox-marked-circle-outline'
                    }
                    uncheckedIcon={
                      item.required
                        ? 'checkbox-blank-outline'
                        : 'checkbox-blank-circle-outline'
                    }
                    checked={this.state.checkboxes[index].confirmed}
                    uncheckedColor={requiredColor}
                    checkedColor={requiredColor}
                    onPress={() => this.toggleCheckbox(index)}
                    title={item.checkboxLabel + requiredTitleMarker}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.modalActionBtnContainer}>
            <TouchableOpacity
              disabled={this.state.agreeBtnDisabled}
              onPress={this.handlePressAgree}
              style={[styles.actionButton, styles.actionLeftButton]}>
              <Text
                style={[
                  styles.actionAgreeBtnLabel,
                  {
                    color: this.state.agreeBtnDisabled
                      ? '#bbbbbb'
                      : appConfig._primaryColor,
                  },
                ]}>
                {t('common:agree')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.props.onDisagree}
              style={styles.actionButton}>
              <Text style={styles.actionButtonLabel}>
                {t('common:disagree')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(LicenseModal);
