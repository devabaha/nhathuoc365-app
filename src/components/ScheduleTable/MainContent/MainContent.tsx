import React, { } from 'react';
import {
    View,
    StyleSheet
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
    renderCell,
    renderCellItem,
    cellDimensions,
    ...viewProps
}) => {

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

export default MainContent;