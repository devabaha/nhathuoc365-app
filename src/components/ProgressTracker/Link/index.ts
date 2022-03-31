export { default } from './Link';
import { StyleProp, ViewStyle } from 'react-native';

export interface LinkProps {
    isActive?: boolean
    containerStyle?: StyleProp<ViewStyle>
    linkStyle?: StyleProp<ViewStyle>
    maskLinkStyle?: StyleProp<ViewStyle>
    unActiveLinkColor?: string
    activeLinkColor?: string
}