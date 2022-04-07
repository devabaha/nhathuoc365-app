import {SYSTEM_DARK} from '../system';
import {ADDITION_LIGHT} from './addition.light';

export const ADDITION_DARK = {
  ...ADDITION_LIGHT,

  backgroundBubbleLeft: SYSTEM_DARK.contentBackgroundWeak,
  backgroundBubbleLeftHighlight: SYSTEM_DARK.contentBackground,
};
