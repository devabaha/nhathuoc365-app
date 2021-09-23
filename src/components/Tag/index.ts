export {default} from './Tag';
import { StyleProp, ViewStyle } from 'react-native';

export interface TagProps {
    fill?: string,
    strokeColor?: string,
    label?: string,
    strokeWidth?: number,
    containerStyle?: StyleProp<ViewStyle>,
    labelContainerStyle?: StyleProp<ViewStyle>,
    labelStyle?: StyleProp<ViewStyle>,
    animate?: boolean,
    padding?: number
}