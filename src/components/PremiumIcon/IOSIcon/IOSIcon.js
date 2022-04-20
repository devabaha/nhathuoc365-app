import React from 'react';
// custom components
import GradientIcon from 'src/components/GradientIcon';

const IOSIcon = (props) => {
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

export default IOSIcon;
