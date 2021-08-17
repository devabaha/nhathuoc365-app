import React from 'react';
import {TextProps} from 'react-native';

export {default} from './TextPressable';

export interface TextPressableProps extends TextProps {
    children: React.ReactNode
}
