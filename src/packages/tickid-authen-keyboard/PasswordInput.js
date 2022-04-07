import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Container} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

PasswordInput.propTypes = {
  value: PropTypes.string,
};

PasswordInput.defaultProps = {
  value: '',
};

function PasswordInput(props) {
  const {theme} = useTheme();

  const renderPasswordDots = () => {
    const dots = [];
    const passwordLength = `${props.value}`.length;
    for (let i = 0; i < 4; i++) {
      const isActive = i < passwordLength;
      dots.push(
        <View style={[dotStyle, isActive && dotActiveStyle]} key={i} />,
      );
    }
    return dots;
  };

  const passwordInputWrapStyle = useMemo(() => {
    return mergeStyles(styles.passwordInputWrap, {
      borderWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    });
  });

  const dotStyle = useMemo(() => {
    return mergeStyles(styles.dot, {
      backgroundColor: theme.color.contentBackgroundWeak,
    });
  }, [theme]);

  const dotActiveStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackgroundStrong,
    };
  }, [theme]);

  return (
    <Container style={styles.container}>
      <View style={passwordInputWrapStyle}>{renderPasswordDots()}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInputWrap: {
    width: 220,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginHorizontal: 6,
  },
});

export default PasswordInput;
