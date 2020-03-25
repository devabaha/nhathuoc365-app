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

class Confirm extends Component {
  static defaultProps = {
    date: 'Hôm nay, 24 tháng 3',
    timeRange: '16:15 - 16:45',
    noteTitle: 'Ghi chú về cuộc hẹn',
    appointmentName: 'Tick ID',
    description:
      'Tick ID sẽ nhìn thấy tên tài khoản của bạn để có thể liên hệ với bạn.',
    btnMessage: 'Doanh nghiệp thường trả lời trong vòng vài phút'
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
    const rows = [
      {
        iconName: 'calendar-star',
        title: this.props.date,
        subTitle: 'test'
      },
      {
        iconName: 'clock',
        title: this.props.timeRange,
        subTitle: 'test'
      },
      {
        iconName: 'pencil',
        title: this.props.noteTitle,
        editable: true,
        placeholder: 'Chạm để nhập ghi chú...'
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
            <View style={styles.btnMessageContainer}>
              <Icon name="cube-send" style={styles.btnIcon} />
              <Text style={styles.rowSubTitle}>{this.props.btnMessage}</Text>
            </View>
          }
          title="Yêu cầu cuộc hẹn"
        />
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
    backgroundColor: '#555'
  },
  heading: {
    color: '#242424',
    marginTop: 15,
    fontSize: 22,
    fontWeight: '500'
  },
  bodyContainer: {
    paddingTop: 15,
    paddingHorizontal: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7
  },
  rowIcon: {
    color: '#aaa',
    fontSize: 24,
    padding: 10
  },
  rowInfo: {
    flex: 1
  },
  rowTitle: {
    color: '#333',
    marginBottom: 5
  },
  rowSubTitle: {
    color: '#888',
    fontSize: 13
  },
  input: {
    fontSize: 13
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

export default Confirm;

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
          <Text style={styles.rowSubTitle}>{props.subTitle}</Text>
        )}
      </View>
    </View>
  );
};
