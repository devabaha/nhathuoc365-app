import React, {forwardRef, memo} from 'react';
import {StyleSheet} from 'react-native';

import {FilledTonalButtonProps} from '.';
import {Ref} from '..';

import {ButtonRoundedType} from './constants';

import FilledTonalButton from './FilledTonalButton';

const styles = StyleSheet.create({});

const AppFilledTonalButton = forwardRef(
  (props: FilledTonalButtonProps, ref: Ref) => {
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
