import Container from './Container';
import Card, {CardBorderRadiusType} from './Card';
import Typography, {TypographyFontSize, TypographyType} from './Typography';
import Input, {AppInput} from './Input';
import ActivityIndicator from './ActivityIndicator';
import ScreenWrapper from './ScreenWrapper';
import FlatList from './FlatList';
import SectionList from './SectionList';
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
  ImageButton,
} from './Button';
import Icon, {BundleIconSetName, BUNDLE_ICON_SETS} from './Icon';
import NavBar, {NavBarWrapper} from './NavBar';
import StatusBar from './StatusBar';

import {Ref as RNRef, ReactChild, ReactChildren} from 'react';
import {TFunctionResult} from 'i18next';

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
  SectionList,
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
  ImageButton,
  Icon,
  BundleIconSetName,
  BUNDLE_ICON_SETS,
  CardBorderRadiusType,
  NavBar,
  NavBarWrapper,
  StatusBar,
  AppInput,
};

export type SingleChildren =
  | ReactChild
  | ReactChildren
  | JSX.Element
  | TFunctionResult;
export type Children = SingleChildren | SingleChildren[];
export type Ref = RNRef<any>;
