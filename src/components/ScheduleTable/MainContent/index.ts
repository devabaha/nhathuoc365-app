import { CellProps, CellDimensions } from '../Cell';
import { ViewProps, ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
export { default } from './MainContent';

export interface MainContentProps extends ViewProps {
    data: Array<Array<CellProps>>
    cellDimensions: CellDimensions
    containerStyle?: StyleProp<ViewStyle> | Animated.AnimateStyle<any>
    renderCell?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    renderCellItem?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
}