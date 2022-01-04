import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import Communications from 'react-native-communications';
// helpers
import {openMap} from 'app-helper/map';
// constants
import {
  TypographyType,
  BundleIconSetName,
  AppOutlinedButton,
} from 'src/components/base';
// images
import SVGMap from 'src/images/map.svg';
// custom components
import SectionContainer from '../SectionContainer';
import Image from 'src/components/Image';
import {
  Typography,
  Container,
  AppFilledButton,
  Icon,
} from 'src/components/base';

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
  description: {
    marginTop: 5,
    flex: 1,
  },

  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  callContainer: {
    // width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  mapContainer: {
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    padding: 5,
    paddingHorizontal: 10,
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

  const renderTelIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.IONICONS}
        style={titleStyle}
        name="ios-call"
      />
    );
  };

  return (
    <SectionContainer
      marginTop
      style={[!!title && styles.container]}
      actionBtnTitle={!!onPressActionBtn && t('confirm.change')}
      title={title || t('confirm.store.title')}
      iconStyle={styles.iconHeading}
      iconName="warehouse"
      onPressActionBtn={onPressActionBtn}>
      <Container noBackground row style={styles.contentContainer}>
        {customContent || (
          <>
            <View style={styles.imageContainer}>
              <Image source={{uri: image}} />
            </View>

            <Container noBackground flex style={styles.mainContentContainer}>
              <Typography numberOfLines={2} type={TypographyType.LABEL_LARGE}>
                {name}
              </Typography>
              <Typography
                numberOfLines={2}
                style={styles.description}
                type={TypographyType.LABEL_SMALL}>
                {address}
              </Typography>
            </Container>

            <Container noBackground style={styles.rightContainer}>
              {!!tel && (
                <AppFilledButton
                  primary
                  hitSlop={HIT_SLOP}
                  style={styles.callContainer}
                  onPress={handleCall}
                  renderTitleComponent={renderTelIcon}
                />
              )}
              {!!showMapBtn && (
                <AppOutlinedButton
                  primary
                  hitSlop={HIT_SLOP}
                  style={styles.mapContainer}
                  onPress={goToMapView}>
                  <SVGMap width={20} height={20} />
                </AppOutlinedButton>
              )}
            </Container>
          </>
        )}
      </Container>
    </SectionContainer>
  );
};

export default React.memo(StoreInfoSection);
