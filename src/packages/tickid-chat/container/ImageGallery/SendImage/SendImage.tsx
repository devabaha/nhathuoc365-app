import React, {useMemo, memo} from 'react';
import {View, StyleSheet} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {
  BaseButton,
  Container,
  Typography,
  TypographyType,
} from 'src/components/base';

const styles = StyleSheet.create({
  iconSend: {
    bottom: 0,
    right: 0,
    borderRadius: 30,
  },
  fullCenter: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSend: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 60,
    right: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalSelectedPhotos: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 30,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMessage: {
    lineHeight: 15,
    fontWeight: '600',
  },
});

const SendImage = (props) => {
  const {theme} = useTheme();
  const totalSelectedPhotosStyle: Style = useMemo(() => {
    return {
      backgroundColor: theme.color.accent2,
      borderRadius: theme.layout.borderRadiusMedium,
    };
  }, [theme]);

  const selectedMessageStyle: Style = useMemo(() => {
    return {color: theme.color.white};
  }, [theme]);

  const disabled = useMemo(() => {
    return props.selectedPhotos.length === 0;
  }, [props?.selectedPhotos?.length]);

  const iconSendImageStyle = useMemo(() => {
    return {
      color: disabled ? theme.color.iconInactive : theme.color.accent2,
    };
  }, [theme, disabled]);

  const IconSendImage = props.iconSendImage;

  return (
    <Container shadow style={[styles.btnSend, props.containerStyle]}>
      <BaseButton
        onPress={props.onSendImage}
        style={[styles.iconSend, styles.fullCenter]}
        disabled={disabled}>
        <IconSendImage style={iconSendImageStyle} />
      </BaseButton>
      {props.selectedPhotos.length !== 0 && (
        <View style={[styles.totalSelectedPhotos, totalSelectedPhotosStyle]}>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[styles.selectedMessage, selectedMessageStyle]}>
            {props.selectedPhotos.length}
          </Typography>
        </View>
      )}
    </Container>
  );
};

export default memo(SendImage);
