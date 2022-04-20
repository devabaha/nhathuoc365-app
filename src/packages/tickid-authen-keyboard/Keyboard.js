import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {KEYBOARD_DEFINITION} from './constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Icon,
  Container,
  FilledButton,
  TextButton,
  Typography,
} from 'src/components/base';

Keyboard.propTypes = {
  onPress: PropTypes.func,
  onClear: PropTypes.func,
};

Keyboard.defaultProps = {
  onPress: () => {},
  onClear: () => {},
};

function Keyboard(props) {
  const {theme} = useTheme();

  const numberValueTypoProps = {type: TypographyType.LABEL_GIGANTIC};

  const renderTextDescription = (text, titleStyle, buttonStyle, fontStyle) => {
    return (
      !!text && (
        <Typography
          type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
          style={[fontStyle, styles.text]}>
          {text}
        </Typography>
      )
    );
  };

  const renderButtons = () => {
    return KEYBOARD_DEFINITION.map((button, index) => {
      const isMiddleButton = index % 3 === 1;
      switch (button.type) {
        case 'button':
          return (
            <Container
              style={[
                buttonWrapperStyle,
                isMiddleButton && buttonMiddleWrapperStyle,
              ]}
              key={index}>
              <TextButton
                typoProps={numberValueTypoProps}
                style={styles.button}
                renderIconRight={(...args) =>
                  renderTextDescription(button.text, ...args)
                }
                onPress={() => props.onPress(button.value)}>
                {button.value}
              </TextButton>
            </Container>
          );
        case null:
          return (
            <View
              style={[
                buttonWrapperStyle,
                isMiddleButton && buttonMiddleWrapperStyle,
              ]}
              key={index}>
              <View style={[styles.button, subButtonStyle]} />
            </View>
          );
        case 'clean':
          return (
            <View
              style={[
                buttonWrapperStyle,
                isMiddleButton && buttonMiddleWrapperStyle,
              ]}
              key={index}>
              <FilledButton
                style={[styles.button, subButtonStyle]}
                onPress={() => props.onClear()}>
                <Icon
                  bundle={BundleIconSetName.IONICONS}
                  name="backspace"
                  style={[styles.cleanIcon, cleanButtonStyle]}
                />
              </FilledButton>
            </View>
          );
      }
    });
  };

  const buttonWrapperStyle = useMemo(() => {
    return mergeStyles(styles.buttonWrapper, {
      borderColor: theme.color.border,
      borderTopWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  const buttonMiddleWrapperStyle = useMemo(() => {
    return mergeStyles(styles.buttonWrapper, {
      borderLeftWidth: theme.layout.borderWidth,
      borderRightWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  const subButtonStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackgroundStrong,
    };
  }, [theme]);

  const cleanButtonStyle = useMemo(() => {
    return {
      color: theme.color.surface,
    };
  }, [theme]);

  return <Container style={styles.container}>{renderButtons()}</Container>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    width: `${100 / 3}%`,
  },
  button: {
    flexDirection: 'column',
    width: '100%',
    minHeight: 58,
    alignItems: 'center',
    paddingVertical: 7,
  },
  buttonClear: {
    justifyContent: 'center',
  },
  buttonEmpty: {},
  value: {},
  text: {
    fontWeight: '300',
  },
  cleanIcon: {
    fontSize: 28,
  },
});

export default Keyboard;
