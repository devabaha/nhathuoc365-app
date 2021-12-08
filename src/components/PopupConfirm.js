import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Modal from 'react-native-modalbox';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// customs components
import {Typography, TextButton, Container, Icon} from 'src/components/base';

const POPUP_TYPES = {
  WARNING: 'warning',
  DANGER: 'danger',
  SUCCESS: 'success',
  INFO: 'info',
};

class PopupConfirm extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    dangerConfirm: PropTypes.bool,
    type: PropTypes.oneOf([
      POPUP_TYPES.WARNING,
      POPUP_TYPES.DANGER,
      POPUP_TYPES.SUCCESS,
      POPUP_TYPES.INFO,
    ]),
  };

  textButtonTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  get theme() {
    return getTheme(this);
  }

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

      return (
        <View style={this.iconContainerStyle}>
          <Icon
            bundle={BundleIconSetName.IONICONS}
            name={name}
            style={this.iconStyle}
          />
        </View>
      );
    }

    return null;
  }

  get iconContainerStyle() {
    return mergeStyles(styles.badgeContainer, {
      backgroundColor: this.theme.color[this.props.type],
    });
  }

  get iconStyle() {
    return mergeStyles(styles.badge, {
      color: this.theme.color.onPrimary,
    });
  }

  get modalConfirmActionsStyle() {
    return mergeStyles(styles.modal_confirm_actions, {
      borderBottomLeftRadius: this.theme.layout.borderRadiusSmall,
      borderBottomRightRadius: this.theme.layout.borderRadiusSmall,
      borderTopWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  get modalCancelLabelStyle() {
    return mergeStyles(styles.modal_cancel_label, {
      color: this.theme.color.textTertiary,
    });
  }

  get modalConfirmLabelStyle() {
    return mergeStyles(styles.modal_confirm_label, {
      color: this.props.dangerConfirm
        ? this.theme.color.danger
        : this.theme.color.primaryHighlight,
    });
  }

  get modalConfirmBtnLeftStyle() {
    return mergeStyles(styles.modal_confirm_btn_left, {
      borderRightWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  get modalCancelBtnStyle() {
    return mergeStyles(styles.modal_cancel_btn, {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    });
  }

  get contentContainerStyle() {
    return mergeStyles(styles.contentContainer, {
      borderTopLeftRadius: this.theme.layout.borderRadiusSmall,
      borderTopRightRadius: this.theme.layout.borderRadiusSmall,
    });
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
          <Container style={this.contentContainerStyle}>
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={[
                styles.modal_confirm_title,
                !!this.props.type && {marginTop: 28},
                this.props.titleStyle,
              ]}>
              {this.props.title}
            </Typography>
          </Container>
        )}

        <Container style={this.modalConfirmActionsStyle}>
          <TextButton
            style={[
              styles.modal_confirm_btn,
              this.modalConfirmBtnLeftStyle,
              this.modalCancelBtnStyle,
            ]}
            onPress={this.props.noConfirm}
            typoProps={this.textButtonTypoProps}
            titleStyle={[
              this.modalCancelLabelStyle,
              // {
              //   color: this.props.noBlur ? '#999999' : DEFAULT_COLOR,
              // },
            ]}>
            {this.props.noTitle || t('popupConfirm.no')}
          </TextButton>

          <TextButton
            style={styles.modal_confirm_btn}
            typoProps={this.textButtonTypoProps}
            onPress={this.props.yesConfirm}
            titleStyle={this.modalConfirmLabelStyle}>
            {this.props.yesTitle || t('popupConfirm.yes')}
          </TextButton>
        </Container>
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
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  modal_confirm_title: {
    paddingHorizontal: 20,
    marginTop: 16,
    textAlign: 'center',
  },
  modal_confirm_actions: {
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
  },
  modal_confirm_btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 42,
  },
  modal_cancel_btn: {},
  modal_confirm_btn_left: {},
  modal_confirm_label: {
    lineHeight: 20,
    fontWeight: '500',
  },
  modal_cancel_label: {},

  contentContainer: {
    paddingBottom: 16,
  },

  badgeContainer: {
    zIndex: 1,
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
  },
});

export default withTranslation()(PopupConfirm);
