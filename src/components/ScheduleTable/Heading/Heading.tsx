import React from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    GestureResponderEvent
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
    wrapperStyle,
    containerStyle,
    cellContainerStyle,
    cellStyle,
    renderHeadingItem,
    renderHeading,
    cellsProps = { onPress: () => { } },
    onHeadingPress = () => { },
    ...viewProps
}) => {

    function handlePressCell(heading: HeadingItem, index: number, e: GestureResponderEvent) {
        onHeadingPress(heading, index, e);
        cellsProps.onPress(e);
    }

    function isMultiHeadingData() {
        return Array.isArray(data) && Array.isArray(data[0]);
    }

    function getHeadingMainStyle() {
        let mainStyle: StyleProp<ViewStyle> = {};
        switch (position) {
            case "top":
            case "bottom":
                mainStyle = { flexDirection: isMultiHeadingData() ? 'column' : 'row' };
                break;
            case "left":
            case "right":
                mainStyle = { flexDirection: isMultiHeadingData() ? 'row' : 'column' };
        }
        return mainStyle;
    }

    function renderHeadingCell(item: HeadingItem, index: number) {
        return renderHeading
            ? renderHeading(item, index, position, cellDimensions)
            : (
                <Cell
                    key={index}
                    data={item}
                    cellDimensions={cellDimensions}
                    {...cellsProps}
                    {...item.cellProps}
                    onPress={(e: GestureResponderEvent) => handlePressCell(item, index, e)}
                    containerStyle={[cellContainerStyle, cellsProps.containerStyle, item.cellProps && item.cellProps.containerStyle]}
                    style={[cellStyle, cellsProps.style, item.style, item.cellProps && item.cellProps.style]}
                    renderCellItem={
                        renderHeadingItem
                            ? () => renderHeadingItem(item, index, position, cellDimensions)
                            : undefined}
                />
            )
    }

    function renderGroupHeading(groupHeading: Array<Array<HeadingItem>>) {
        let headingGroupStyle = {};
        switch (position) {
            case "top":
            case "bottom":
                headingGroupStyle = { flexDirection: 'row' };
                break;
            case "left":
            case "right":
                headingGroupStyle = { flexDirection: 'column' };
        }

        return groupHeading.map((heading: Array<HeadingItem>, headingIndex: number) => {
            return (
                <Animated.View
                    key={headingIndex}
                    style={[
                        headingGroupStyle,
                        containerStyle,
                    ]}>
                    {renderSingleHeading(heading)}
                </Animated.View>
            )
        })
    }

    function renderSingleHeading(heading: Array<HeadingItem>) {
        return heading.map((item: HeadingItem, index: number) => {
            return renderHeadingCell(item, index)
        })
    }

    function renderItem() {
        if (isMultiHeadingData()) {
            //@ts-ignore
            return renderGroupHeading(data);
        } else {
            //@ts-ignore
            return renderSingleHeading(data);
        }
    }

    return (
        <Animated.View
            {...viewProps}
            style={[
                getHeadingMainStyle(),
                wrapperStyle
            ]}>
            {renderItem()}
        </Animated.View>
    );
}

export default Heading;