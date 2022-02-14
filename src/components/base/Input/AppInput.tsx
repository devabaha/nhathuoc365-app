import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from './Input';
import Container from '../Container';
import Icon, {BundleIconSetName} from '../Icon';
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {AppInputProps} from '.';

const styles = StyleSheet.create({
  container: {
    height: 30,
  },
  iconLeft: {
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
});

const AppInput = ({
  iconLeftBundle = BundleIconSetName.ANT_DESIGN,
  iconLeftName = '',
  iconLeftStyle = {},
  containerStyle = {},
  ...inputProps
}: AppInputProps) => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.iconLeft,
        {
          color: theme.color.iconInactive,
        },
      ],
      iconLeftStyle,
    );
  }, [theme, iconLeftStyle]);

  const containerBaseStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          backgroundColor: theme.color.contentBackgroundWeak,
          borderRadius: theme.layout.borderRadiusExtraSmall,
        },
      ],
      containerStyle,
    );
  }, [theme, containerStyle]);

  const inputStyle = useMemo(() => {
    return mergeStyles(styles.input, inputProps?.style);
  }, [theme, inputProps?.style]);

  return (
    <Container row style={containerBaseStyle}>
      {!!iconLeftName && (
        <Icon bundle={iconLeftBundle} name={iconLeftName} style={iconStyle} />
      )}
      <Input {...inputProps} style={inputStyle} />
    </Container>
  );
};

export default memo(AppInput);
