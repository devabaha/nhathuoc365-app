import { ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeadingProps, HeadingItem, HeadingPosition } from './Heading';
import { CellProps, CellDimensions } from './Cell';
export { default } from './ScheduleTable';
import { PanGestureHandlerProperties } from 'react-native-gesture-handler';

export type Dimensions = {
    height: number, // default 100
    width: number// default 100
}

export type ScheduleTableStyle = StyleProp<ViewStyle> | Animated.AnimateStyle<any>;

export interface ScheduleTableProps {
    panGestureHandlerProps?: PanGestureHandlerProperties
    headingData: Array<HeadingProps>
    cellData: Array<Array<CellProps>>
    cellDimensions?: Dimensions,
    wrapperDimensions?: Dimensions,
    wrapperStyle?: ScheduleTableStyle,
    containerStyle?: ScheduleTableStyle,
    mainContentContainerStyle?: ScheduleTableStyle,
    renderHeadingItem?: (item: HeadingItem, index: number, position: HeadingPosition, cellDimensions: CellDimensions) => React.ReactNode
    renderHeading?: (item: HeadingItem, index: number, position: HeadingPosition, cellDimensions: CellDimensions) => React.ReactNode
    renderCellItem?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    renderCell?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    onHeadingPress?: (heading: HeadingItem, index: number, e: GestureResponderEvent) => void
    onCellPress?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number, e: GestureResponderEvent) => void
}