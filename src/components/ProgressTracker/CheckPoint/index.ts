export { default } from './CheckPoint';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import { CheckPointDimensions } from '..';
import { LinkProps } from '../Link';


export interface CheckPointProps extends LinkProps {
    hasLink?: boolean
    isActive?: boolean
    checkPointDimensions?: CheckPointDimensions
    label: string | number
    markLabel: string | number
    iconName: string
    iconColor?: string
    labelStyle?: StyleProp<ViewStyle>
    iconStyle?: StyleProp<ViewStyle>
    containerStyle?: StyleProp<ViewStyle>
    linkContainerStyle?: StyleProp<ViewStyle>
    checkPointContainerStyle?: StyleProp<ViewStyle>
    renderCustomIcon?: (() => JSX.Element) | JSX.Element
    renderCustomLabel?: (() => JSX.Element) | JSX.Element
    onMarkLayout?: (e: LayoutChangeEvent) => void
    unActiveColor?: string
    activeColor?: string
}