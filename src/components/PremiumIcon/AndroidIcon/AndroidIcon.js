import React, {useEffect, useState} from 'react';
// 3-party libs
import Svg, {
  Defs,
  Stop,
  Rect,
  LinearGradient,
  Path,
  G,
  Mask,
  Use,
} from 'react-native-svg';

const CROWN_ORIGIN_WIDTH = 640;
const CROWN_ORIGIN_HEIGHT = 512;

const USER_ORIGIN_WIDTH = 448;
const USER_ORIGIN_HEIGHT = 512;

const AndroidIcon = ({size, colors, locations, premium, path}) => {
  const [width, setWidth] = useState(size);
  const [height, setHeight] = useState(
    CROWN_ORIGIN_HEIGHT / (CROWN_ORIGIN_WIDTH / size),
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
          key={index}
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

export default AndroidIcon;
