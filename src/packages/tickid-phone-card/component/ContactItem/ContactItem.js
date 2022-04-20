import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Image from 'src/components/Image';
import {BaseButton, Typography, Icon, Container} from 'src/components/base';

const defaultListener = () => {};

class ContactItem extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onPress: PropTypes.func,
    hasThumbnail: PropTypes.bool,
    thumbnailPath: PropTypes.string,
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    displayPhone: PropTypes.string,
    notInContact: PropTypes.bool,
  };

  static defaultProps = {
    onPress: defaultListener,
    hasThumbnail: false,
    thumbnailPath: '',
    familyName: '',
    givenName: '',
    displayPhone: '',
    notInContact: false,
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.displayPhone !== this.props.displayPhone ||
      nextProps.hasThumbnail !== this.props.hasThumbnail ||
      nextProps.thumbnailPath !== this.props.thumbnailPath ||
      nextProps.familyName !== this.props.familyName ||
      nextProps.givenName !== this.props.givenName ||
      nextProps.notInContact !== this.props.notInContact
    );
  }

  getAvatarFromName = (name) => {
    const names = name.split(' ').map((name) => name.charAt(0).toUpperCase());
    if (names.length >= 3) {
      names.length = 3;
    }
    return names.join('');
  };

  get thumbnailStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  get userIconStyle() {
    return {
      color: this.theme.color.neutral,
    };
  }

  get separateStyle() {
    return {backgroundColor: this.theme.color.border};
  }

  render() {
    const {
      onPress,
      hasThumbnail,
      thumbnailPath,
      familyName,
      givenName,
      displayPhone,
      notInContact,
    } = this.props;
    const name = `${familyName ? `${familyName} ` : ''}${givenName}`;
    return (
      <BaseButton onPress={onPress}>
        <Container row style={styles.wrapper}>
          {hasThumbnail ? (
            <Image
              style={[this.thumbnailStyle, styles.thumbnail]}
              source={{uri: thumbnailPath}}
            />
          ) : (
            <View style={[this.thumbnailStyle, styles.thumbnail]}>
              {notInContact ? (
                <Icon
                  bundle={BundleIconSetName.ENTYPO}
                  name="user"
                  style={[styles.userIcon, this.userIconStyle]}
                />
              ) : (
                <Typography type={TypographyType.LABEL_MEDIUM_PRIMARY}>
                  {this.getAvatarFromName(name)}
                </Typography>
              )}
            </View>
          )}
          <View style={styles.infoWrapper}>
            <Typography type={TypographyType.LABEL_LARGE} style={styles.name}>
              {notInContact ? displayPhone : name}
            </Typography>
            <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
              {notInContact ? name : displayPhone}
            </Typography>
          </View>

          {notInContact && (
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={styles.select}>
              {this.props.t('choose')}
            </Typography>
          )}

          <View style={[styles.separate, this.separateStyle]} />
        </Container>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  separate: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 1,
    left: 78,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userIcon: {
    position: 'absolute',
    bottom: -5,
    fontSize: 40,
  },
  infoWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: '500',
  },
  select: {
    paddingRight: 15,
  },
});

export default withTranslation('common')(ContactItem);
