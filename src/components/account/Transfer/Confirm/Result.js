import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
// custom components
import Button from 'src/components/Button';
import {ScreenWrapper, Typography, Icon, Container} from 'src/components/base';

const defaultListener = () => {};

class Result extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    mainIconName: PropTypes.string,
    mainTitle: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    btnTitle: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    onClose: defaultListener,
    onConfirm: defaultListener,
    mainIconName: 'checkcircle',
    mainTitle: '',
    title: '',
    subTitle: '',
    btnTitle: '',
  };

  state = {};
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.backHandlerListener.bind(this),
    );
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.backHandlerListener.bind(this),
    );
    this.eventTracker.clearTracking();
  }

  backHandlerListener() {
    return true;
  }

  onClose = () => {
    pop();
    this.props.onClose();
  };

  get iconBtnStyle() {
    return {color: this.theme.color.onPrimary};
  }

  get headerMessageStyle() {
    return {color: this.theme.color.onNavBarBackground};
  }

  get notificationStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidth,
      borderBottomColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <ScreenWrapper safeLayout>
        <View
          style={[
            styles.header,
            {
              backgroundColor: this.theme.color.navBarBackground,
            },
          ]}>
          {/* <TouchableOpacity style={styles.close} onPress={this.onClose}>
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity> */}
          <View style={[styles.header_content, styles.center]}>
            <Icon
              bundle={BundleIconSetName.ANT_DESIGN}
              name={this.props.mainIconName}
              style={{fontSize: 80, color: this.theme.color.onNavBarBackground}}
            />
            <Typography
              type={TypographyType.TITLE_LARGE}
              style={[styles.header_mess, this.headerMessageStyle]}>
              {this.props.mainTitle}
            </Typography>
          </View>
        </View>
        <View style={styles.body}>
          <Container
            style={[
              styles.notification,
              styles.center,
              this.notificationStyle,
            ]}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.noti_mess_title}>
              {this.props.title}
            </Typography>
            {!!this.props.subTitle && (
              <Typography
                type={TypographyType.DESCRIPTION_SMALL}
                style={styles.noti_mess_sub_title}>
                {this.props.subTitle}
              </Typography>
            )}
          </Container>
        </View>
        <Button
          title={this.props.btnTitle}
          onPress={this.props.onConfirm}
          renderIconLeft={(titleStyle) => {
            return (
              <Icon
                bundle={BundleIconSetName.ANT_DESIGN}
                name="home"
                style={[titleStyle, styles.btnIcon]}
              />
            );
          }}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 15,
  },
  header_mess: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  close: {
    position: 'absolute',
    top: appConfig.device.isIOS ? 35 : 20,
    right: 20,
  },
  body: {
    flex: 2.5,
  },
  notification: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
  },
  noti_mess_title: {
    textAlign: 'center',
  },
  noti_mess_sub_title: {
    marginTop: 10,
    textAlign: 'center',
  },
  rowInfo: {
    paddingLeft: 15,
  },
  content: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnIcon: {
    marginRight: 10,
    fontSize: 22,
  },
});

export default Result;

const RowInfo = (props) => {
  const borderStyle = props.first
    ? {
        borderTopWidth: 1,
        borderBottomWidth: 1,
      }
    : props.last
    ? {
        borderBottomWidth: 1,
      }
    : {
        borderBottomWidth: 1,
      };

  const extraProps = !props.onPress && {
    activeOpacity: 1,
  };

  return (
    <TouchableOpacity
      style={[styles.rowInfo, borderStyle]}
      onPress={props.onPress}
      {...extraProps}>
      <View style={[styles.content, borderStyle]}>
        <Typography style={styles.row_label}>{props.label}</Typography>
        <Typography style={styles.row_value}>{props.value}</Typography>
      </View>
    </TouchableOpacity>
  );
};
