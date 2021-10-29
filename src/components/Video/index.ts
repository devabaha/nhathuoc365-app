import {YoutubeVideoIframeProps} from './YoutubeVideoIframe';

export {default} from './Video';

export type VideoType = 'youtube' | 'video';

export interface VideoProps extends YoutubeVideoIframeProps {
  type: VideoType;
  isPlay: boolean;
  isMute?: boolean;

  onPressFullscreen?: () => void;
}
