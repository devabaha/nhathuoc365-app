import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import KeyboardSpacer from 'react-native-keyboard-spacer';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ORDER_TYPES} from 'src/constants';
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import {
  ScreenWrapper,
  ScrollView,
  Container,
  Typography,
} from 'src/components/base';
import Image from 'src/components/Image';
import ConfirmRow from './ConfirmRow';
import {observer} from 'mobx-react';

class Confirm extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    date: '',
    dateSubTitle: '',
    timeRange: '',
    noteTitle: '',
    appointmentName: '',
    description: '',
    btnMessage: '',
    type: ORDER_TYPES.NORMAL,
  };

  state = {
    note: '',
    loading: false,
  };
  bookServiceRequest = new APIRequest();
  requests = [this.bookServiceRequest];
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() =>
      refresh({
        title:
          this.props.title ||
          this.props.t('common:screen.scheduleConfirm.mainTitle'),
      }),
    );
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  getAPIHandler() {
    const data = {
      service_id: this.props.serviceId,
      note: this.state.note,
      date: this.props.date,
      time: this.props.timeRange,
    };

    switch (this.props.type) {
      case ORDER_TYPES.NORMAL:
        return APIHandler.service_book(this.props.siteId, data);
      case ORDER_TYPES.BOOKING:
        return APIHandler.cart_service_book(
          this.props.siteId,
          this.props.serviceId,
          data,
        );
      default:
        return APIHandler.service_book(this.props.siteId, data);
    }
  }

  async bookService() {
    this.setState({loading: true});
    const {t} = this.props;
    const errMess = t('common:api.error.message');
    try {
      this.bookServiceRequest.data = this.getAPIHandler();
      const response = await this.bookServiceRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
            pop();
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || errMess,
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || errMess,
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: errMess,
        });
      }
    } catch (err) {
      console.log('%cbook_schedule_service', 'color:red', err);
      flashShowMessage({
        type: 'danger',
        message: errMess,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  handleChangeText(row, text) {
    this.setState({
      [row.id]: text,
    });
  }

  renderRows(rows) {
    return rows.map((row, indx) => (
      <ConfirmRow
        key={indx}
        title={row.title}
        subTitle={row.subTitle}
        iconName={row.iconName}
        editable={row.editable}
        placeholder={row.placeholder}
        onChangeText={(text) => {
          this.handleChangeText(row, text);
        }}
      />
    ));
  }

  get bgHeaderStyle() {
    return mergeStyles(styles.bgHeader, {
      backgroundColor: this.theme.color.contentBackgroundStrong,
    });
  }

  get logoContainerStyle() {
    return mergeStyles(styles.logoContainer, {
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidthSmall,
    });
  }

  get borderContentStyle() {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get btnContainerStyle() {
    return {
      borderColor: this.theme.color.border,
      borderTopWidth: this.theme.layout.borderWidthSmall,
    };
  }

  render() {
    const {t} = this.props;
    const rows = [
      {
        iconName: 'calendar-star',
        title: this.props.dateView,
        subTitle: this.props.dateDescription,
      },
      {
        iconName: 'clock',
        title: this.props.timeRange,
        subTitle: this.props.timeRangeDescription,
      },
      {
        id: 'note',
        iconName: 'pencil',
        title: t('confirm.note.title'),
        editable: true,
        placeholder: t('confirm.note.placeholder'),
      },
    ];
    return (
      <ScreenWrapper>
        <Container flex>
          {this.state.loading && <Loading center />}
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Container style={this.bgHeaderStyle}>
                {!!this.props.cover && (
                  <Image
                    source={{uri: this.props.cover}}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                )}
              </Container>
              <View style={[styles.infoContainer, this.borderContentStyle]}>
                <Container style={this.logoContainerStyle}>
                  <Image
                    source={{uri: this.props.image}}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Container>
                {!!this.props.appointmentName && (
                  <Typography
                    type={TypographyType.TITLE_LARGE}
                    style={styles.heading}>
                    {this.props.appointmentName}
                  </Typography>
                )}
                {!!this.props.appointmentDescription && (
                  <Typography
                    type={TypographyType.LABEL_SEMI_LARGE_TERTIARY}
                    style={styles.subHeading}>
                    {this.props.appointmentDescription}
                  </Typography>
                )}
              </View>
            </View>

            <View style={styles.bodyContainer}>
              {this.renderRows(rows)}
              {!!this.props.description && (
                <View style={styles.descriptionContainer}>
                  <Typography
                    type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                    style={styles.description}>
                    {this.props.description}
                  </Typography>
                </View>
              )}
            </View>
          </ScrollView>

          <Button
            safeLayout={!store.keyboardTop}
            onPress={this.bookService.bind(this)}
            containerStyle={this.btnContainerStyle}
            renderBefore={
              !!this.props.btnMessage && (
                <View style={styles.btnMessageContainer}>
                  <Typography style={styles.rowSubTitle}>
                    {this.props.btnMessage}
                  </Typography>
                </View>
              )
            }
            title={t('confirm.requestAppointment')}
          />
        </Container>

        {appConfig.device.isIOS && <KeyboardSpacer />}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgHeader: {
    width: '100%',
    height: 100,
    position: 'absolute',
  },
  infoContainer: {
    marginTop: 50,
    paddingBottom: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  heading: {
    marginTop: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  subHeading: {
    marginTop: 7,
  },
  bodyContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },

  descriptionContainer: {
    marginTop: 5,
    paddingVertical: 20,
  },
  description: {},
  btnMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 10,
  },
});

export default withTranslation(['schedule', 'common'])(observer(Confirm));
