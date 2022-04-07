import React, {Fragment, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {isLatitude, isLongitude} from '../../helper/validator';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {TextButton, Typography, Icon} from 'src/components/base';

function AddressItem(props) {
  const {t} = useTranslation();

  const {theme} = useTheme();

  const logLatIsValid =
    isLongitude(props.longitude) && isLatitude(props.latitude);

  const renderPhoneIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME_5}
        style={[titleStyle, styles.callIcon]}
        name="phone"
      />
    );
  };

  const renderLocationIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME_5}
        style={[titleStyle, styles.callIcon]}
        name="location-arrow"
      />
    );
  };

  const renderMapPinIcon = (titleStyle) => {
    return (
      <Icon
        style={[titleStyle, iconMapPinStyle]}
        bundle={BundleIconSetName.FONT_AWESOME_5}
        name="map-marker-alt"
      />
    );
  };

  const iconMapPinStyle = useMemo(() => {
    return mergeStyles(styles.iconMapPin, {color: theme.color.danger});
  }, [theme]);

  const addressActionWrapperStyle = useMemo(() => {
    return mergeStyles(
      styles.addressActionWrapper,
      !props.isLast && {
        borderColor: theme.color.border,
        borderBottomWidth: theme.layout.borderWidth,
      },
    );
  }, [theme, props.isLast]);

  const addressActionTextStyle = useMemo(() => {
    return mergeStyles(styles.addressActionText, {color: theme.color.accent2});
  }, [theme]);

  return (
    <Fragment>
      <View style={styles.locationWrapper}>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={styles.address}
          renderIconBefore={renderMapPinIcon}>
          {props.title}
        </Typography>
      </View>

      <Typography
        type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
        style={styles.addressText}>
        {props.address}
      </Typography>

      <View style={addressActionWrapperStyle}>
        <TextButton
          style={styles.addressActionBtn}
          titleStyle={addressActionTextStyle}
          renderIconLeft={renderPhoneIcon}
          onPress={props.onPressPhoneNumber}>
          {props.phoneNumber}
        </TextButton>

        {logLatIsValid && (
          <TextButton
            style={styles.addressActionBtn}
            titleStyle={addressActionTextStyle}
            renderIconLeft={renderLocationIcon}
            onPress={props.onPressLocation}>
            {t('voucher:detail.map')}
          </TextButton>
        )}
      </View>
    </Fragment>
  );
}

const defaultListener = () => {};

AddressItem.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  phoneNumber: PropTypes.string,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPressPhoneNumber: PropTypes.func,
  onPressLocation: PropTypes.func,
};

AddressItem.defaultProps = {
  title: '',
  address: '',
  phoneNumber: '',
  latitude: undefined,
  longitude: undefined,
  onPressPhoneNumber: defaultListener,
  onPressLocation: defaultListener,
};

const styles = StyleSheet.create({
  locationWrapper: {
    flexDirection: 'row',
    marginTop: 15,
  },
  address: {
    marginLeft: 8,
    fontWeight: '500',
  },
  addressText: {
    marginLeft: 22,
    marginTop: 8,
  },
  addressActionWrapper: {
    flexDirection: 'row',
    marginTop: 12,
    paddingBottom: 15,
  },
  addressActionBtn: {
    flex: 1,
    alignItems: 'center',
  },
  addressActionText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  callIcon: {
    fontSize: 14,
  },
  iconMapPin: {
    fontSize: 18,
    marginLeft: 0,
  },
  containerTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default withTranslation('voucher')(AddressItem);
