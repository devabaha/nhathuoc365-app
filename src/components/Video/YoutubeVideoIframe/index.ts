import {TFunction} from 'i18next';
import React from 'react';
import {StyleProp, ViewProps} from 'react-native';
import {
  YoutubeIframeProps,
  YoutubeIframeRef,
} from 'react-native-youtube-iframe';

export {default} from './YoutubeVideoIframe';

export interface YoutubeVideoIframeProps {
  t: TFunction;

  videoId: string;
  height: number; // string-able

  width?: number; // string-able
  refPlayer?: (ref: YoutubeIframeRef) => void;
  webviewStyle?: StyleProp<ViewProps>;
  containerStyle?: StyleProp<ViewProps>;
  autoAdjustLayout?: boolean;
  isEnd?: boolean;
  isFullscreenWithoutModal?: boolean;
  onReady?: () => void;
  onError?: (error: string) => void;
  onChangeState?: (event: string) => void;
  onPressPlay?: () => void;
  onPressMute?: () => void;
  onPressFullscreen?: () => void;
  onRotateFullscreen?: (isFullscreenLandscape: boolean) => void;
  onChangeControlsVisible?: (isControlsVisible: boolean) => void;
  onProgress?: (progress: number) => void;
  youtubeIframeProps?: YoutubeIframeProps;

  renderVideo?: (videoComponent: React.ReactNode) => React.ReactNode;
}
