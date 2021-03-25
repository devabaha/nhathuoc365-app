/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';

//library
import Modal from 'react-native-modalbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';

const POPUP_TYPES = {
  WARNING: 'warning',
  DANGER: 'danger',
  SUCCESS: 'success',
  INFO: 'info',
};
class PopupConfirm extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      POPUP_TYPES.WARNING,
      POPUP_TYPES.DANGER,
      POPUP_TYPES.SUCCESS,
      POPUP_TYPES.INFO,
    ]),
  };

  renderBadge() {
    if (this.props.type) {
      let name = '';
      switch (this.props.type) {
        case POPUP_TYPES.WARNING:
          name = 'ios-warning';
          break;
        case POPUP_TYPES.DANGER:
          name = 'ios-alert';
          break;
        case POPUP_TYPES.SUCCESS:
          name = 'ios-checkmark';
          break;
        case POPUP_TYPES.INFO:
          name = 'ios-information';
          break;
      }
      const extraStyle = {
        backgroundColor: appConfig.colors.status[this.props.type],
      };
      return (
        <View style={[styles.badgeContainer, extraStyle]}>
          <Ionicons name={name} style={styles.badge} />
        </View>
      );
    }

    return null;
  }

  render() {
    const {t} = this.props;

    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        swipeToClose={this.props.otherClose}
        backdropPressToClose={this.props.otherClose}
        backButtonClose={this.props.otherClose}
        entry="top"
        style={[
          styles.modal,
          styles.modal_confirm,
          // {
          //   height: this.props.height || 110,
          //   marginTop: this.props.height
          //     ? -(this.props.height / 3)
          //     : -(110 / 3),
          // },
          this.props.style,
        ]}
        ref={this.props.ref_popup}>
        {this.renderBadge()}

        {this.props.content ? (
          this.props.content(this.props.title)
        ) : (
          <Text
            style={[
              styles.modal_confirm_title,
              !!this.props.type && {marginTop: 28},
              this.props.titleStyle,
            ]}>
            {this.props.title}
          </Text>
        )}

        <View style={styles.modal_confirm_actions}>
          <TouchableHighlight
            style={[styles.modal_confirm_btn, styles.modal_confirm_btn_left, this.props.isConfirm&& styles.model_cancel_btn]}
            underlayColor="transparent"
            onPress={this.props.noConfirm}>
            <Text
              style={[
                styles.modal_confirm_label,
                this.props.isConfirm && styles.modal_cancel_label
                // {
                //   color: this.props.noBlur ? '#999999' : DEFAULT_COLOR,
                // },
              ]}>
              {this.props.noTitle || t('popupConfirm.no')}
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.modal_confirm_btn}
            underlayColor="transparent"
            onPress={this.props.yesConfirm}>
            <Text style={styles.modal_confirm_label}>
              {this.props.yesTitle || t('popupConfirm.yes')}
            </Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

PopupConfirm.propTypes = {
  ref_popup: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.any}),
  ]).isRequired,
  title: PropTypes.string.isRequired,
  noTitle: PropTypes.string,
  yesTitle: PropTypes.string,
  height: PropTypes.number,
  noConfirm: PropTypes.func.isRequired,
  yesConfirm: PropTypes.func.isRequired,

  onClosed: PropTypes.func,
  onOpened: PropTypes.func,
  otherClose: PropTypes.bool,
  isOpen: PropTypes.bool,
  content: PropTypes.any,
};

const styles = StyleSheet.create({
  modal_confirm: {
    width: '80%',
    height: null,
    // minHeight: 110,
    borderRadius: 3,
    justifyContent: 'space-between',
  },
  modal_confirm_title: {
    paddingHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  modal_confirm_actions: {
    paddingTop: 16,
    // position: 'absolute',
    width: '100%',
    // height: 42,
    // left: 0,
    // bottom: 0,
    // right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  modal_confirm_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 42,

    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
  },
  model_cancel_btn: {
    backgroundColor: '#f5f5f5'
  },
  modal_confirm_btn_left: {
    borderRightWidth: Util.pixel,
    borderRightColor: '#dddddd',
  },
  modal_confirm_label: {
    fontSize: 16,
    color: appConfig.colors.primary,
    lineHeight: 20,
    fontWeight: '500'
  },
  modal_cancel_label: {
    color: '#888',
  },

  badgeContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
  },
  badge: {
    fontSize: 30,
    color: '#fff',
  },
});

export default withTranslation()(PopupConfirm);
