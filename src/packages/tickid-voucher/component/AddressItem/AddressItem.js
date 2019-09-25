import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import { isLongLat } from '../../helper/validator';

function AddressItem(props) {
  const logLatIsValid = isLongLat(props.longitude) && isLongLat(props.latitude);
  return (
    <Fragment>
      <View style={styles.locationWrapper}>
        <Icon name="map-marker-alt" size={22} color="#c00000" />
        <Text style={styles.address}>{props.title}</Text>
      </View>

      <Text style={styles.addressText}>{props.address}</Text>

      <View style={styles.addressActionWrapper}>
        <Button
          containerStyle={styles.addressActionBtn}
          onPress={props.onPressPhoneNumber}
        >
          <Icon name="phone" size={20} color="#0084ff" />
          <Text style={styles.addessActionText}>{props.phoneNumber}</Text>
        </Button>
        {logLatIsValid && (
          <Button
            containerStyle={styles.addressActionBtn}
            onPress={props.onPressLocation}
          >
            <Icon name="location-arrow" size={20} color="#0084ff" />
            <Text style={styles.addessActionText}>Dẫn đường</Text>
          </Button>
        )}
      </View>
    </Fragment>
  );
}

const defaultListener = () => {};

AddressItem.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  phoneNumber: PropTypes.string,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPressPhoneNumber: PropTypes.func,
  onPressLocation: PropTypes.func
};

AddressItem.defaultProps = {
  title: '',
  address: '',
  phoneNumber: '',
  latitude: undefined,
  longitude: undefined,
  onPressPhoneNumber: defaultListener,
  onPressLocation: defaultListener
};

const styles = StyleSheet.create({
  locationWrapper: {
    flexDirection: 'row',
    marginTop: 16
  },
  address: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  addressText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 22,
    marginTop: 8
  },
  addressActionWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingBottom: 8
  },
  addressActionBtn: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 24
  },
  addessActionText: {
    fontSize: 14,
    color: '#0084ff',
    marginLeft: 8,
    fontWeight: '500'
  }
});

export default AddressItem;
