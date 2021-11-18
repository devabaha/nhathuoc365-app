import React, {forwardRef, memo, MutableRefObject} from 'react';
import {StyleSheet} from 'react-native';

import {FilledButtonProps} from '.';
import {ButtonRoundedType} from './constants';
import FilledButton from './FilledButton';

const styles = StyleSheet.create({});

const AppFilledButton = forwardRef(
  (props: FilledButtonProps, ref: MutableRefObject<any>) => {
    return (
      <FilledButton
        secondary
        rounded={ButtonRoundedType.MEDIUM}
        {...props}
        ref={ref}
      />
    );
  },
);

export default memo(AppFilledButton);
