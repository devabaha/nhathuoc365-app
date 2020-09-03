import { ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeadingProps, HeadingItem } from './Heading';
import { CellProps } from './Cell';
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
    containerStyle?: ScheduleTableStyle,
    renderHeadingItem?: (item: HeadingItem, index: number) => React.ReactNode
    renderHeading?: (item: HeadingItem, index: number) => React.ReactNode
    renderCellItem?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    renderCell?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
}