import {Children} from 'src/components/base';
import {TypographyProps} from 'src/components/base/Typography';

export {default} from './TextPressable';

export interface TextPressableProps extends TypographyProps {
  children: Children;
}
