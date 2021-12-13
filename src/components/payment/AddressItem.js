import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {
  BundleIconSetName,
  TextButton,
  TypographyType,
} from 'src/components/base';
// custom components
import Image from 'src/components/Image';
import {
  Card,
  Container,
  Typography,
  Icon,
  BaseButton,
} from 'src/components/base';

const styles = StyleSheet.create({
  address_box: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    minHeight: 120,
  },
  uncheckOverlay: {},

  imageContainer: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: 65,
    height: 65,
  },

  address_name_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address_content: {
    marginTop: 10,
    flex: 1,
  },
  address_name: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  address_edit_btn: {
    fontSize: 16,
  },
  address_edit_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 2,
  },
  address_edit_label: {
    marginHorizontal: 5,
  },
  address_content_phone: {
    color: '#333',
  },
  address_content_address_detail: {
    marginTop: 5,
  },
  address_content_map_address: {
    fontSize: 12,
    marginTop: 4,
  },
  address_selected_box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  comboAddress: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    letterSpacing: 0.2,
    marginTop: 10,
    fontWeight: '400',
  },

  distanceContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
  },
  distanceIcon: {
    fontSize: 11,
  },
  distanceTxt: {
    marginLeft: 8,
  },
});

function AddressItem({
  image = '',
  address = null,
  selectable = true,
  editable = false,
  selected = false,
  gpsDistance,
  onLayout,
  onSelectAddress = () => {},
  onEditPress = () => {},
}) {
  if (!address) return null;

  const {theme} = useTheme();

  const {t} = useTranslation('address', 'common');

  const comboAddress =
    (address.province_name || '') +
    (address.district_name ? ' • ' + address.district_name : '') +
    (address.ward_name ? ' • ' + address.ward_name : '');

  const renderEditIcon = useCallback((titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="pencil-square-o"
        style={[styles.address_edit_label, titleStyle]}
      />
    );
  }, []);

  const addressContainerStyle = useMemo(() => {
    return mergeStyles(
      styles.address_box,
      !selected && selectable && {backgroundColor: theme.color.underlay},
    );
  }, [theme, selected, selectable]);

  const addressIconMarkStyle = useMemo(() => {
    return mergeStyles(styles.address_edit_btn, {
      color: theme.color.primaryHighlight,
    });
  }, [theme]);

  const distanceContainerStyle = useMemo(() => {
    return mergeStyles(styles.distanceContainer, {
      backgroundColor: theme.color.primary5,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const distanceMainStyle = useMemo(() => {
    return {
      color: theme.color.primary,
    };
  }, [theme]);

  const distanceIconStyle = useMemo(() => {
    return mergeStyles(styles.distanceIcon, distanceMainStyle);
  }, [theme, distanceMainStyle]);

  const distanceTextStyle = useMemo(() => {
    return mergeStyles(styles.distanceTxt, distanceMainStyle);
  }, [theme, distanceMainStyle]);

  const addressSelectorStyle = useMemo(() => {
    return {
      fontSize: 24,
      color: theme.color.primaryHighlight,
    };
  }, [theme]);

  const comboAddressStyle = useMemo(() => {
    return mergeStyles(styles.comboAddress, {
      backgroundColor: theme.color.contentBackgroundWeak,
    });
  }, [theme]);

  const editTypoProps = useMemo(() => {
    return {
      type: TypographyType.DESCRIPTION_SMALL,
    };
  }, []);

  return (
    <BaseButton
      onLayout={onLayout}
      disabled={!selectable}
      onPress={onSelectAddress}
      style={{marginTop: 2}}>
      <Container style={addressContainerStyle}>
        <Container noBackground row>
          {!!image && (
            <Card noBackground style={styles.imageContainer}>
              <Image source={{uri: image}} style={styles.image} />
            </Card>
          )}

          <Container noBackground flex>
            <View style={styles.address_name_box}>
              <Typography
                type={TypographyType.TITLE_MEDIUM}
                numberOfLines={2}
                style={styles.address_name}>
                {address.name}
                {'  '}
                {address.default_flag == 1 && (
                  <Icon
                    bundle={BundleIconSetName.FONT_AWESOME}
                    name="map-marker"
                    style={addressIconMarkStyle}
                  />
                )}
              </Typography>
              {!!editable ? (
                <TextButton
                  onPress={onEditPress}
                  typoProps={editTypoProps}
                  style={styles.address_edit_box}
                  renderIconLeft={renderEditIcon}>
                  {t('address.edit')}
                </TextButton>
              ) : (
                !!gpsDistance && (
                  <Container row style={distanceContainerStyle}>
                    <Icon
                      bundle={BundleIconSetName.IONICONS}
                      name="ios-navigate"
                      style={distanceIconStyle}
                    />
                    <Typography
                      type={TypographyType.LABEL_EXTRA_SMALL_PRIMARY}
                      style={distanceTextStyle}>
                      {gpsDistance}
                    </Typography>
                  </Container>
                )
              )}
            </View>

            <View style={styles.address_name_box}>
              <View style={styles.address_content}>
                <Typography type={TypographyType.LABEL_MEDIUM}>
                  {address.tel}
                </Typography>

                <Typography
                  type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
                  style={styles.address_content_address_detail}>
                  {address.address}
                </Typography>
                {!!address.map_address && (
                  <Typography
                    type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}>
                    {address.map_address}
                  </Typography>
                )}
              </View>

              {selectable && (
                <View
                  style={[
                    styles.address_selected_box,
                    {opacity: selected ? 1 : 0},
                  ]}>
                  <Icon
                    bundle={BundleIconSetName.IONICONS}
                    name="ios-checkmark-sharp"
                    style={addressSelectorStyle}
                  />
                </View>
              )}
            </View>
          </Container>
        </Container>

        {!!comboAddress && (
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={comboAddressStyle}>
            {comboAddress}
          </Typography>
        )}
      </Container>
    </BaseButton>
  );
}

export default React.memo(AddressItem);
