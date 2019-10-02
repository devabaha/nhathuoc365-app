import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import iconNotication from '../../../../images/notication.png';
import Button from 'react-native-button';

function Header(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.haloNameWrapper}>
        <Text style={styles.haloName}>Xin chào</Text>
        <Text style={[styles.haloName, styles.haloNameBold]}>
          {props.name ? `, ${props.name}` : ''}
        </Text>
      </Text>

      <View style={styles.homeBoxWalletInfoLabelRight}>
        <Button onPress={props.onPressButtonChat}>
          <Image style={styles.iconNotication} source={iconNotication} />
        </Button>
      </View>
    </View>
  );
}

Header.propTypes = {
  name: PropTypes.string
};

Header.defaultProps = {
  name: ''
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 25,
    flexDirection: 'row'
  },
  homeBoxWalletInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  homeBoxWalletInfoLabelRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  iconNotication: {
    width: 22,
    height: 22,
    resizeMode: 'cover'
  },
  haloNameWrapper: {
    marginTop: 16
  },
  haloName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FAFAFA'
  },
  haloNameBold: {
    fontWeight: 'bold'
  }
});

export default Header;
