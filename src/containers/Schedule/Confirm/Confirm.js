import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import appConfig from 'app-config';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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

  state = {};

  renderRows(rows) {
    return rows.map((row, indx) => (
      <ConfirmRow
        key={indx}
        title={row.title}
        subTitle={row.subTitle}
        iconName={row.iconName}
        editable={row.editable}
        placeholder={row.placeholder}
      />
    ));
  }

  render() {
    const { t } = this.props;
    const rows = [
      {
        iconName: 'calendar-star',
        title: this.props.date,
        subTitle: this.props.dateDescription
      },
      {
        iconName: 'clock',
        title: this.props.timeRange,
        subTitle: this.props.timeRangeDescription
      },
      {
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
              <View style={styles.logo} />
              <Text style={styles.heading}>{this.props.appointmentName}</Text>
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
          containerStyle={styles.btnContainerStyle}
          renderBefore={
            !!this.props.btnMessage && (
              <View style={styles.btnMessageContainer}>
                <Icon name="cube-send" style={styles.btnIcon} />
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
    backgroundColor: '#aaa',
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
  logo: {
    width: 100,
    height: 100,
    borderColor: '#555',
    borderWidth: 0.5,
    backgroundColor: '#fff'
  },
  heading: {
    color: '#242424',
    marginTop: 15,
    fontSize: 22,
    fontWeight: '500'
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
    marginTop: 5,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#aaa'
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

export default withTranslation('schedule')(Confirm);

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
