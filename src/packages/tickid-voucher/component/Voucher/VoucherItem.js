import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import appConfig from 'app-config';

function VoucherItem(props) {
  const point = Number(props.point);
  return (
    <Button onPress={props.onPress} containerStyle={styles.containerBtn}>
      <View
        style={[
          styles.container,
          {
            marginBottom: props.last ? 16 : 0
          }
        ]}
      >
        <Image source={{ uri: props.image }} style={styles.thumbnail} />
        <View style={styles.infoWrapper}>
          <Text style={styles.title}>{props.title}</Text>

          {!!props.point && props.point !== '0' && (
            <Text style={styles.pointWrapper}>
              <Text style={styles.point}>
                {numberFormat(point)}
              </Text>
              {` ${props.pointCurrency}`}
            </Text>
          )}
        </View>
        <Image source={{ uri: props.logoImage }} style={styles.avatar} />

        {!!props.discount && (
          <View style={styles.discountWrapper}>
            <Text style={styles.discount}>{props.discount}</Text>
          </View>
        )}
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  containerBtn: {
    marginTop: 16
  },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },
  infoWrapper: {
    padding: 16
  },
  title: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginTop: 4
  },
  avatar: {
    position: 'absolute',
    top: 148,
    left: 16,
    width: 46,
    height: 46,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  discountWrapper: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: -60,
    left: -20,
    backgroundColor: '#7fc845',
    width: 120,
    height: 120,
    borderRadius: 60
  },
  discount: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20
  },
  pointWrapper: {
    marginTop: 5
  },
  point: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00b140'
  }
});

const defaultListener = () => {};

VoucherItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  discount: PropTypes.string,
  logoImage: PropTypes.string,
  last: PropTypes.bool,
  onPress: PropTypes.func
};

VoucherItem.defaultProps = {
  image: '',
  title: '',
  discount: '',
  logoImage: '',
  last: false,
  onPress: defaultListener
};

export default VoucherItem;
