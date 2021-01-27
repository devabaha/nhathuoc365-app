export {default} from './ScreenWrapper';
import { ViewProps, StyleProp } from 'react-native';

export interface ScreenWrapperProps extends ViewProps {
    containerStyle?: StyleProp<ViewProps>
    children?: React.ReactNode
}