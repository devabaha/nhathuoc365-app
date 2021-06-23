import React from 'react';
import {StyleSheet, Text} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Button from 'react-native-button';
import moment from 'moment';

import appConfig from 'app-config';

import Image from 'src/components/Image';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 65,
    height: 65,
    marginRight: 15,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    justifyContent: 'space-between',
  },
  title: {
    color: '#242424',
    fontWeight: '500',
    flex: 1,
  },
  subTitleContainer: {
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: Util.pixel,
    borderColor: appConfig.colors.primary,
  },
  subTitle: {
    color: appConfig.colors.primary,
    fontSize: 12,
  },
  statusContainer: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: hexToRgbA(appConfig.colors.status.success, 0.1),
    borderRadius: 4,
  },
  status: {
    color: appConfig.colors.status.success,
    fontSize: 12,
  },

  footerContainer: {
    marginTop: 10,
  },
  description: {
    color: '#666',
    fontSize: 12,
    flex: 1,
  },
  icon: {
    paddingHorizontal: 5,
    color: '#666',
    marginLeft: 15,
  },

  expiredContainer: {
    backgroundColor: hexToRgbA(appConfig.colors.status.danger, 0.1),
  },
  expired: {
    color: appConfig.colors.status.danger,
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
  onPress,
}) => {
  const {t} = useTranslation('progressTracking');
  const getStatus = () => {
    let status = t('available');
    let type = STATUS_TYPE.AVAILABLE;
    const availableDays = moment(endDate).diff(moment(), 'days');
    if (availableDays > 0 && availableDays <= 7) {
      status =
        t('availablePrefix') + ' ' + availableDays + ' ' + t('availableSuffix');
    } else if (availableDays <= 0) {
      status = t('expired');
      type = STATUS_TYPE.EXPIRED;
    }

    return {status, type};
  };

  const {status, type: statusType} = getStatus();
  const isExpired = statusType === STATUS_TYPE.EXPIRED;

  return (
    <Button disabled={!onPress} activeOpacity={0.8} onPress={onPress} containerStyle={styles.container}>
      <Container row>
        <Container style={styles.imageContainer}>
          <Image source={{uri: image}} style={styles.image} />
        </Container>

        <Container flex centerVertical={false}>
          <Container centerVertical={false}>
            <Container row style={styles.headerContainer}>
              <Text numberOfLines={2} style={styles.title}>
                {title}
              </Text>

              {!!endDate && (
                <Container
                  style={[
                    styles.statusContainer,
                    isExpired && styles.expiredContainer,
                  ]}>
                  <Text style={[styles.status, isExpired && styles.expired]}>
                    {status}
                  </Text>
                </Container>
              )}
            </Container>

            {!!code && (
              <Container
                centerVertical={false}
                style={styles.subTitleContainer}>
                <Text style={styles.subTitle}>{code}</Text>
              </Container>
            )}
          </Container>

          <Container row style={styles.footerContainer}>
            <Text style={styles.description}>
              {startDate}
              {!!endDate && ` ~ ${endDate}`}
            </Text>

            {!!onPress && <AntDesignIcon name="right" style={styles.icon} />}
          </Container>
        </Container>
      </Container>
    </Button>
  );
};

export default React.memo(ProgressItem);
