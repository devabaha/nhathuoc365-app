import React, {useEffect, useMemo} from 'react';
import {StyleSheet, TextStyle} from 'react-native';
// 3-party libs
import {ActionSheetCustom as ActionSheet} from '@alessiocancian/react-native-actionsheet';
// types
import {ModalActionSheetProps} from '.';
// routing
import {pop} from 'app-helper/routing';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import {useTheme} from 'src/Themes/Theme.context';
import {Style} from 'src/Themes/interface';
import {isDarkTheme} from 'src/Themes/helper';

const styles = StyleSheet.create({
  title: {
    marginBottom: 7,
  },
  titleHighlight: {
    fontWeight: '600',
    marginBottom: 0,
  },
});

const ModalActionSheet = ({
  title,
  message,

  options = [],

  cancelButtonIndex: cancelButtonIndexProp,
  destructiveButtonIndex,

  onPress = () => {},

  ...props
}: ModalActionSheetProps) => {
  const {theme} = useTheme();

  const refActionSheet = React.createRef<any>();

  const cancelButtonIndex =
    cancelButtonIndexProp !== undefined
      ? cancelButtonIndexProp
      : options?.length - 1 || undefined;

  useEffect(() => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  }, []);

  const handlePress = (actionIndex) => {
    onPress(actionIndex);
    pop();
  };

  const optionBoxStyle: Style = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
    };
  }, [theme]);

  const optionBodyStyle: Style = useMemo(() => {
    return {
      backgroundColor: theme.color.background,
    };
  }, [theme]);

  const actionSheetStyles = useMemo(() => {
    return {
      titleBox: optionBoxStyle,
      body: optionBodyStyle,
      messageBox: optionBoxStyle,
      messageText: theme.typography[
        TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY
      ] as TextStyle,
      buttonBox: optionBoxStyle,
      cancelButtonBox: optionBoxStyle,
    };
  }, [optionBoxStyle, optionBodyStyle, theme]);

  return (
    <ActionSheet
      ref={refActionSheet}
      styles={actionSheetStyles}
      userInterfaceStyle={isDarkTheme(theme) ? 'dark' : undefined}
      title={
        !!title && (
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={[styles.title, !!message && styles.titleHighlight]}>
            {title}
          </Typography>
        )
      }
      message={message}
      options={options}
      cancelButtonIndex={cancelButtonIndex}
      destructiveButtonIndex={destructiveButtonIndex}
      onPress={handlePress}
      {...props}
    />
  );
};

export default React.memo(ModalActionSheet);
