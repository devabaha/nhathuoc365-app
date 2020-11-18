import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import Button from '../../../Button';
import { Actions } from 'react-native-router-flux';
import EventTracker from '../../../../helper/EventTracker';

const defaultListener = () => {};

class Result extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    mainIconName: PropTypes.string,
    mainTitle: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    btnTitle: PropTypes.string
  };

  static defaultProps = {
    visible: false,
    onClose: defaultListener,
    onConfirm: defaultListener,
    mainIconName: 'checkcircle',
    mainTitle: '',
    title: '',
    subTitle: '',
    btnTitle: ''
  };

  state = {};
  eventTracker = new EventTracker();

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.backHandlerListener.bind(this)
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.backHandlerListener.bind(this)
    );
    this.eventTracker.clearTracking();
  }

  backHandlerListener() {
    return true;
  }

  onClose = () => {
    Actions.pop();
    this.props.onClose();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          {/* <TouchableOpacity style={styles.close} onPress={this.onClose}>
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity> */}
          <View style={[styles.header_content, styles.center]}>
            <Icon name={this.props.mainIconName} size={80} color="#ffffff" />
            <Text style={styles.header_mess}>{this.props.mainTitle}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={[styles.notification, styles.center]}>
            <Text style={styles.noti_mess_title}>{this.props.title}</Text>
            {!!this.props.subTitle && (
              <Text style={styles.noti_mess_sub_title}>
                {this.props.subTitle}
              </Text>
            )}
          </View>
        </View>

        <Button
          containerStyle={styles.submitBtn}
          title={this.props.btnTitle}
          onPress={this.props.onConfirm}
          iconLeft={
            <Icon name="home" color="white" size={22} style={styles.btnIcon} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    backgroundColor: appConfig.colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 15
  },
  header_mess: {
    color: '#ffffff',
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold'
  },
  close: {
    position: 'absolute',
    top: appConfig.device.isIOS ? 35 : 20,
    right: 20
  },
  body: {
    flex: 2.5
  },
  notification: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9'
  },
  noti_mess_title: {
    textAlign: 'center',
    fontSize: 16,
    color: '#464646'
  },
  noti_mess_sub_title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#a9a9a9'
  },
  rowInfo: {
    paddingLeft: 15
  },
  content: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  btnIcon: {
    marginRight: 10
  },
  submitBtn: {
    marginBottom: appConfig.device.bottomSpace
  }
});

export default Result;

const RowInfo = props => {
  const borderStyle = props.first
    ? {
        borderTopWidth: 1,
        borderBottomWidth: 1
      }
    : props.last
    ? {
        borderBottomWidth: 1
      }
    : {
        borderBottomWidth: 1
      };

  const extraProps = !props.onPress && {
    activeOpacity: 1
  };

  return (
    <TouchableOpacity
      style={[styles.rowInfo, borderStyle]}
      onPress={props.onPress}
      {...extraProps}
    >
      <View style={[styles.content, borderStyle]}>
        <Text style={styles.row_label}>{props.label}</Text>
        <Text style={styles.row_value}>{props.value}</Text>
      </View>
    </TouchableOpacity>
  );
};
