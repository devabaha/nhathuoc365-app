import React, {useMemo} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  Typography,
  TextButton,
  BaseButton,
} from 'src/components/base';

function MyVoucherItem(props) {
  const {t} = useTranslation();

  const {theme} = useTheme();

  const renderDotsLeft = () => {
    const output = [];

    for (let i = 0; i < 8; i++) {
      output.push(
        <View
          key={i}
          style={[
            styles.dotLeft,
            {
              backgroundColor: theme.color.background,
            },
          ]}
        />,
      );
    }
    return <View style={styles.dotLeftWrapper}>{output}</View>;
  };

  const quantityContainerStyle = useMemo(() => {
    return mergeStyles(styles.quantityContainer, {
      backgroundColor: theme.color.primaryHighlight,
      borderTopLeftRadius: theme.layout.borderRadiusMedium,
      borderBottomRightRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  const quantityStyle = useMemo(() => {
    return mergeStyles(styles.quantity, {
      color: theme.color.onPrimaryHighlight,
    });
  }, [theme]);

  const btnTypoProps = useMemo(() => {
    return {type: TypographyType.LABEL_SEMI_MEDIUM};
  }, []);

  const useNowTitleStyle = useMemo(() => {
    return mergeStyles(styles.useNowTitle, {
      color: theme.color.primaryHighlight,
    });
  }, [theme]);

  const dotStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.background,
      borderRadius: theme.layout.borderRadiusMedium,
    };
  }, [theme]);

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  return (
    <BaseButton
      onPress={props.onPress}
      containerStyle={[styles.btnWrapper, {marginBottom: props.last ? 16 : 0}]}>
      <View style={[styles.dotLarge, styles.dotTop, dotStyle]} />
      <View style={[styles.dotLarge, styles.dotBottom, dotStyle]} />

      <Container style={containerStyle}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={{uri: props.avatar}} />
          {renderDotsLeft()}
        </View>

        <View style={styles.infoWrapper}>
          <Typography
            type={TypographyType.LABEL_SEMI_LARGE}
            style={styles.title}>
            {props.title}
          </Typography>
          <View style={styles.additionalInfo}>
            {!!props.remaining && (
              <Typography type={TypographyType.DESCRIPTION_SEMI_MEDIUM}>
                {props.remaining}
              </Typography>
            )}
            {props.isUseOnlineMode && (
              <TextButton
                typoProps={btnTypoProps}
                onPress={props.onPressUseOnline}
                titleStyle={useNowTitleStyle}>
                {t('voucher:detail.useNow')}
              </TextButton>
            )}
          </View>
        </View>

        <View style={quantityContainerStyle}>
          <Typography
            type={TypographyType.LABEL_EXTRA_SMALL}
            style={quantityStyle}>
            x{props.quantity}
          </Typography>
        </View>
      </Container>
    </BaseButton>
  );
}

const styles = StyleSheet.create({
  btnWrapper: {
    position: 'relative',
  },
  dotLarge: {
    position: 'absolute',
    width: 14,
    height: 16,
    left: 98,
    zIndex: 1,
  },
  dotTop: {
    top: 12,
  },
  dotBottom: {
    bottom: -4,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    marginTop: 16,
    position: 'relative',
    height: 106,
    flexDirection: 'row',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatarWrapper: {
    flexDirection: 'row',
    width: 74,
    justifyContent: 'center',
    position: 'relative',
    paddingRight: 16,
  },
  avatar: {
    width: 48,
    resizeMode: 'contain',
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  additionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
  },
  remaining: {
    fontWeight: '400',
  },
  useNowTitle: {
    fontWeight: '600',
    paddingVertical: 8,
  },
  quantityContainer: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 2,
    right: 2,
    bottom: 2,
  },
  quantity: {
    fontWeight: '500',
  },
  dotLeftWrapper: {
    position: 'absolute',
    right: 0,
    top: 18,
    bottom: 18,
    width: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dotLeft: {
    width: 2,
    height: 2,
    borderRadius: 2,
  },
});

const defaultListener = () => {};

MyVoucherItem.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string,
  remaining: PropTypes.string,
  last: PropTypes.bool,
  isUseOnlineMode: PropTypes.bool,
  onPress: PropTypes.func,
  onPressUseOnline: PropTypes.func,
};

MyVoucherItem.defaultProps = {
  avatar: '',
  title: '',
  remaining: '',
  last: false,
  isUseOnlineMode: false,
  onPress: defaultListener,
  onPressUseOnline: defaultListener,
};

export default withTranslation('voucher')(MyVoucherItem);
