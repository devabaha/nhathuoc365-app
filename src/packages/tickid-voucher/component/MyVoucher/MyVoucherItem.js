import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import Button from 'react-native-button';
import config from '../../config';

function renderDotsLeft() {
  const output = [];
  for (let i = 0; i < 8; i++) {
    output.push(<View key={i} style={styles.dotLeft} />);
  }
  return <View style={styles.dotLeftWrapper}>{output}</View>;
}

function MyVoucherItem(props) {
  return (
    <Button onPress={props.onPress} containerStyle={styles.btnWrapper}>
      <View style={[styles.dotLarge, styles.dotTop]} />
      <View style={[styles.dotLarge, styles.dotBottom]} />

      <View style={[styles.container, { marginBottom: props.last ? 16 : 0 }]}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={{ uri: props.avatar }} />
          {renderDotsLeft()}
        </View>

        <View style={styles.infoWrapper}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.remaining}>
            Còn <Text style={styles.remainingCount}>{props.remaining}</Text>{' '}
            ngày
          </Text>
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    position: 'relative'
  },
  dotLarge: {
    position: 'absolute',
    width: 14,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    left: 98,
    zIndex: 1
  },
  dotTop: {
    top: 12
  },
  dotBottom: {
    bottom: -4
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    position: 'relative',
    height: 106,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5
      },
      android: {
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E1E1E1'
      }
    })
  },
  avatarWrapper: {
    flexDirection: 'row',
    width: 74,
    justifyContent: 'center',
    position: 'relative',
    paddingRight: 16
  },
  avatar: {
    width: 48,
    resizeMode: 'contain'
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: config.colors.black
  },
  remaining: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666',
    marginTop: 8
  },
  remainingCount: {
    color: 'orange',
    fontWeight: '500'
  },
  dotLeftWrapper: {
    position: 'absolute',
    right: 0,
    top: 18,
    bottom: 18,
    width: 2,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  dotLeft: {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#d6d6d6'
  }
});

const defaultListener = () => {};

MyVoucherItem.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string,
  remaining: PropTypes.string,
  last: PropTypes.bool,
  onPress: PropTypes.func
};

MyVoucherItem.defaultProps = {
  avatar: '',
  title: '',
  remaining: '',
  last: false,
  onPress: defaultListener
};

export default MyVoucherItem;
