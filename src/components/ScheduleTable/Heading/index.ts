import { CellProps, CellDimensions } from '../Cell';
import { ScheduleTableStyle } from '..';
import {
    ViewStyle,
    ViewProps,
    StyleProp,
    GestureResponderEvent
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

export type HeadingItem = {
    value: any,
    style?: ScheduleTableStyle
    cellProps?: CellProps
}

export interface HeadingProps extends ViewProps {
    data: Array<Array<HeadingItem>> | Array<HeadingItem>
    position: HeadingPosition
    cellDimensions: CellDimensions
    wrapperStyle?: ScheduleTableStyle
    containerStyle?: ScheduleTableStyle
    cellContainerStyle?: ScheduleTableStyle
    cellStyle?: ScheduleTableStyle
    style?: ScheduleTableStyle
    renderHeadingItem?: (item: HeadingItem, index: number, position: HeadingPosition, cellDimensions: CellDimensions) => React.ReactNode
    renderHeading?: (item: HeadingItem, index: number, position: HeadingPosition, cellDimensions: CellDimensions) => React.ReactNode
    cellsProps?: CellProps
    onHeadingPress?: (heading: HeadingItem, index: number, e: GestureResponderEvent) => void
}