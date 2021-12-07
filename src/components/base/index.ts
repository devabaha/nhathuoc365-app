import Container from './Container';
import Card, {CardBorderRadiusType} from './Card';
import Typography, {TypographyFontSize, TypographyType} from './Typography';
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
  ButtonRoundedType,
} from './Button';
import Icon, {BundleIconSetName, BUNDLE_ICON_SETS} from './Icon';

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
  CardBorderRadiusType,
};

export type SingleChildren = ReactChild | ReactChildren;
export type Children = SingleChildren | SingleChildren[];
export type Ref = RNRef<any>;
