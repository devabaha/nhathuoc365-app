import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {RESULTS} from 'react-native-permissions';
import {Container, Typography, TypographyType} from 'src/components/base';

const styles = StyleSheet.create({
  fullCenter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: {
    textAlign: 'center',
    paddingHorizontal: 5,
    marginTop: 15,
  },
});

const CameraPicker = (props) => {
  const {t} = useTranslation('chat');

  const title: string = useMemo(
    () =>
      props.permissionGranted === RESULTS.GRANTED
        ? t('takePhoto')
        : t('needCameraAccess'),
    [props.permissionGranted],
  );

  return (
    <Container style={styles.fullCenter}>
      {props.permissionGranted === RESULTS.GRANTED
        ? props.iconCameraPicker
        : props.iconCameraOff}

      <Typography type={TypographyType.LABEL_MEDIUM} style={styles.captureText}>
        {title}
      </Typography>
    </Container>
  );
};

export default CameraPicker;
