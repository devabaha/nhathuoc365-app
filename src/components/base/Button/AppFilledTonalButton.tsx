import React, {forwardRef, memo, MutableRefObject} from 'react';
import {StyleSheet} from 'react-native';
import {FilledTonalButtonProps} from '.';
import {ButtonRoundedType} from './constants';

import FilledTonalButton from './FilledTonalButton';

const styles = StyleSheet.create({});

const AppFilledTonalButton = forwardRef(
  (props: FilledTonalButtonProps, ref: MutableRefObject<any>) => {
    return (
      <FilledTonalButton
        secondary
        rounded={ButtonRoundedType.MEDIUM}
        {...props}
        ref={ref}
      />
    );
  },
);

export default memo(AppFilledTonalButton);
