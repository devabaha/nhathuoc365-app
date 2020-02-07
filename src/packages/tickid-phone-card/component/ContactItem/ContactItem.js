import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import { Image, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const defaultListener = () => {};

class ContactItem extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    hasThumbnail: PropTypes.bool,
    thumbnailPath: PropTypes.string,
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    displayPhone: PropTypes.string,
    notInContact: PropTypes.bool
  };

  static defaultProps = {
    onPress: defaultListener,
    hasThumbnail: false,
    thumbnailPath: '',
    familyName: '',
    givenName: '',
    displayPhone: '',
    notInContact: false
  };

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

  getAvatarFromName = name => {
    const names = name.split(' ').map(name => name.charAt(0).toUpperCase());
    if (names.length >= 3) {
      names.length = 3;
    }
    return names.join('');
  };

  render() {
    const {
      onPress,
      hasThumbnail,
      thumbnailPath,
      familyName,
      givenName,
      displayPhone,
      notInContact
    } = this.props;
    const name = `${familyName ? `${familyName} ` : ''}${givenName}`;
    return (
      <Button onPress={onPress}>
        <View style={styles.wrapper}>
          {hasThumbnail ? (
            <Image style={styles.thumbnail} source={{ uri: thumbnailPath }} />
          ) : (
            <View style={styles.thumbnail}>
              {notInContact ? (
                <Icon
                  name="user"
                  color="#a5a5a5"
                  size={40}
                  style={styles.userIcon}
                />
              ) : (
                <Text style={{ color: config.colors.primary }}>
                  {this.getAvatarFromName(name)}
                </Text>
              )}
            </View>
          )}
          <View style={styles.infoWrapper}>
            <Text style={styles.name}>
              {notInContact ? displayPhone : name}
            </Text>
            <Text style={styles.phone}>
              {notInContact ? name : displayPhone}
            </Text>
          </View>

          {notInContact && <Text style={styles.select}>Chọn</Text>}

          <View style={styles.separate} />
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  separate: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 1,
    left: 78,
    backgroundColor: '#ebebeb'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  userIcon: {
    position: 'absolute',
    bottom: -5
  },
  infoWrapper: {
    marginLeft: 10,
    flex: 1
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333'
  },
  phone: {
    fontSize: 15,
    color: '#666'
  },
  select: {
    color: config.colors.primary,
    fontSize: 18,
    paddingRight: 15
  }
});

export default ContactItem;
