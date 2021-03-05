import React from 'react';
import Svg, {Path} from 'react-native-svg';

const QRFrame = ({width, height, ratio = 1.15}) => {
  const pathWidth = 0.1 * width;
  const pathHeight = 0.1 * height;
  const strokeWidth = 5;
  const svgWidth = width * ratio;
  const svgHeight = height * ratio;

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      style={{
        top: (-height * Math.abs(1 - ratio)) / 2,
        left: (-width * Math.abs(1 - ratio)) / 2,
      }}>
      <Path
        vectorEffect="nonScalingStroke"
        scale={ratio}
        strokeLinejoin="round"
        d={`
        M${strokeWidth / 2} ${pathHeight + strokeWidth / 2} 
        v${-pathHeight} 
        h${pathWidth} 
        M${width - pathWidth - strokeWidth / 2} ${strokeWidth / 2} 
        h${pathWidth} v${pathHeight}
        M${width - strokeWidth / 2} ${height - pathHeight - strokeWidth / 2}
        v${pathHeight} 
        h${-pathWidth}
        M${strokeWidth / 2} ${height - pathHeight - strokeWidth / 2}
        v${pathHeight} 
        h${pathWidth}
        `}
        strokeWidth={strokeWidth}
        stroke="#fff"
      />
    </Svg>
  );
};

export default React.memo(QRFrame);
