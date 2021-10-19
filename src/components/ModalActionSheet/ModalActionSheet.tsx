import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {ActionSheetCustom as ActionSheet} from '@alessiocancian/react-native-actionsheet';
import {Actions} from 'react-native-router-flux';

import {ModalActionSheetProps} from '.';

const styles = StyleSheet.create({
  title: {
    color: '#777',
    marginBottom: 7,
    fontSize: 13,
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
    Actions.pop();
  };

  return (
    <ActionSheet
      ref={refActionSheet}
      title={
        !!title && (
          <Text style={[styles.title, !!message && styles.titleHighlight]}>
            {title}
          </Text>
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
