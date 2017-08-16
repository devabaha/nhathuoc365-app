/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

//library
import Modal from 'react-native-modalbox';

export default class PopupConfirm extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        swipeToClose={this.props.otherClose}
        backdropPressToClose={this.props.otherClose}
        backButtonClose={this.props.otherClose}
        entry="top"
        style={[styles.modal, styles.modal_confirm, {
          height: this.props.height || 110,
          marginTop: this.props.height ? -(this.props.height / 3) : -(110 / 3)
        }]}
        ref={this.props.ref_popup}>

        {this.props.content ? this.props.content(this.props.title) : <Text style={styles.modal_confirm_title}>{this.props.title}</Text>}

        <View style={styles.modal_confirm_actions}>
          <TouchableHighlight
            style={[styles.modal_confirm_btn, styles.modal_confirm_btn_left]}
            underlayColor="transparent"
            onPress={this.props.noConfirm}>
            <Text style={styles.modal_confirm_label}>{this.props.noTitle || 'Không'}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.modal_confirm_btn}
            underlayColor="transparent"
            onPress={this.props.yesConfirm}>
            <Text style={styles.modal_confirm_label}>{this.props.yesTitle || 'Có'}</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

PopupConfirm.propTypes = {
    ref_popup: PropTypes.func.isRequired,
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
    content: PropTypes.any
};

const styles = StyleSheet.create({
  modal_confirm: {
    width: '80%',
    height: 110,
    borderRadius: 3
  },
  modal_confirm_title: {
    paddingHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
    color: "#666666",
    fontSize: 14
  },
  modal_confirm_actions: {
    position: 'absolute',
    width: '100%',
    height: 42,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  modal_confirm_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',

    borderTopWidth: Util.pixel,
    borderTopColor: "#dddddd",
  },
  modal_confirm_btn_left: {
    borderRightWidth: Util.pixel,
    borderRightColor: "#dddddd"
  },
  modal_confirm_label: {
    fontSize: 16,
    color: DEFAULT_COLOR,
    lineHeight: 20,
  }
});
