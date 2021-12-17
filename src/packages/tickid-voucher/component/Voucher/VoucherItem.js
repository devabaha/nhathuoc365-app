import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {Card, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Typography} from 'src/components/base';
import Image from 'src/components/Image';

function VoucherItem(props) {
  const {theme} = useTheme();

  const getPoint = () => {
    const point = Number(props.point);
    return !isNaN(point) ? numberFormat(point) : props.point;
  };

  const avatarStyle = useMemo(() => {
    return mergeStyles(styles.avatar, {
      borderRadius: theme.layout.borderRadiusSmall,
      borderWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const discountWrapperStyle = useMemo(() => {
    return mergeStyles(styles.discountWrapper, {
      backgroundColor: theme.color.accent1,
    });
  }, [theme]);

  const discountStyle = useMemo(() => {
    return mergeStyles(styles.discount, {
      color: theme.color.white,
    });
  }, [theme]);

  const pointStyle = useMemo(() => {
    return mergeStyles(styles.point, {
      color: theme.color.accent1,
    });
  }, [theme]);

  return (
    <BaseButton onPress={props.onPress} style={styles.containerBtn}>
      <Card
        style={[
          styles.container,
          {
            marginBottom: props.last ? 16 : 0,
          },
        ]}>
        <Image
          source={{
            uri: props.image,
          }}
          style={styles.thumbnail}
        />
        <View style={styles.infoWrapper}>
          <Typography
            type={TypographyType.LABEL_SEMI_LARGE}
            style={styles.title}>
            {props.title}
          </Typography>

          {!!props.point && props.point !== '0' && (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.pointWrapper}>
              <Typography type={TypographyType.LABEL_LARGE} style={pointStyle}>
                {getPoint()}
              </Typography>
              {` ${props.pointCurrency}`}
            </Typography>
          )}
        </View>
        <Image source={{uri: props.logoImage}} style={avatarStyle} />

        {!!props.discount && (
          <View style={discountWrapperStyle}>
            <Typography type={TypographyType.TITLE_LARGE} style={discountStyle}>
              {props.discount}
            </Typography>
          </View>
        )}
      </Card>
    </BaseButton>
  );
}

const styles = StyleSheet.create({
  containerBtn: {
    marginTop: 16,
  },
  container: {
    marginHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoWrapper: {
    padding: 16,
  },
  title: {
    fontWeight: '500',
    marginTop: 4,
  },
  avatar: {
    position: 'absolute',
    top: 148,
    left: 16,
    width: 46,
    height: 46,
  },
  discountWrapper: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: -60,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  discount: {
    fontWeight: '600',
    marginBottom: 20,
  },
  pointWrapper: {
    marginTop: 5,
  },
  point: {
    fontWeight: '600',
  },
});

const defaultListener = () => {};

VoucherItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  discount: PropTypes.string,
  logoImage: PropTypes.string,
  last: PropTypes.bool,
  onPress: PropTypes.func,
};

VoucherItem.defaultProps = {
  image: '',
  title: '',
  discount: '',
  logoImage: '',
  last: false,
  onPress: defaultListener,
};

export default VoucherItem;
