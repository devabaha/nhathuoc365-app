import React from 'react';
import {
    StyleSheet, GestureResponderEvent
} from 'react-native';
import Animated from 'react-native-reanimated';
import { MainContentProps } from '.';
import Cell, { CellProps } from '../Cell';

const styles = StyleSheet.create({
    container: {
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    }
})

const MainContent: React.SFC<MainContentProps> = ({
    data,
    containerStyle,
    cellContainerStyle,
    renderCell,
    renderCellItem,
    cellDimensions,
    onCellPress = () => { },
    ...viewProps
}) => {

    function handleCellPress(cell: CellProps, cellIndex: number, row: Array<CellProps>, rowIndex: number, e: GestureResponderEvent) {
        onCellPress(cell, cellIndex, row, rowIndex, e);
        cell.onPress && cell.onPress(e);
    }

    function renderContent() {
        return data.map((row: Array<CellProps>, rowIndex: number) => {
            const rowContent = row.map((cell: CellProps, cellIndex: number) => {
                return renderCell
                    ? renderCell(cell, cellIndex, row, rowIndex)
                    : (
                        <Cell
                            key={cellIndex}
                            cellDimensions={cellDimensions}
                            {...cell}
                            onPress={(e: GestureResponderEvent) => handleCellPress(cell, cellIndex, row, rowIndex, e)}
                            containerStyle={[cellContainerStyle, cell.containerStyle]}
                            renderCellItem={
                                renderCellItem
                                    ? () => renderCellItem(cell, cellIndex, row, rowIndex)
                                    : undefined
                            }
                        />
                    )
            });

            return <Animated.View key={rowIndex} style={styles.row}>
                {rowContent}
            </Animated.View>
        })
    }

    return (
        <Animated.View
            style={[
                styles.container,
                containerStyle
            ]}
            {...viewProps}
        >
            {renderContent()}
        </Animated.View>
    );
}

function areEqual(prevProps: MainContentProps, nextProps: MainContentProps) {
    if (
        nextProps.data !== prevProps.data ||
        nextProps.cellDimensions !== prevProps.cellDimensions ||
        nextProps.containerStyle !== prevProps.containerStyle ||
        nextProps.cellContainerStyle !== prevProps.cellContainerStyle
    ) {
        return false;
    }
    return true;
}

export default React.memo(MainContent, areEqual);