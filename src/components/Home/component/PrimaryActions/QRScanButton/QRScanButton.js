import React from 'react';
import {Actions} from 'react-native-router-flux';
import SubActionButton from '../SubActionButton';
import appConfig from 'app-config';
import {servicesHandler, SERVICES_TYPE} from 'src/helper/servicesHandler';
import {useTheme} from 'src/Themes/Theme.context';

const QRScanButton = ({label, iconStyle, wrapperStyle, containerStyle}) => {
  const {theme} = useTheme();
  const {t} = useTranslation('common');

  const goQRScan = () => {
    servicesHandler({type: SERVICES_TYPE.QRCODE_SCAN, theme}, t);
  };

  return (
    <SubActionButton
      iconName="ios-scan"
      label={label}
      wrapperStyle={wrapperStyle}
      containerStyle={containerStyle}
      iconStyle={iconStyle}
      onPress={goQRScan}
    />
  );
};

export default QRScanButton;
