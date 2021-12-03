import Container from './Container';
import Card from './Card';
import Typography from './Typography';
import Input from './Input';
import ActivityIndicator from './ActivityIndicator';

import {TypographyFontSize, TypographyType} from './Typography/constants';
import {ButtonRoundedType} from './Button/constants';
import {Ref as RNRef, ReactChild, ReactChildren} from 'react';

export {
  Container,
  Card,
  Typography,
  Input,
  TypographyFontSize,
  TypographyType,
  ButtonRoundedType,
  ActivityIndicator,
};

export type SingleChildren = ReactChild | ReactChildren;
export type Children = SingleChildren | SingleChildren[];
export type Ref = RNRef<any>;
