import { Dimensions, ScheduleTableStyle } from '..';
import { ViewProps, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
export { default } from './Cell';

export type CellData = { value: any, wrapperStyle?: ScheduleTableStyle, style?: ScheduleTableStyle };
export type CellDimensions = Dimensions;

export interface CellProps extends ViewProps, TouchableOpacityProps {
    data: CellData
    containerStyle?: ScheduleTableStyle
    wrapperStyle?: ScheduleTableStyle
    cellDimensions: CellDimensions
    renderCell?: (data: CellData) => React.ReactNode
    renderCellItem?: (data: CellData) => React.ReactNode
    onPress?: (e: GestureResponderEvent) => void
}