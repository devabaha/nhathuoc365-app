import React, {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {OTP_LENGTH} from 'src/components/ResetPassword/constants';
import {BundleIconSetName, Container, IconButton} from 'src/components/base';
// custom components
import {Input} from 'src/components/base';
import Loading from '../Loading';

const OTPInput = memo((props) => {
  const {theme} = useTheme();

  const confirmOTPIconStyle = useMemo(() => {
    return mergeStyles(styles.confirmOTPIcon, {
      // color: theme.color.primaryHighlight,
    });
  }, [theme]);

  const OTPInputContainerStyle = useMemo(() => {
    return mergeStyles(styles.OTPInputContainer, {
      borderWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  const OTPInputStyle = useMemo(() => {
    return mergeStyles(styles.OTPInput, {
      borderRightWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <View style={OTPInputContainerStyle}>
      <Input
        ref={props.refOTP}
        style={OTPInputStyle}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
        maxLength={OTP_LENGTH}
        onChangeText={props.onChangeText}
        value={props.value}
      />
      <View style={styles.confirmOTPBtnContainer}>
        <IconButton
          disabled={props.disabled}
          bundle={BundleIconSetName.IONICONS}
          name="ios-send"
          primaryHighlight
          iconStyle={[confirmOTPIconStyle]}
          onPress={props.onSendPress}
        />
        {!!props.loading && (
          <Container style={styles.loadingContainer}>
            <Loading
              wrapperStyle={styles.loadingWrapper}
              animating={true}
              size="small"
            />
          </Container>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  confirmOTPBtnContainer: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: '100%',
    justifyContent: 'center',
  },
  btn: {
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 0,
  },

  confirmOTPIcon: {
    fontSize: 30,
  },
  OTPInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  OTPInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  disabledVerifyOTP: {},
  loadingContainer: {
    ...StyleSheet.absoluteFill,
  },
  loadingWrapper: {
    justifyContent: 'center',
  },
});
export default OTPInput;
