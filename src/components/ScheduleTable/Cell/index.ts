import { Dimensions } from '..';
import { ViewProps, ViewStyle, StyleProp, TouchableOpacityProps, GestureResponderEvent } from 'react-native';
export { default } from './Cell';

export type CellData = any;
export type CellDimensions = Dimensions;

export interface CellProps extends ViewProps, TouchableOpacityProps {
    data: CellData
    containerStyle?: StyleProp<ViewStyle>
    cellDimensions: CellDimensions
    renderCell?: (data: CellData) => React.ReactNode
    renderCellItem?: (data: CellData) => React.ReactNode
    onPress?: (e: GestureResponderEvent) => void
}