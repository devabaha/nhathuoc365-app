import React, { useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    LayoutChangeEvent
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
    headingData,
    cellDimensions = { width: 100, height: 100 },
    wrapperDimensions = { width: appWidth, height: appHeight },
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
            let headingStyle = {};
            switch (position) {
                case "top":
                    headingStyle = { transform: [{ translateX }], zIndex: 4 }
                    break;
                case "bottom":
                    headingStyle = {
                        postion: 'absolute',
                        bottom: Math.abs(wrapperDimensions.height - containerDimensions.height),
                        transform: [{ translateX }],
                        zIndex: 2
                    }
                    break;
                case "left":
                    headingStyle = { transform: [{ translateY }], zIndex: 1, backgroundColor: 'red' }
                    break;
                case "right":
                    headingStyle = {
                        position: 'absolute',
                        right: 0,
                        transform: [{ translateY }],
                        zindex: 3
                    }
                    break;
            }

            return (
                <Heading
                    {...heading}
                    onLayout={e => handleHeadingLayout(e, position)}
                    containerStyle={[heading.containerStyle, headingStyle]}
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
        <PanGestureHandler {...gestureHandler}>
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
                        containerStyle={{ transform: [{ translateX, translateY }] }}
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