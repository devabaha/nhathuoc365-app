import React, {forwardRef, memo, MutableRefObject} from 'react';
import {StyleSheet} from 'react-native';
import {OutlinedButtonProps} from '.';
import {ButtonRoundedType} from './constants';

import OutlinedButton from './OutlinedButton';

const styles = StyleSheet.create({});

const AppOutlinedButton = forwardRef(
  (props: OutlinedButtonProps, ref: MutableRefObject<any>) => {
    return (
      <OutlinedButton
        secondary
        rounded={ButtonRoundedType.MEDIUM}
        {...props}
        ref={ref}
      />
    );
  },
);

export default memo(AppOutlinedButton);
