import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import { View, Text, StyleSheet } from 'react-native';

function Header(props) {
  return (
    <View style={styles.header}>
      <Button
        onPress={props.onClose}
        containerStyle={styles.btnClose}
        style={styles.closeTitle}
      >
        {props.closeTitle}
      </Button>
      <Text style={styles.headerTitle}>{props.title}</Text>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  closeTitle: PropTypes.string,
  onClose: PropTypes.func
};

Header.defaultProps = {
  title: 'Chọn Tỉnh/Thành phố',
  closeTitle: 'Đóng',
  onClose: () => {}
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  headerTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600'
  },
  btnClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  closeTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600'
  }
});

export default Header;
