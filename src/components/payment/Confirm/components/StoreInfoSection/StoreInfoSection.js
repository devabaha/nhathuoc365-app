import React, {useCallback} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Communications from 'react-native-communications';

import {Container} from '../../../../Layout';
import SectionContainer from '../SectionContainer';
import Image from '../../../../Image';

import SVGMap from '../../../../../images/map.svg';

import appConfig from 'app-config';
import {openMap} from 'app-helper/map';

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  contentContainer: {
    marginTop: 12,
  },
  iconHeading: {
    fontSize: 12,
  },

  imageContainer: {
    width: 65,
    height: 65,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  mainContentContainer: {
    justifyContent: 'space-between',
  },
  title: {
    ...appConfig.styles.typography.heading3,
  },
  description: {
    ...appConfig.styles.typography.sub,
    marginTop: 5,
    flex: 1,
  },

  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  callContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: appConfig.colors.primary,
  },
  mapContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appConfig.colors.primary,
  },
  icon: {
    color: '#fff',
  },
  btnTitle: {
    color: '#fff',
  },
});

const StoreInfoSection = ({
  title,
  image,
  name,
  address,
  tel,
  destinationLatitude,
  destinationLongitude,
  originLatitude,
  originLongitude,
  isReverseDirection,
  showMapBtn = true,
  onPressActionBtn,
  customContent,
}) => {
  const {t} = useTranslation('orders');

  const handleCall = useCallback(() => {
    Communications.phonecall(tel, true);
  }, [tel]);

  const goToMapView = useCallback(() => {
    if (isReverseDirection) {
      openMap(
        destinationLatitude,
        destinationLongitude,
        originLatitude,
        originLongitude,
      );
    } else {
      openMap(
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
      );
    }
  }, [
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  return (
    <SectionContainer
      marginTop
      style={[!!title && styles.container]}
      actionBtnTitle={!!onPressActionBtn && t('confirm.change')}
      title={title || t('confirm.store.title')}
      iconStyle={styles.iconHeading}
      iconName="warehouse"
      onPressActionBtn={onPressActionBtn}>
      <Container row style={styles.contentContainer}>
        {customContent || (
          <>
            <View style={styles.imageContainer}>
              <Image source={{uri: image}} />
            </View>

            <Container
              flex
              centerVertical={false}
              style={styles.mainContentContainer}>
              <Text numberOfLines={2} style={styles.title}>
                {name}
              </Text>
              <Text numberOfLines={2} style={styles.description}>
                {address}
              </Text>
            </Container>

            <Container style={styles.rightContainer}>
              {!!tel && (
                <TouchableOpacity
                  hitSlop={HIT_SLOP}
                  style={styles.callContainer}
                  onPress={handleCall}>
                  <Container row>
                    <Ionicons name="ios-call" style={styles.icon} />
                  </Container>
                </TouchableOpacity>
              )}
              {!!showMapBtn && (
                <TouchableOpacity
                  hitSlop={HIT_SLOP}
                  style={styles.mapContainer}
                  onPress={goToMapView}>
                  <Container row>
                    <SVGMap width={20} height={20} />
                  </Container>
                </TouchableOpacity>
              )}
            </Container>
          </>
        )}
      </Container>
    </SectionContainer>
  );
};

export default React.memo(StoreInfoSection);
