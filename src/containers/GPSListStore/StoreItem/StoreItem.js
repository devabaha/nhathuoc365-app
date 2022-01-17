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
import {
  Typography,
  Icon,
  Container,
  AppFilledButton,
} from 'src/components/base';

const styles = StyleSheet.create({
  image: {
    width: 75,
    height: 75,
  },
  storeContainer: {
    padding: 15,
  },
  infoWrapper: {
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
  },
  infoContentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
  },
  description: {
    marginTop: 3,
  },
  rightIconContainer: {
    justifyContent: 'center',
    paddingLeft: 5,
  },
  rightIcon: {
    fontSize: 20,
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
  actionBtnIconName,
  onPressActionBtn,
  pressable,

  rightIcon,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  if (!actionBtnIconName) {
    actionBtnIconName = 'ios-map-sharp';
  }
  if (!actionBtnTitle) {
    actionBtnTitle = t('map');
  }

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
    return mergeStyles(styles.openMapBtn);
  }, []);

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
          backgroundColor: theme.color.persistPrimary5,
          borderRadius: theme.layout.borderRadiusHuge,
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

      <Container noBackground flex style={styles.infoWrapper}>
        <Container noBackground style={styles.infoContainer}>
          <View style={styles.infoContentContainer}>
            <Typography type={TypographyType.LABEL_LARGE} style={styles.title}>
              {name}
            </Typography>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.description}>
              {address}
            </Typography>
          </View>

          {!!pressable && (
            <View style={styles.rightIconContainer}>
              {rightIcon || (
                <Icon
                  bundle={BundleIconSetName.IONICONS}
                  style={styles.rightIcon}
                  name="ios-chevron-forward-sharp"
                />
              )}
            </View>
          )}
        </Container>

        <Container flex row style={styles.mapInfoContainer}>
          {enableDistance ? (
            <Container row style={distanceContainerStyle}>
              <Typography
                type={TypographyType.LABEL_EXTRA_SMALL}
                style={distanceTextStyle}
                renderIconBefore={(titleStyle, fontStyle) => {
                  return !!requestLocationLoading ? (
                    <Loading
                      style={styles.distanceLoading}
                      wrapperStyle={styles.distanceLoadingContainer}
                      size="small"
                      color={fontStyle.color}
                    />
                  ) : (
                    <Icon
                      bundle={BundleIconSetName.IONICONS}
                      name="ios-navigate"
                      style={[fontStyle, styles.distanceIcon]}
                    />
                  );
                }}>
                {distance}
              </Typography>
            </Container>
          ) : (
            <View />
          )}

          <Container row noBackground>
            {!!phone && (
              <Container style={btnWrapperStyle}>
                <AppFilledButton
                  primary
                  onPress={() => openMap(lat, lng)}
                  style={styles.openMapBtn}
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
                </AppFilledButton>
              </Container>
            )}

            <Container style={btnWrapperStyle}>
              <AppFilledButton
                primary
                onPress={() =>
                  !!onPressActionBtn ? onPressActionBtn() : openMap(lat, lng)
                }
                style={styles.openMapBtn}
                typoProps={{type: TypographyType.LABEL_EXTRA_SMALL}}
                renderIconLeft={(titleStyle) => {
                  return (
                    <Icon
                      bundle={BundleIconSetName.IONICONS}
                      name={actionBtnIconName}
                      style={[titleStyle, styles.mapIcon]}
                    />
                  );
                }}>
                {actionBtnTitle}
              </AppFilledButton>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default React.memo(StoreItem);
