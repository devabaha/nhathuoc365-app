import React, {Component} from 'react';
import {Alert, StyleSheet} from 'react-native';
// 3-party libs
import Communications from 'react-native-communications';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {IconButton} from 'src/components/base';

class RightButtonCall extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    userName: '',
    tel: '',
  };

  get theme() {
    return getTheme(this);
  }

  handleCall() {
    if (this.props.tel && this.props.tel != '') {
      Communications.phonecall(this.props.tel, true);
    } else {
      let username = this.props.t('callErrorAlert.userTitle');
      if (this.props.userName) {
        userName += ' ' + this.props.userName.trim();
      }

      Alert.alert(
        this.props.t('callErrorAlert.cantCall'),
        this.props.t('callErrorAlert.notRegisterPhoneYet', {username}),
        [{text: this.props.t('callErrorAlert.confirm')}],
      );
    }
  }

  get iconCallStyle() {
    return mergeStyles(styles.iconCall, {
      color: this.theme.color.onPrimary,
    });
  }

  render() {
    return (
      <IconButton
        bundle={BundleIconSetName.FONT_AWESOME}
        name="phone"
        iconStyle={this.iconCallStyle}
        onPress={this.handleCall.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 8 : 4,
  },

  iconCall: {
    marginRight: 4,
    marginTop: 6,
    fontSize: 22,
  },
});

export default withTranslation('orders')(observer(RightButtonCall));
