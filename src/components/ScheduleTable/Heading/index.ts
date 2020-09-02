import { CellProps, CellDimensions } from '../Cell';
import {
    ViewStyle,
    ViewProps,
    StyleProp
} from 'react-native';
export { default } from './Heading';

export const HeadingPositionCONST = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom'
}

export type HeadingPosition =
    "top" |
    'left' |
    'bottom' |
    'right';

export type HeadingItem = any

export interface HeadingProps extends ViewProps {
    data: Array<HeadingItem>
    position: HeadingPosition
    cellDimensions: CellDimensions
    cellContainerStyle?: StyleProp<ViewStyle>
    containerStyle?: StyleProp<ViewStyle>
    cellStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ViewStyle>
    renderHeadingItem?: (item: HeadingItem, index: number) => React.ReactNode
    renderHeading?: (item: HeadingItem, index: number) => React.ReactNode
    cellsProps?: CellProps
}