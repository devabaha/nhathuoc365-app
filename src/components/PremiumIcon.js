import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import appConfig from 'app-config';
import store from 'app-store';
import Svg, {
  Defs,
  Stop,
  Rect,
  LinearGradient,
  Path,
  G,
  ClipPath,
  Mask,
  Use
} from 'react-native-svg';
import GradientIcon from './GradientIcon';

const CROWN_PATH =
  'M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z';
const CROWN_ORIGIN_WIDTH = 640;
const CROWN_ORIGIN_HEIGHT = 512;

const USER_PATH =
  'M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z';
const USER_ORIGIN_WIDTH = 448;
const USER_ORIGIN_HEIGHT = 512;

const PremiumIcon = ({
  size = 14,
  locations = [0.3, 0.6],
  premium = store.user_info ? store.user_info.premium : 0,
  subIcon = '',
  iconSize = 11,
  useAngle,
  angle,
  ...props
}) => {
  const icon = membershipIcon();

  function membershipIcon() {
    let gradientColors = appConfig.colors.membership.standard,
      iconName = 'crown';
    path = CROWN_PATH;
    switch (premium) {
      case MEMBERSHIP_TYPE.STANDARD:
        iconName = subIcon;
        path = USER_PATH;
        gradientColors = appConfig.colors.membership.standard;
        break;
      case MEMBERSHIP_TYPE.GOLD:
        gradientColors = appConfig.colors.membership.gold;
        break;
      case MEMBERSHIP_TYPE.PLATINUM:
        gradientColors = appConfig.colors.membership.platinum;
        break;
      case MEMBERSHIP_TYPE.DIAMOND:
        gradientColors = appConfig.colors.membership.diamond;
        break;
    }

    return { style: gradientColors, iconName, path };
  }

  function renderIcon() {
    return (
      <View {...props}>
        {appConfig.device.isIOS ? (
          <IOSIcon
            colors={icon.style}
            iconName={icon.iconName}
            size={size}
            locations={locations}
            iconSize={iconSize}
          />
        ) : (
          <AndroidIcon
            colors={icon.style}
            size={size}
            locations={locations}
            path={icon.path}
            premium={premium}
          />
        )}
      </View>
    );
  }

  return icon.iconName ? renderIcon() : null;
};

export default PremiumIcon;

const IOSIcon = props => {
  return (
    <GradientIcon
      gradientColors={props.colors}
      iconName={props.iconName}
      size={props.size}
      iconSize={props.iconSize}
      locations={props.locations}
      useAngle
    />
  );
};

const AndroidIcon = ({ size, colors, locations, premium, path }) => {
  const [width, setWidth] = useState(size);
  const [height, setHeight] = useState(
    CROWN_ORIGIN_HEIGHT / (CROWN_ORIGIN_WIDTH / size)
  );
  const [scale, setScale] = useState(size / CROWN_ORIGIN_WIDTH);

  useEffect(() => {
    if (!premium) {
      setHeight(USER_ORIGIN_HEIGHT / (USER_ORIGIN_WIDTH / size));
      setScale(size / USER_ORIGIN_WIDTH);
    }
  }, [premium]);

  function renderColors() {
    return colors.map((color, index) => {
      return (
        <Stop
          offset={String(locations[index])}
          stopColor={color}
          stopOpacity="1"
        />
      );
    });
  }

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="Gradient" x1="0" y1="1" x2="1" y2="0">
          {renderColors()}
        </LinearGradient>
        <Mask id="clip">
          <G scale="1.2">
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="url(#Gradient)"
            />
          </G>
        </Mask>
        <Path id="Icon" d={path} scale={scale} />
      </Defs>
      <Use href="#Icon" fill="url(#Gradient)" mask="url(#clip)" />
    </Svg>
  );
};
