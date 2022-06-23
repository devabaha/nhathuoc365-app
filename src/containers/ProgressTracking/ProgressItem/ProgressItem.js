import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import moment from 'moment';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {formatUniversalDate} from 'app-helper/datetime';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography, Icon} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 5,
  },
  imageContainer: {
    width: 65,
    height: 65,
    marginRight: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '500',
    flex: 1,
  },
  subTitleContainer: {
    alignSelf: 'flex-start',
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  subTitle: {},
  statusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  status: {},

  footerContainer: {
    marginTop: 10,
  },
  description: {
    flex: 1,
  },
  icon: {
    paddingHorizontal: 5,
    marginLeft: 15,
  },

  expiredContainer: {},
  expired: {},

  warrantyDetailInfoValue: {
    marginTop: 5,
  },
});

const STATUS_TYPE = {
  EXPIRED: 0,
  AVAILABLE: 1,
};

const ProgressItem = ({
  title,
  code,
  startDate,
  endDate,
  image = '',
  warrantyDetailInfo,
  onPress,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('progressTracking');
  const getStatus = () => {
    let status = t('available');
    let type = STATUS_TYPE.AVAILABLE;

    const oneHourInMs = 60 * 60 * 1000;
    const oneDayInMs = 24 * oneHourInMs;
    const diff = moment(endDate).diff(moment());

    if (diff <= 0) {
      status = t('expired');
      type = STATUS_TYPE.EXPIRED;
    } else if (diff < oneDayInMs * 8) {
      const typeTime =
        diff >= oneDayInMs && diff < oneDayInMs * 8
          ? 'days'
          : diff >= oneHourInMs && diff < oneDayInMs
          ? 'hours'
          : 'minutes';

      const time = moment.duration(diff)[typeTime]() || 1;

      status = t('remainingTime.' + typeTime, {time});
    }

    return {status, type};
  };

  const {status, type: statusType} = getStatus();
  const isExpired = statusType === STATUS_TYPE.EXPIRED;

  const imageContainerStyle = useMemo(() => {
    return mergeStyles(styles.imageContainer, {
      borderRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  const subTitleColor = useMemo(() => {
    return theme.color.primaryHighlight;
  }, [theme]);

  const subTitleStyle = useMemo(() => {
    return mergeStyles(styles.subTitle, {color: subTitleColor});
  }, [theme, subTitleColor]);

  const subTitleContainerStyle = useMemo(() => {
    return mergeStyles(styles.subTitleContainer, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
      borderWidth: theme.layout.borderWidthPixel,
      borderColor: subTitleColor,
    });
  }, [theme, subTitleColor]);

  const statusContainerStyle = useMemo(() => {
    return mergeStyles(styles.statusContainer, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
      backgroundColor: hexToRgba(theme.color.success, 0.1),
    });
  }, [theme]);

  const statusStyle = useMemo(() => {
    return mergeStyles(styles.status, {
      color: theme.color.success,
    });
  }, [theme]);

  const expiredContainerStyle = useMemo(() => {
    return mergeStyles(styles.expiredContainer, {
      backgroundColor: hexToRgba(theme.color.danger, 0.1),
    });
  }, [theme]);

  const expiredStyle = useMemo(() => {
    return mergeStyles(styles.expired, {
      color: theme.color.danger,
    });
  }, [theme]);

  return (
    <BaseButton disabled={!onPress} activeOpacity={0.8} onPress={onPress}>
      <Container style={styles.container}>
        <Container noBackground row centerVertical={false}>
          <Container noBackground style={imageContainerStyle}>
            <Image source={{uri: image}} style={styles.image} />
          </Container>

          <Container noBackground flex centerVertical={false}>
            <Container noBackground centerVertical={false}>
              <Container noBackground row style={styles.headerContainer}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  numberOfLines={2}
                  style={styles.title}>
                  {title}
                </Typography>

                {!!endDate && (
                  <Container
                    style={[
                      statusContainerStyle,
                      isExpired && expiredContainerStyle,
                    ]}>
                    <Typography
                      type={TypographyType.LABEL_TINY}
                      style={[statusStyle, isExpired && expiredStyle]}>
                      {status}
                    </Typography>
                  </Container>
                )}
              </Container>

              {!!code && (
                <Container
                  noBackground
                  centerVertical={false}
                  style={subTitleContainerStyle}>
                  <Typography
                    type={TypographyType.LABEL_TINY}
                    style={subTitleStyle}>
                    {code}
                  </Typography>
                </Container>
              )}
            </Container>

            {!!warrantyDetailInfo && typeof warrantyDetailInfo === 'object' && (
              <Container flex noBackground style={styles.footerContainer}>
                {Object.keys(warrantyDetailInfo || {}).map((key) => (
                  <Typography
                    key={key}
                    type={TypographyType.LABEL_SEMI_MEDIUM}
                    style={
                      (styles.description, styles.warrantyDetailInfoValue)
                    }>
                    {`${key} : ${warrantyDetailInfo[key]}`}
                  </Typography>
                ))}
              </Container>
            )}

            <Container noBackground row style={styles.footerContainer}>
              <Typography
                type={TypographyType.LABEL_SMALL_TERTIARY}
                style={styles.description}>
                {`${formatUniversalDate(startDate)} ~ ${formatUniversalDate(
                  endDate,
                )}`}
              </Typography>

              {!!onPress && (
                <Icon
                  neutral
                  bundle={BundleIconSetName.ANT_DESIGN}
                  name="right"
                  style={styles.icon}
                />
              )}
            </Container>
          </Container>
        </Container>
      </Container>
    </BaseButton>
  );
};

export default React.memo(ProgressItem);
