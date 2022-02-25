import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Easing,
  Keyboard,
  BackHandler,
} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modalbox';
import {CheckBox} from 'react-native-elements';
// types
import {ModalLicenseProps, ModalLicenseState} from '.';
import {Style} from 'src/Themes/interface';
//  configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import CustomAutoHeightWebView from 'src/components/CustomAutoHeightWebview';
import {
  Container,
  Typography,
  ScrollView,
  TextButton,
} from 'src/components/base';
import Loading from '../Loading';

const styles = StyleSheet.create({
  modalLicense: {
    height: null,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSpacing: {
    height: 30,
  },
  titleContainer: {
    padding: 15,
    width: '100%',
  },
  title: {
    textAlign: 'center',
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
  },
  actionAgreeBtnLabel: {
    fontWeight: 'bold',
  },
});

class ModalLicense extends Component<ModalLicenseProps, ModalLicenseState> {
  static contextType = ThemeContext;

  static defaultProps = {
    backdropPressToClose: true,
    onDisagree: () => {},
    onAgree: () => {},
  };

  state = {
    content: this.props.content,
    checkboxes: this.props.checkboxes,
    agreeBtnDisabled: true,
    loading: false,
  };
  refModalLicense = React.createRef<any>();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    Keyboard.dismiss();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleHardwareBackPress,
    );

    if (this.props.apiHandler) {
      this.getContent();
    }

    if (this.props.apiHandler) {
      this.getContent();
    }

    if (this.props.checkboxes?.length === 0) {
      this.setState({
        agreeBtnDisabled: false,
      });
    } else {
      this.handleBtnAgreeDisabled();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleHardwareBackPress,
    );
  }

  handleHardwareBackPress = () => {
    if (this.props.backdropPressToClose) {
      this.closeModal();
    }

    return true;
  };

  getContent = async () => {
    this.setState({loading: true});

    const {content} = await this.props.apiHandler();
    setTimeout(() => this.setState({content, loading: false}), 3000);
  };

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

  get containerStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
      borderTopRightRadius: this.theme.layout.borderRadiusHuge,
    };
  }

  get titleContainerStyle(): Style {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidth,
    };
  }

  get modalActionBtnContainerStyle(): Style {
    return {
      borderColor: this.theme.color.border,
      borderTopWidth: this.theme.layout.borderWidth,
    };
  }

  get separatorStyle(): Style {
    return {
      backgroundColor: this.theme.color.border,
      width: this.theme.layout.borderWidth,
    };
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
        onClosed={pop}>
        <Container safeLayout style={[styles.container, this.containerStyle]}>
          {this.state.loading && <Loading center />}

          {!!this.props.title ? (
            <View style={[styles.titleContainer, this.titleContainerStyle]}>
              <Typography
                type={TypographyType.TITLE_LARGE}
                style={styles.title}>
                {this.props.title}
              </Typography>
            </View>
          ) : (
            <View style={styles.topSpacing} />
          )}

          <View style={styles.modalContentWrapper}>
            <ScrollView
              style={styles.contentHtmlContainer}
              contentContainerStyle={styles.contentTextContainer}>
              {!!this.props.isHTML ? (
                <CustomAutoHeightWebView content={this.state.content} />
              ) : (
                <Typography type={TypographyType.LABEL_MEDIUM}>
                  {this.props.content}
                </Typography>
              )}
            </ScrollView>

            {!!this.state.checkboxes?.length && (
              <View style={styles.checkboxesContainer}>
                {this.state.checkboxes.map((item, index) => {
                  const requiredColor: string = item.required
                    ? (this.theme.color.primaryHighlight as string)
                    : (this.theme.color.textPrimary as string);
                  const requiredTitleMarker = ` ${item.required ? '(*)' : ''}`;

                  return (
                    <View key={index} style={styles.checkboxWrapper}>
                      <CheckBox
                        iconType={'material-community'}
                        containerStyle={styles.checkboxContainer}
                        textStyle={[
                          styles.checkboxLabel,
                          this.theme.typography[TypographyType.LABEL_SMALL],
                          item.required && [
                            {fontWeight: 'bold'},
                            this.theme.typography[
                              TypographyType.LABEL_MEDIUM_PRIMARY
                            ],
                          ],
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

          <View
            style={[
              styles.modalActionBtnContainer,
              this.modalActionBtnContainerStyle,
            ]}>
            {!!this.props.declineTitle && (
              <>
                <TextButton
                  neutral
                  onPress={this.handlePressDisagree}
                  style={[styles.actionButton]}>
                  {this.props.declineTitle}
                </TextButton>
                {!!this.props.agreeTitle && (
                  <View style={this.separatorStyle} />
                )}
              </>
            )}

            {!!this.props.agreeTitle && (
              <TextButton
                disabled={this.state.agreeBtnDisabled}
                typoProps={{type: TypographyType.LABEL_LARGE_PRIMARY}}
                onPress={this.handlePressAgree}
                style={styles.actionButton}
                titleStyle={styles.actionAgreeBtnLabel}>
                {this.props.agreeTitle}
              </TextButton>
            )}
          </View>
        </Container>
      </Modal>
    );
  }
}

export default withTranslation()(ModalLicense);
