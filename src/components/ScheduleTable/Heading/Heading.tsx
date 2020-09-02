import React from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle
} from 'react-native';
import Animated from 'react-native-reanimated';
import { HeadingProps, HeadingItem } from '.';
import Cell from '../Cell';

const styles = StyleSheet.create({
    container: {

    }
})

const Heading: React.SFC<HeadingProps> = ({
    data,
    position,
    cellDimensions,
    containerStyle,
    cellContainerStyle,
    cellStyle,
    renderHeadingItem,
    renderHeading,
    cellsProps = {},
    ...viewProps
}) => {

    function getHeadingMainStyle() {
        let mainStyle: StyleProp<ViewStyle> = {};
        switch (position) {
            case "top":
            case "bottom":
                mainStyle = { flexDirection: 'row' };
                break;
            case "left":
            case "right":
                mainStyle = { flexDirection: 'column' };
        }
        return mainStyle;
    }

    function renderItem() {
        return data.map((item: HeadingItem, index: number) => {
            return renderHeading
                ? renderHeading(item, index)
                : (
                    <Cell
                        key={index}
                        data={item}
                        cellDimensions={cellDimensions}
                        {...cellsProps}
                        containerStyle={[cellContainerStyle, cellsProps.containerStyle]}
                        style={[cellStyle, cellsProps.style]}
                        renderCellItem={
                            renderHeadingItem
                                ? () => renderHeadingItem(item, index)
                                : undefined}
                    />
                )
        })
    }

    return (
        <Animated.View
            {...viewProps}
            style={[
                getHeadingMainStyle(),
                containerStyle,
            ]}>
            {renderItem()}
        </Animated.View>
    );
}

export default Heading;