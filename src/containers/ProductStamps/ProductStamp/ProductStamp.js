import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import Container from '../../../components/Layout/Container';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 5,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 4,
    backgroundColor: '#fafafa',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  label: {
    justifyContent: 'center',
    color: '#666',
    fontSize: 12,
  },
  valueContainer: {
    marginLeft: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderColor: appConfig.colors.primary,
    borderRadius: 4,
    borderWidth: 1,
  },
  value: {
    color: appConfig.colors.primary,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    borderTopWidth: 0.5,
    borderColor: '#eee',
    width: '100%',
  },
  timeContainer: {
    justifyContent: 'flex-end',
  },
  timeValueContainer: {
    borderLeftWidth: 0.5,
    borderColor: '#eee',
    paddingHorizontal: 7,
    marginLeft: 7,
  },
  timeValue: {
    color: '#333',
    fontSize: 12
  },

  decor: {
    position: 'absolute',
    borderColor: appConfig.colors.sceneBackground,
    borderLeftWidth: 7,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 7,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    // top: '50%',
    right: 0,
    // bottom: 0,
  },
});

const ProductStamp = ({image, name, qrcode, activeTime, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={.8} onPress={onPress}>
      <View style={styles.container}>
        <Container padding={15} row centerVertical={false}>
          <FastImage style={styles.image} source={{uri: image}} />
          <View style={styles.infoContainer}>
            <Text numberOfLines={2}>{name}</Text>
            <Container row>
              <Text style={styles.label}>Mã QR</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{qrcode}</Text>
              </View>
            </Container>
          </View>
        </Container>
        <View style={styles.footer}>
          <Container row style={styles.timeContainer}>
            <Text style={styles.label}>Ngày nhận</Text>
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>{activeTime}</Text>
            </View>
          </Container>
        </View>
        <View style={styles.decor} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductStamp;
