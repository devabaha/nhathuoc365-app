import { ViewStyle } from 'react-native';
import { HeadingProps, HeadingItem } from './Heading';
import { CellProps } from './Cell';
export { default } from './ScheduleTable';

export type Dimensions = {
    height: number, // default 100
    width: number// default 100
}

export interface ScheduleTableProps {
    headingData: Array<HeadingProps>
    cellData: Array<Array<CellProps>>
    cellDimensions?: Dimensions,
    wrapperDimensions?: Dimensions,
    containerStyle?: ViewStyle,
    renderHeadingItem?: (item: HeadingItem, index: number) => React.ReactNode
    renderHeading?: (item: HeadingItem, index: number) => React.ReactNode
    renderCellItem?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
    renderCell?: (cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number) => React.ReactNode
}