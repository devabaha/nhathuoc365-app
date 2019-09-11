import React from 'react';
import PropTypes from 'prop-types';
import { stringHelper } from 'app-util';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image
} from 'react-native';

function VoucherItem(props) {
  return (
    <TouchableHighlight underlayColor="transparent" onPress={props.onPress}>
      <View
        style={[
          styles.container,
          {
            marginRight: props.last ? 16 : 0
          }
        ]}
      >
        <Image style={styles.image} source={{ uri: props.imageUrl }} />
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {stringHelper.shorten(props.title, 48)}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 205,
    marginLeft: 16
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 116,
    borderRadius: 8
  },
  titleWrapper: {
    marginTop: 6
  },
  title: {
    fontSize: 14,
    fontWeight: '500'
  }
});

VoucherItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  last: PropTypes.bool
};

VoucherItem.defaultProps = {
  title: '',
  imageUrl: '',
  last: false
};

export default VoucherItem;
