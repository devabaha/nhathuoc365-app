import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import Communications from 'react-native-communications';
// helpers
import {openMap} from 'src/helper/map';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import Image from 'src/components/Image';
import Loading from 'src/components/Loading';
import {Typography, Icon, Container, TextButton} from 'src/components/base';

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
  },
  storeContainer: {
    padding: 15,
  },
  infoContainer: {
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
  },
  description: {
    marginTop: 3,
  },
  mapInfoContainer: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  distanceContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  distanceLoadingContainer: {
    position: 'relative',
    top: undefined,
    left: undefined,
  },
  distanceLoading: {
    padding: 0,
    width: 18,
    height: 18,
  },
  distanceIcon: {
    fontSize: 11,
  },
  distanceTxt: {
    marginLeft: 7,
  },
  btnWrapper: {
    overflow: 'hidden',
    marginLeft: 10,
  },
  openMapBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  mapIcon: {
    marginRight: 7,
  },
  openMapTxt: {
    fontSize: 11,
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
  const {theme} = useTheme();

  const {t} = useTranslation();

  const handleCall = () => {
    if (phone && phone != '') {
      Communications.phonecall(phone, true);
    } else {
      Alert.alert(t('gpsStore:storeItem.cannotConnect'));
    }
  };

  const imageStyle = useMemo(() => {
    return mergeStyles(styles.image, {
      borderRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  const actionButtonStyle = useMemo(() => {
    return mergeStyles(styles.openMapBtn, {
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  const actionLabelStyle = useMemo(() => {
    return {
      color: theme.color.onPrimaryHighlight,
    };
  }, [theme]);

  const storeContainerStyle = useMemo(() => {
    return mergeStyles(styles.storeContainer, {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const btnWrapperStyle = useMemo(() => {
    return mergeStyles(styles.btnWrapper, {
      borderRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  const distanceContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.distanceContainer,
        {
          borderColor: theme.color.border,
          backgroundColor: theme.color.primary5,
          borderRadius: theme.layout.borderRadiusHuge,
        },
      ],
      disabledDistanceStyle,
    );
  }, [theme, disabledDistanceStyle]);

  const distanceIconStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.distanceIcon,
        {
          color: theme.color.primary,
        },
      ],
      disabledDistanceStyle,
    );
  }, [theme, disabledDistanceStyle]);

  const distanceTextStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.distanceTxt,
        {
          color: theme.color.primary,
        },
      ],
      disabledDistanceStyle,
    );
  }, [theme, disabledDistanceStyle]);

  return (
    <Container row style={storeContainerStyle}>
      <Image source={{uri: image}} style={imageStyle} />

      <Container flex centerVertical={false} style={styles.infoContainer}>
        <Container centerVertical={false}>
          <Typography type={TypographyType.LABEL_LARGE} style={styles.title}>
            {name}
          </Typography>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.description}>
            {address}
          </Typography>
        </Container>

        <Container flex row style={styles.mapInfoContainer}>
          {enableDistance ? (
            <Container
              row
              style={[distanceContainerStyle, disabledDistanceStyle]}>
              {requestLocationLoading ? (
                <Loading
                  style={styles.distanceLoading}
                  wrapperStyle={styles.distanceLoadingContainer}
                  size="small"
                />
              ) : (
                <Icon
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-navigate"
                  style={distanceIconStyle}
                />
              )}
              <Typography
                type={TypographyType.LABEL_EXTRA_SMALL}
                style={distanceTextStyle}>
                {distance}
              </Typography>
            </Container>
          ) : (
            <View />
          )}

          <Container row>
            {!!phone && (
              <Container style={btnWrapperStyle}>
                <TextButton
                  onPress={() => openMap(lat, lng)}
                  style={actionButtonStyle}
                  titleStyle={actionLabelStyle}
                  typoProps={{type: TypographyType.LABEL_EXTRA_SMALL}}
                  renderIconLeft={(titleStyle) => {
                    return (
                      <Icon
                        bundle={BundleIconSetName.IONICONS}
                        name="call"
                        style={[titleStyle, styles.mapIcon]}
                      />
                    );
                  }}>
                  {t('gpsStore:storeItem.call')}
                </TextButton>
              </Container>
            )}

            <Container style={btnWrapperStyle}>
              <TextButton
                onPress={() => openMap(lat, lng)}
                style={actionButtonStyle}
                titleStyle={actionLabelStyle}
                typoProps={{type: TypographyType.LABEL_EXTRA_SMALL}}
                renderIconLeft={(titleStyle) => {
                  return (
                    <Icon
                      bundle={BundleIconSetName.IONICONS}
                      name="ios-map-sharp"
                      style={[titleStyle, styles.mapIcon]}
                    />
                  );
                }}>
                {actionBtnTitle || t('map')}
              </TextButton>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default React.memo(StoreItem);
