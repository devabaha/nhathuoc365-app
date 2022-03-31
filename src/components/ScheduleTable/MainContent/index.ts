import { CellProps, CellDimensions } from '../Cell';
import { ScheduleTableStyle } from '..';
import { ViewProps, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
export { default } from './MainContent';

export interface MainContentProps extends ViewProps {
    data: Array<Array<CellProps>>
    cellDimensions: CellDimensions
    containerStyle?: ScheduleTableStyle
    cellContainerStyle?: ScheduleTableStyle
    renderCell?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    renderCellItem?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    onCellPress?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number, e: GestureResponderEvent) => void
}