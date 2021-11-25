import React, {forwardRef, memo} from 'react';
import {StyleSheet} from 'react-native';

import {FilledButtonProps} from '.';
import {Ref} from '..';

import {ButtonRoundedType} from './constants';
import FilledButton from './FilledButton';

const styles = StyleSheet.create({});

const AppFilledButton = forwardRef((props: FilledButtonProps, ref: Ref) => {
  return (
    <FilledButton
      secondary
      rounded={ButtonRoundedType.MEDIUM}
      {...props}
      ref={ref}
    />
  );
});

export default memo(AppFilledButton);
