import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {default as ModalBox} from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Button from '../components/Button';
import {
  Card,
  Container,
  Typography,
  IconButton,
  Input,
} from 'src/components/base';

function ModalInput({
  refModal = () => {},
  title,
  description,
  btnTitle,
  valueExecutor,
  btnDisabled,
  textInputProps,
  textInputContainerStyle,
  textInputStyle,
  value,
  onClosedModal,
  onSubmit = () => {},
  extraInput = null,
  backdropPressToClose = false,
}) {
  const {theme} = useTheme();

  const [text, setPrice] = useState(value);
  let ref_modal = null;
  let ref_input = useRef();

  useEffect(() => {
    if (textInputProps?.autoFocus) {
      setTimeout(() => {
        if (ref_input.current) {
          ref_input.current.focus();
        }
      });
    }
  }, []);

  function onChangeText(text) {
    setPrice(text);
  }

  function onClosing() {
    if (ref_modal) {
      ref_modal.close();
    }
  }

  function onClosed() {
    if (onClosedModal) {
      onClosedModal();
    } else {
      Actions.pop();
    }
  }

  function handleSubmit() {
    onSubmit(text.trim());
  }

  function getFormattedText() {
    return valueExecutor ? valueExecutor(text) : text;
  }

  function handleRef(ref) {
    ref_modal = ref;
    refModal(ref);
  }

  const headingContainerStyle = useMemo(() => {
    return mergeStyles(styles.headingContainer, {
      borderBottomColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidth,
    });
  }, []);

  const textInputBaseContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.textInputContainer,
        {
          borderWidth: theme.layout.borderWidth,
          borderColor: theme.color.border,
          borderRadius: theme.layout.borderRadiusSmall,
        },
      ],
      textInputContainerStyle,
    );
  }, [theme]);

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.iconInactive,
    });
  }, [theme]);

  return (
    <ModalBox
      entry="top"
      position="center"
      style={[styles.modal]}
      backButtonClose
      ref={handleRef}
      isOpen
      onClosed={onClosed}
      useNativeDriver
      swipeToClose={false}
      backdropPressToClose={backdropPressToClose}>
      <Card>
        <Container noBackground style={headingContainerStyle}>
          <IconButton
            onPress={onClosing}
            style={styles.iconContainer}
            iconStyle={iconStyle}
            bundle={BundleIconSetName.FONT_AWESOME}
            name="close"
          />
          <Typography type={TypographyType.TITLE_LARGE} style={styles.heading}>
            {title}
          </Typography>
        </Container>

        <View style={styles.body}>
          {!!description && (
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={styles.description}>
              {description}
            </Typography>
          )}
          <Container style={textInputBaseContainerStyle}>
            <Input
              ref={ref_input}
              value={getFormattedText()}
              onChangeText={onChangeText}
              {...textInputProps}
              style={[styles.textInput, textInputStyle]}
            />
            {extraInput}
          </Container>
        </View>

        <Button
          disabled={
            btnDisabled !== undefined
              ? btnDisabled
              : !getFormattedText() || getFormattedText() == 0
          }
          title={btnTitle}
          onPress={handleSubmit}
          containerStyle={styles.btnContainer}
        />
      </Card>
    </ModalBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    maxWidth: '80%',
    height: undefined,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
  },
  icon: {
    fontSize: 18,
  },
  headingContainer: {
    padding: 30,
    paddingBottom: 15,
  },
  heading: {
    marginTop: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  body: {
    padding: 15,
    paddingTop: 20,
  },
  description: {
    marginBottom: 12,
  },
  textInputContainer: {
    padding: appConfig.device.ratio * 3,
    paddingHorizontal: 15,
    paddingBottom: appConfig.device.ratio * 3 + 1,
    marginBottom: 0,
  },
  textInput: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  btnContainer: {
    paddingBottom: 15,
  },
});

export default ModalInput;
