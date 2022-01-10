import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// context
import {useTheme} from 'src/Themes/Theme.context';

FieldItemWrapper.propTypes = {
  children: PropTypes.node,
  separate: PropTypes.bool,
};

FieldItemWrapper.defaultProps = {
  children: null,
  separate: false,
};

function FieldItemWrapper(props) {
  const {theme} = useTheme();

  const separateStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    };
  }, [theme]);

  return (
    <View style={[styles.wrapper, props.separate && separateStyle]}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  separate: {
    paddingBottom: 8,
  },
});

export default FieldItemWrapper;
