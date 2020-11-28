import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import appConfig from 'app-config';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { APIRequest } from '../../../network/Entity';
import EventTracker from '../../../helper/EventTracker';
import { Actions } from 'react-native-router-flux';

class Confirm extends Component {
  static defaultProps = {
    date: '',
    dateSubTitle: '',
    timeRange: '',
    noteTitle: 'Ghi chú về cuộc hẹn',
    appointmentName: '',
    description: '',
    btnMessage: ''
  };

  state = {
    note: ''
  };
  bookServiceRequest = new APIRequest();
  requests = [this.bookServiceRequest];
  eventTracker = new EventTracker();

  componentDidMount() {
    setTimeout(() =>
      Actions.refresh({
        title:
          this.props.title ||
          this.props.t('common:screen.scheduleConfirm.mainTitle')
      })
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();
  }

  async bookService() {
    this.setState({ loading: true });
    const { t } = this.props;
    const errMess = t('common:api.error.message');
    try {
      const data = {
        service_id: this.props.serviceId,
        note: this.state.note,
        date: this.props.date,
        time: this.props.timeRange
      };
      this.bookServiceRequest.data = APIHandler.service_book(
        this.props.siteId,
        data
      );
      const response = await this.bookServiceRequest.promise();
      console.log(this.props.serviceId, data);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            flashShowMessage({
              type: 'success',
              message: response.message
            });
            Actions.pop();
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || errMess
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || errMess
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: errMess
        });
      }
    } catch (err) {
      console.log('%cbook_schedule_service', 'color:red', err);
      flashShowMessage({
        type: 'danger',
        message: errMess
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  handleChangeText(row, text) {
    this.setState({
      [row.id]: text
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
        onChangeText={text => {
          this.handleChangeText(row, text);
        }}
      />
    ));
  }

  render() {
    const { t } = this.props;
    const rows = [
      {
        iconName: 'calendar-star',
        title: this.props.dateView,
        subTitle: this.props.dateDescription
      },
      {
        iconName: 'clock',
        title: this.props.timeRange,
        subTitle: this.props.timeRangeDescription
      },
      {
        id: 'note',
        iconName: 'pencil',
        title: t('confirm.note.title'),
        editable: true,
        placeholder: t('confirm.note.placeholder')
      }
    ];
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.bgHeader}></View>
            <View style={styles.infoContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: this.props.image }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              {!!this.props.appointmentName && (
                <Text style={styles.heading}>{this.props.appointmentName}</Text>
              )}
              {!!this.props.appointmentDescription && (
                <Text style={styles.subHeading}>
                  {this.props.appointmentDescription}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.bodyContainer}>
            {this.renderRows(rows)}
            {!!this.props.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{this.props.description}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Button
          onPress={this.bookService.bind(this)}
          containerStyle={styles.btnContainerStyle}
          renderBefore={
            !!this.props.btnMessage && (
              <View style={styles.btnMessageContainer}>
                {/* <Icon name="cube-send" style={styles.btnIcon} /> */}
                <Text style={styles.rowSubTitle}>{this.props.btnMessage}</Text>
              </View>
            )
          }
          title={t('confirm.requestAppointment')}
        />

        {appConfig.device.isIOS && <KeyboardSpacer />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bgHeader: {
    backgroundColor: '#888',
    width: '100%',
    height: 100,
    position: 'absolute'
  },
  infoContainer: {
    marginTop: 50,
    paddingBottom: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaa'
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderColor: '#555',
    borderWidth: 0.5,
    backgroundColor: '#fff'
  },
  logo: {
    width: '100%',
    height: '100%'
  },
  heading: {
    color: '#242424',
    marginTop: 15,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0.5
  },
  subHeading: {
    color: '#888',
    marginTop: 7,
    fontSize: 15
  },
  bodyContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7
  },
  rowIcon: {
    color: '#aaa',
    fontSize: 30,
    paddingVertical: 10,
    paddingRight: 20
  },
  rowInfo: {
    flex: 1
  },
  rowTitle: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16
  },
  rowSubTitle: {
    color: '#888',
    marginTop: 5
    // fontSize: 13
  },
  input: {
    // fontSize: 13
    marginTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },
  descriptionContainer: {
    marginTop: 5,
    paddingVertical: 20
  },
  description: {
    color: '#777'
  },
  btnIcon: {
    marginRight: 10,
    fontSize: 20,
    color: '#aaa'
  },
  btnContainerStyle: {
    borderTopColor: '#aaa',
    borderTopWidth: 0.5
  },
  btnMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 10
  }
});

export default withTranslation(['schedule', 'common'])(Confirm);

const ConfirmRow = props => {
  return (
    <View style={styles.row}>
      <Icon name={props.iconName} style={styles.rowIcon} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{props.title}</Text>
        {props.editable ? (
          <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            placeholderTextColor={appConfig.colors.placeholder}
            onChangeText={props.onChangeText}
          />
        ) : (
          !!props.subTitle && (
            <Text style={styles.rowSubTitle}>{props.subTitle}</Text>
          )
        )}
      </View>
    </View>
  );
};
