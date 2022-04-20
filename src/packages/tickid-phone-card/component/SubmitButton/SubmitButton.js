import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, ViewPropTypes} from 'react-native';
// custom components
import Button from 'src/components/Button';
import Image from 'src/components/Image';

SubmitButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: ViewPropTypes.style,
  iconSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
      headers: PropTypes.objectOf(PropTypes.string),
    }),
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        headers: PropTypes.objectOf(PropTypes.string),
      }),
    ),
  ]),
};

SubmitButton.defaultProps = {
  onPress: () => {},
};

function SubmitButton(props) {
  const renderIconLeft = useCallback(() => {
    return (
      !!props.iconSource && (
        <Image style={styles.icon} source={props.iconSource} />
      )
    );
  }, [props.iconSource]);

  return (
    <Button
      safeLayout={props.safeLayout}
      title={props.title}
      containerStyle={props.style}
      onPress={props.onPress}
      renderIconLeft={renderIconLeft}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
    top: -2,
  },
});

export default SubmitButton;
