import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, StyleSheet} from 'react-native';
// configs
import config from 'src/packages/tickid-phone-card/config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, CardBorderRadiusType} from 'src/components/base';
// images
import closeImage from 'src/assets/images/close_lint.png';
// custom components
import {
  AppFilledButton,
  Card,
  Container,
  ImageButton,
  Typography,
} from 'src/components/base';

const defaultListener = () => {};

class ModalAllowPermisson extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    visible: PropTypes.bool,
    transparent: PropTypes.bool,
    onClose: PropTypes.func,
    onAllowAccessContacts: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    transparent: true,
    onClose: defaultListener,
    onAllowAccessContacts: defaultListener,
  };

  get theme() {
    return getTheme(this);
  }

  get containerStyle() {
    return {
      backgroundColor: this.theme.color.overlay30,
    };
  }

  render() {
    const {t} = this.props;

    return (
      <Modal
        animationType="fade"
        visible={this.props.visible}
        transparent={this.props.transparent}
        onRequestClose={this.props.onClose}>
        <Container flex center style={this.containerStyle}>
          <Card
            borderRadiusSize={CardBorderRadiusType.MEDIUM}
            style={styles.content}>
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={styles.heading}>
              {t('modalAllowPermission.title')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={styles.text}>
              {t('modalAllowPermission.descriptionPromo', {
                appName: config.appName,
              })}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={styles.text}>
              {t('modalAllowPermission.descriptionAllowing')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={[styles.text, styles.or]}>
              {t('modalAllowPermission.or')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={styles.text}>
              {t('modalAllowPermission.descriptionStep1')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={styles.text}>
              {t('modalAllowPermission.descriptionStep2', {
                appName: config.appName,
              })}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_LARGE}
              style={styles.text}>
              {t('modalAllowPermission.descriptionStep3')}
            </Typography>
            <AppFilledButton
              titleStyle={[
                this.theme.typography[TypographyType.LABEL_SEMI_LARGE],
                {color: this.theme.color.onPrimary},
              ]}
              primary
              secondary={false}
              style={styles.allowBtn}
              onPress={this.props.onAllowAccessContacts}>
              {t('modalAllowPermission.allowAccessContacts')}
            </AppFilledButton>

            <ImageButton
              onPress={this.props.onClose}
              style={styles.closeBtn}
              source={closeImage}
              imageStyle={styles.closeImg}
            />
          </Card>
        </Container>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    marginHorizontal: 16,
    position: 'relative',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontWeight: '400',
    marginTop: 6,
  },
  or: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  allowBtn: {
    paddingVertical: 14,
    marginTop: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  closeImg: {
    width: 14,
    height: 14,
  },
});

export default withTranslation('phoneCardContact')(ModalAllowPermisson);
