import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Easing,
  Keyboard,
} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modalbox';
import {CheckBox} from 'react-native-elements';
// types
import {ModalLicenseProps, ModalLicenseState} from '.';
//  configs
import appConfig from 'app-config';
// routing
import {Actions} from 'react-native-router-flux';
// custom components
import CustomAutoHeightWebView from 'src/components/CustomAutoHeightWebview';

const styles = StyleSheet.create({
  modalLicense: {
    height: null,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: appConfig.colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: appConfig.device.bottomSpace,
  },
  topSpacing: {
    height: 30,
  },
  titleContainer: {
    padding: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: appConfig.colors.border,
  },
  title: {
    textAlign: 'center',
    color: appConfig.colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  modalContentWrapper: {
    width: '100%',
  },
  contentHtmlContainer: {
    height: appConfig.device.height * 0.65,
  },
  contentTextContainer: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  checkboxesContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  checkboxContainer: {
    margin: 0,
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'transparent',
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
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: appConfig.colors.border,
  },
  actionLeftButton: {
    borderRightWidth: 1,
    borderColor: appConfig.colors.border,
  },
  actionButtonLabel: {
    color: appConfig.colors.text,
  },
  actionAgreeBtnLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

class ModalLicense extends Component<ModalLicenseProps, ModalLicenseState> {
  static defaultProps = {
    backdropPressToClose: true,
    onDisagree: () => {},
    onAgree: () => {},
  };

  state = {
    checkboxes: this.props.checkboxes,
    agreeBtnDisabled: true,
  };
  refModalLicense = React.createRef<any>();

  componentDidMount() {
    Keyboard.dismiss();

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
    this.closeModal();
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

  handlePressDisagree = () => {
    if (this.props.onDisagree) {
      this.props.onDisagree();
    }
    this.closeModal();
  };

  closeModal() {
    if (this.refModalLicense.current) {
      this.refModalLicense.current.close();
    }
  }

  render() {
    const {t} = this.props;

    return (
      <Modal
        ref={this.refModalLicense}
        isOpen
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        backdropPressToClose={this.props.backdropPressToClose}
        style={styles.modalLicense}
        // @ts-ignore
        easing={Easing.quad}
        animationDuration={250}
        onClosed={Actions.pop}>
        <View style={styles.container}>
          {!!this.props.title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
            </View>
          ) : (
            <View style={styles.topSpacing} />
          )}

          <View style={styles.modalContentWrapper}>
            <ScrollView
              style={styles.contentHtmlContainer}
              contentContainerStyle={[styles.contentTextContainer]}>
              {!!this.props.isHTML ? (
                <CustomAutoHeightWebView content={this.props.content} />
              ) : (
                <Text>{this.props.content}</Text>
              )}
            </ScrollView>

            {!!this.props.checkboxes?.length && (
              <View style={styles.checkboxesContainer}>
                {this.props.checkboxes?.map((item, index) => {
                  const requiredColor = item.required
                    ? appConfig.colors.status.danger
                    : '#0e0e0e';
                  const requiredTitleMarker = ` ${item.required ? '(*)' : ''}`;

                  return (
                    <View key={index} style={styles.checkboxWrapper}>
                      <CheckBox
                        iconType={'material-community'}
                        containerStyle={styles.checkboxContainer}
                        textStyle={[
                          styles.checkboxLabel,
                          {
                            color: item.required
                              ? appConfig.colors.primary
                              : appConfig.colors.text,
                            fontWeight: item.required ? '500' : '400',
                            fontSize: item.required ? 14 : 12,
                          },
                        ]}
                        checkedIcon={
                          item.required
                            ? 'checkbox-marked-circle-outline'
                            : 'checkbox-marked-outline'
                        }
                        uncheckedIcon={
                          item.required
                            ? 'checkbox-blank-circle-outline'
                            : 'checkbox-blank-outline'
                        }
                        checked={this.state.checkboxes[index].confirmed}
                        uncheckedColor={requiredColor}
                        checkedColor={requiredColor}
                        onPress={() => this.toggleCheckbox(index)}
                        title={item.label + requiredTitleMarker}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.modalActionBtnContainer}>
            {!!this.props.agreeTitle && (
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
                        : appConfig.colors.primary,
                    },
                  ]}>
                  {this.props.agreeTitle}
                </Text>
              </TouchableOpacity>
            )}

            {!!this.props.declineTitle && (
              <TouchableOpacity
                onPress={this.handlePressDisagree}
                style={styles.actionButton}>
                <Text style={styles.actionButtonLabel}>
                  {this.props.declineTitle}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(ModalLicense);
