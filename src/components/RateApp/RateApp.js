import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {default as ModalBox} from 'react-native-modalbox';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {mergeStyles} from 'src/Themes/helper';
import {openLink} from 'app-helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext, getTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import APIHandler from '../../network/APIHandler';
// images
import JPGBackgroundImage from 'src/images/thanks.jpg';
// custom components
import {Container, Typography} from 'src/components/base';
import Button from 'src/components/Button';
import Loading from '../Loading';
import Image from '../Image';

class RateApp extends PureComponent {
  static contextType = ThemeContext;

  state = {
    loading: false,
  };

  ref_modal = React.createRef();
  unmounted = false;
  eventTracker = new EventTracker();

  platformStore = appConfig.device.isIOS ? 'App Store' : 'Play Store';

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  rateApp = async () => {
    const {t} = this.props;
    this.setState({loading: true});
    const url = store.store_data ? store.store_data.link_update : null;
    url && openLink(url);

    try {
      const response = await APIHandler.user_rate_app();
      if (response && response.status === STATUS_SUCCESS) {
        flashShowMessage({
          type: 'success',
          message: response.message,
        });
        this.onClose();
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('common:api.error.message'),
        });
      }
    } catch (err) {
      console.log('rate_app', err);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
        });
    }
  };

  onClose = () => {
    if (this.ref_modal.current) {
      this.ref_modal.current.close();
    }
  };

  onClosedModal = () => {
    pop();
  };

  get modalStyle() {
    return mergeStyles(styles.modal, {
      borderBottomLeftRadius: this.theme.layout.borderRadiusLarge,
      borderBottomRightRadius: this.theme.layout.borderRadiusLarge,
    });
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      borderBottomLeftRadius: this.theme.layout.borderRadiusLarge,
      borderBottomRightRadius: this.theme.layout.borderRadiusLarge,
    });
  }

  get headingContainerStyle() {
    return mergeStyles(styles.headingContainer, {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  render() {
    const {t} = this.props;
    return (
      <ModalBox
        entry="top"
        position="top"
        style={this.modalStyle}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        onClosed={this.onClosedModal}
        useNativeDriver
        swipeToClose={false}
        backdropPressToClose={false}>
        {this.state.loading && <Loading center />}
        <Image source={JPGBackgroundImage} style={styles.image} />
        <Container style={this.containerStyle}>
          <Container noBackground style={this.headingContainerStyle}>
            <Typography type={TypographyType.TITLE_HUGE} style={styles.heading}>
              {t('title')}
            </Typography>
          </Container>
          <View style={styles.bodyContainer}>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.body}>
              {t('message.first', {
                appName: APP_NAME_SHOW,
                storeName: this.platformStore,
              })}
            </Typography>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.body}>
              {t('message.second')}
            </Typography>
          </View>
          <View style={styles.footerContainer}>
            <Button
              neutral
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
        </Container>
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
    height: null,
    width: '80%',
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: '1%',
  },
  image: {
    width: '100%',
    height: appConfig.device.height * 0.35,
    resizeMode: 'cover',
  },
  headingContainer: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  bodyContainer: {
    alignItems: 'center',
    padding: 10,
    paddingTop: 0,
  },
  body: {
    marginTop: 15,
    lineHeight: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 0,
  },
  btnAccept: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  btnCancel: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default withTranslation(['rateApp', 'common'])(RateApp);
