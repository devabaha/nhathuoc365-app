import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import Animated from 'react-native-reanimated';

import { CellProps } from '.';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const Cell: React.SFC<CellProps> = ({
    data,
    containerStyle,
    renderCell,
    renderCellItem,
    onPress,
    cellDimensions,
    ...touchableProps
}) => {

    function renderItem() {
        return renderCell
            ? renderCell(data)
            : (
                <TouchableOpacity
                    onPress={onPress}
                    {...touchableProps}
                    style={[
                        styles.container,
                        {
                            width: cellDimensions.width,
                            height: cellDimensions.height
                        },
                        touchableProps.style
                    ]}
                >
                    {renderCellItem
                        ? renderCellItem(data)
                        : <View style={styles.cell}>
                            <Text>{data}</Text>
                        </View>}
                </TouchableOpacity>
            )
    }

    return (
        <Animated.View style={[
            // {
            //     transform: [
            //         {
            //             translateX: config.translateX,
            //         }, 
            //         {
            //             translateY: config.translateY,
            //         }
            //     ]
            // },
            containerStyle
        ]}>
            {renderItem()}
        </Animated.View>
    );
}

export default Cell;