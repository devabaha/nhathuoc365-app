import React, { useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    LayoutChangeEvent,
    StatusBar
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { usePanGestureHandler, diffClamp, withDecay } from 'react-native-redash';

import Heading, { HeadingProps, HeadingPosition } from './Heading';
import MainContent from './MainContent';
import { ScheduleTableProps } from '.';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    }
})
const { width: appWidth, height: appHeight } = Dimensions.get('screen');

const ScheduleTable = ({
    panGestureHandlerProps,
    headingData,
    cellDimensions = { width: 100, height: 100 },
    wrapperDimensions = { width: appWidth, height: appHeight - (StatusBar.currentHeight || 0) },
    cellData,
    renderHeadingItem,
    renderHeading,
    renderCell,
    renderCellItem
}: ScheduleTableProps) => {
    const [headingLayout, setHeadingLayout] = useState({
        "top": { width: 0, height: 0 },
        "bottom": { width: 0, height: 0 },
        "right": { width: 0, height: 0 },
        "left": { width: 0, height: 0 },
    })
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [mainContentDimensions, setMainContentDimensions] = useState({ width: 0, height: 0 });
    const {
        gestureHandler,
        translation,
        velocity,
        state
    } = usePanGestureHandler();
    const translateX = diffClamp(withDecay({
        value: translation.x,
        velocity: velocity.x,
        state
    }), wrapperDimensions.width - mainContentDimensions.width - headingLayout.right.width - headingLayout.left.width, 0);
    const translateY = diffClamp(withDecay({
        value: translation.y,
        velocity: velocity.y,
        state
    }), wrapperDimensions.height - mainContentDimensions.height - headingLayout.top.height - headingLayout.bottom.height, 0);

    function getHeadingByPosition(position: HeadingPosition) {
        return headingData.find((heading: HeadingProps) =>
            (heading.position === position)
        );
    }

    function handleContainerLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        setContainerDimensions({ width, height });
    }

    function handleMainContentLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        setMainContentDimensions({ width, height });
    }

    function handleHeadingLayout(e: LayoutChangeEvent, position: HeadingPosition) {
        const { width, height } = e.nativeEvent.layout;
        setHeadingLayout({
            ...headingLayout,
            [position]: {
                width, height
            }
        });
    }

    function renderHeadingByPosition(position: HeadingPosition) {
        const heading = getHeadingByPosition(position);

        if (heading) {
            let headingCellStyle = {};
            let headingWrapperStyle = {};
            switch (position) {
                case "top":
                    headingCellStyle = { transform: [{ translateX }] };
                    headingWrapperStyle = {
                        zIndex: 4
                    };
                    break;
                case "bottom":
                    headingCellStyle = { transform: [{ translateX }] };
                    headingWrapperStyle = {
                        position: 'absolute',
                        top: Math.abs(wrapperDimensions.height - headingLayout.bottom.height),
                        zIndex: 2
                    };
                    break;
                case "left":
                    headingCellStyle = { transform: [{ translateY }] };
                    headingWrapperStyle = {
                        zIndex: 1
                    };
                    break;
                case "right":
                    headingCellStyle = { transform: [{ translateY }] };
                    headingWrapperStyle = {
                        position: 'absolute',
                        right: 0,
                        zIndex: 3
                    };
                    break;
            }

            return (
                <Heading
                    {...heading}
                    onLayout={e => handleHeadingLayout(e, position)}
                    wrapperStyle={[headingWrapperStyle, heading.wrapperStyle]}
                    cellContainerStyle={[headingCellStyle, heading.cellContainerStyle]}
                    cellDimensions={cellDimensions}
                    renderHeadingItem={renderHeadingItem}
                    renderHeading={renderHeading}
                />
            )
        } else {
            if (headingLayout[position].width !== 0 ||
                headingLayout[position].height !== 0) {
                setHeadingLayout({
                    ...headingLayout,
                    [position]: {
                        width: 0, height: 0
                    }
                })
            }
        }
    }


    return (
        <PanGestureHandler
            minDeltaX={5}
            minDeltaY={5}
            {...gestureHandler}
            {...panGestureHandlerProps}
        >
            <Animated.View onLayout={handleContainerLayout}>
                {renderHeadingByPosition("top")}
                <Animated.View
                    style={styles.container}
                >
                    {renderHeadingByPosition("left")}
                    <MainContent
                        onLayout={handleMainContentLayout}
                        data={cellData}
                        cellDimensions={cellDimensions}
                        cellContainerStyle={{ transform: [{ translateX, translateY }] }}
                        renderCellItem={renderCellItem}
                        renderCell={renderCell}
                    />
                    {renderHeadingByPosition("right")}
                </Animated.View>
                {renderHeadingByPosition("bottom")}
            </Animated.View>
        </PanGestureHandler>
    );
}

export default ScheduleTable;