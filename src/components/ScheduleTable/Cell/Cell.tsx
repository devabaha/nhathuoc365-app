import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { CellProps } from '.';

const styles = StyleSheet.create({
    container: {
    },
    cellWrapper: {
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const Cell: React.SFC<CellProps> = ({
    data,
    containerStyle,
    renderCell,
    renderCellItem,
    wrapperStyle,
    onPress,
    cellDimensions,
    ...touchableProps
}) => {

    function renderItem() {
        return renderCell
            ? renderCell(data)
            : (
                <Animated.View style={[styles.cellWrapper, wrapperStyle, data.wrapperStyle]}>
                    <TouchableOpacity
                        onPress={onPress}
                        {...touchableProps}
                        style={[
                            styles.container,
                            {
                                width: cellDimensions.width,
                                height: cellDimensions.height
                            },
                            touchableProps.style,
                            data.style
                        ]}
                    >
                        {renderCellItem
                            ? renderCellItem(data)
                            : <View style={styles.cell}>
                                <Text>{data.value}</Text>
                            </View>}
                    </TouchableOpacity>
                </Animated.View>
            )
    }

    return (
        <Animated.View style={[
            containerStyle
        ]}>
            {renderItem()}
        </Animated.View>
    );
}

export default Cell;