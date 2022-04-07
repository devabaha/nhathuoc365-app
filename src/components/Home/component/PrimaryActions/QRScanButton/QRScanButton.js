import React from 'react';
// helpers
import {servicesHandler} from 'src/helper/servicesHandler';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'src/helper/servicesHandler';
// custom components
import SubActionButton from '../SubActionButton';

const QRScanButton = ({
  label,
  iconStyle,
  wrapperStyle,
  containerStyle,
  useTouchableHighlight,
}) => {
  const {theme} = useTheme();
  const {t} = useTranslation('common');

  const goQRScan = () => {
    servicesHandler({type: SERVICES_TYPE.QRCODE_SCAN, theme}, t);
  };

  return (
    <SubActionButton
      useTouchableHighlight={useTouchableHighlight}
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
