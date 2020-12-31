export {default} from './ImageBg';
import { ImagePropsBase, ImageSourcePropType,
    //  ImageStyle,
      StyleProp, ViewProps } from 'react-native';
import { FastImageProps, Source, ImageStyle } from 'react-native-fast-image';

export interface ImageBgProps extends ViewProps {
    style?: StyleProp<ViewProps>
    imageStyle?: StyleProp<ImageStyle>
    imageProps?: ImagePropsBase,
    // source: ImageSourcePropType,
    source: Source,
    children?: React.ReactNode
}