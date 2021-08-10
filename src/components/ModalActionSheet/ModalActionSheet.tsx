import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {ActionSheetCustom as ActionSheet} from '@alessiocancian/react-native-actionsheet';
import {Actions} from 'react-native-router-flux';

import { ModalActionSheetProps } from '.';

const styles = StyleSheet.create({});

const ModalActionSheet = ({
  title,
  message,

  options = [],

  cancelButtonIndex: cancelButtonIndexProp,
  destructiveButtonIndex: destructiveButtonIndexProp,

  onPress = () => {},

  ...props
}: ModalActionSheetProps) => {
  const refActionSheet = React.createRef<any>();

  const cancelButtonIndex =
    cancelButtonIndexProp !== undefined
      ? cancelButtonIndexProp
      : options?.length - 1 || undefined;

  const destructiveButtonIndex =
    destructiveButtonIndexProp !== undefined
      ? destructiveButtonIndexProp
      : cancelButtonIndex;

  useEffect(() => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  }, []);

  const handlePress = (actionIndex) => {
    onPress(actionIndex);
    Actions.pop();
  };

  return (
    <ActionSheet
      ref={refActionSheet}
      title={title}
      options={options}
      cancelButtonIndex={cancelButtonIndex}
      destructiveButtonIndex={destructiveButtonIndex}
      onPress={handlePress}
      {...props}
    />
  );
};

export default React.memo(ModalActionSheet);
