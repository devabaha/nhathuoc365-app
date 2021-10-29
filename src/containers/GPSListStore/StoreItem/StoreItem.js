import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from 'react-native-button';
import Communications from 'react-native-communications';
import Ionicons from 'react-native-vector-icons/Ionicons';

import appConfig from 'app-config';
import {openMap} from 'src/helper/map';

import Image from 'src/components/Image';
import {Container} from 'src/components/Layout';
import Loading from 'src/components/Loading';

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
  },
  storeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
  description: {
    color: '#666',
    marginTop: 3,
  },
  mapInfoContainer: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  distanceContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderColor: '#ccc',
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.05),
  },
  distanceLoadingContainer: {
    position: 'relative',
    top: undefined,
    left: undefined,
  },
  distanceLoading: {
    padding: 0,
    width: 11,
    height: 11,
  },
  distanceIcon: {
    fontSize: 11,
    color: appConfig.colors.primary,
  },
  distanceTxt: {
    marginLeft: 7,
    fontSize: 11,
    color: appConfig.colors.primary,
  },
  btnWrapper: {
    overflow: 'hidden',
    borderRadius: 15,
    marginLeft: 10,
  },
  openMapContainer: {
    backgroundColor: appConfig.colors.primary,
  },
  openMapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  mapIcon: {
    fontSize: 11,
    marginRight: 7,
    color: '#fff',
  },
  openMapTxt: {
    fontSize: 11,
    color: '#fff',
  },
});

const StoreItem = ({
  name,
  address,
  image,
  phone,
  lat,
  lng,
  actionBtnTitle,

  distance,
  enableDistance = false,
  requestLocationLoading,
  disabledDistanceStyle,
}) => {
  const handleCall = () => {
    if (phone && phone != '') {
      Communications.phonecall(phone, true);
    } else {
      Alert.alert('Không thể liên lạc');
    }
  };

  return (
    <Container row style={styles.storeContainer}>
      <Image source={{uri: image}} style={styles.image} />

      <Container flex centerVertical={false} style={styles.infoContainer}>
        <Container centerVertical={false}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{address}</Text>
        </Container>

        <Container flex row style={styles.mapInfoContainer}>
          {enableDistance ? (
            <Container
              row
              style={[styles.distanceContainer, disabledDistanceStyle]}>
              {requestLocationLoading ? (
                <Loading
                  style={styles.distanceLoading}
                  wrapperStyle={styles.distanceLoadingContainer}
                  size="small"
                />
              ) : (
                <Ionicons
                  name="ios-navigate"
                  style={[styles.distanceIcon, disabledDistanceStyle]}
                />
              )}
              <Text style={[styles.distanceTxt, disabledDistanceStyle]}>
                {distance}
              </Text>
            </Container>
          ) : (
            <View />
          )}

          <Container row>
            {!!phone && (
              <Container style={styles.btnWrapper}>
                <Button
                  containerStyle={styles.openMapContainer}
                  onPress={handleCall}>
                  <Container row style={styles.openMapBtn}>
                    <Ionicons name="call" style={styles.mapIcon} />
                    <Text style={styles.openMapTxt}>Gọi</Text>
                  </Container>
                </Button>
              </Container>
            )}

            <Container style={styles.btnWrapper}>
              <Button
                containerStyle={styles.openMapContainer}
                onPress={() => openMap(lat, lng)}>
                <Container row style={styles.openMapBtn}>
                  <Ionicons name="ios-map-sharp" style={styles.mapIcon} />
                  <Text style={styles.openMapTxt}>{actionBtnTitle}</Text>
                </Container>
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default React.memo(StoreItem);
