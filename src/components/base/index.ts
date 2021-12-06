import Container from './Container';
import Card from './Card';
import Typography from './Typography';
import Input from './Input';
import ActivityIndicator from './ActivityIndicator';
import ScreenWrapper from './ScreenWrapper';
import FlatList from './FlatList';
import ScrollView from './ScrollView';
import RefreshControl from './RefreshControl';
import Skeleton from './Skeleton';
import {
  BaseButton,
  IconButton,
  TextButton,
  FilledButton,
  OutlinedButton,
  AppFilledButton,
  AppPrimaryButton,
  AppOutlinedButton,
  FilledTonalButton,
  AppFilledTonalButton,
} from './Button';
import Icon from './Icon';

import {BundleIconSetName, BUNDLE_ICON_SETS} from './Icon/constants';
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
  ScreenWrapper,
  FlatList,
  ScrollView,
  RefreshControl,
  Skeleton,
  BaseButton,
  IconButton,
  TextButton,
  FilledButton,
  OutlinedButton,
  AppFilledButton,
  AppPrimaryButton,
  AppOutlinedButton,
  FilledTonalButton,
  AppFilledTonalButton,
  Icon,
  BundleIconSetName,
  BUNDLE_ICON_SETS,
};

export type SingleChildren = ReactChild | ReactChildren;
export type Children = SingleChildren | SingleChildren[];
export type Ref = RNRef<any>;
