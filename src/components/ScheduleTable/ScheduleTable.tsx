import React, { useState, useEffect } from 'react';
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
    wrapper: {
        overflow: 'hidden'
    },
    container: {
        flexDirection: 'row',
    }
})
const { width: appWidth, height: appHeight } = Dimensions.get('screen');

const ScheduleTable = ({
    panGestureHandlerProps,
    headingData,
    cellDimensions = { width: 100, height: 100 },
    wrapperDimensions: propsWrapperDimensions,
    cellData,
    renderHeadingItem,
    renderHeading,
    renderCell,
    renderCellItem,
    containerStyle,
    wrapperStyle,
    mainContentContainerStyle,
    onHeadingPress = () => { },
    onCellPress = () => { },
}: ScheduleTableProps) => {
    const [headingLayout, setHeadingLayout] = useState({
        "top": { width: 0, height: 0 },
        "bottom": { width: 0, height: 0 },
        "right": { width: 0, height: 0 },
        "left": { width: 0, height: 0 },
    })
    const [wrapperDimensions, setWrapperDimensions] = useState({ width: appWidth, height: appHeight - (StatusBar.currentHeight || 0) });
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [mainContentWrapperDimensions, setMainContentWrapperDimensions] = useState({ width: 0, height: 0 });
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
    }), getLowBoundingTranslateY(), 0);

    function getLowBoundingTranslateY() {
        const diffComponentWithAppHeight =
            wrapperDimensions.height - mainContentDimensions.height >= 0
                ? 0
                : wrapperDimensions.height - mainContentDimensions.height - headingLayout.top.height;
        return diffComponentWithAppHeight - headingLayout.bottom.height
    }

    useEffect(() => {
        if (propsWrapperDimensions) {
            let updateable = false;
            const newWrapperDimensions = { ...wrapperDimensions };
            if (propsWrapperDimensions.width &&
                propsWrapperDimensions.width !== wrapperDimensions.width) {
                newWrapperDimensions.width = propsWrapperDimensions.width;
                updateable = true;
            }
            if (propsWrapperDimensions.height &&
                propsWrapperDimensions.height !== wrapperDimensions.height) {
                newWrapperDimensions.height = propsWrapperDimensions.height;
                updateable = true;

            }
            updateable && setWrapperDimensions(newWrapperDimensions);
        }
    }, [propsWrapperDimensions]);

    function getHeadingByPosition(position: HeadingPosition) {
        return headingData.find((heading: HeadingProps) =>
            (heading.position === position)
        );
    }

    function handleWrapperLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        // console.log('wrapperLayout', width, height);
        setWrapperDimensions({ width, height });
    }

    function handleContainerLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        // console.log('containerLayout', width, height);
        setContainerDimensions({ width, height });
    }

    function handleMainContentWrapperLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        // console.log('mainContentWrapperLayout', width, height);
        setMainContentWrapperDimensions({ width, height });
    }

    function handleMainContentLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        // console.log('mainContentLayout', width, height);
        setMainContentDimensions({ width, height });
    }

    function handleHeadingLayout(e: LayoutChangeEvent, position: HeadingPosition) {
        const { width, height } = e.nativeEvent.layout;
        // console.log('headingLayout', width, height);
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
                        bottom: 0,
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
                    onHeadingPress={onHeadingPress}
                    onLayout={e => handleHeadingLayout(e, position)}
                    wrapperStyle={[headingWrapperStyle, heading.wrapperStyle]}
                    cellContainerStyle={[headingCellStyle, heading.cellContainerStyle]}
                    cellDimensions={cellDimensions}
                    renderHeadingItem={renderHeadingItem}
                    renderHeading={renderHeading}
                />
            )
        } else {
            /** Reset heading layout for disapeared heading */
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

    /** [MUST HAVE STYLE] for content to be scrollable correctly */
    function getCoreStyleByWrapperDimensions() {
        // console.log(wrapperDimensions.height)
        return {
            flex: mainContentDimensions.height > appHeight ? 1 : undefined
        }
    }

    return (
        <Animated.View
            onLayout={handleWrapperLayout}
            style={[styles.wrapper, getCoreStyleByWrapperDimensions(), wrapperStyle]}
        >
            <PanGestureHandler
                minDeltaX={5}
                minDeltaY={5}
                {...gestureHandler}
                {...panGestureHandlerProps}
            >
                <Animated.View
                    style={[getCoreStyleByWrapperDimensions(), containerStyle]}
                    onLayout={handleContainerLayout}
                >
                    {renderHeadingByPosition("top")}
                    <Animated.View
                        style={styles.container}
                        onLayout={handleMainContentWrapperLayout}
                    >
                        {renderHeadingByPosition("left")}
                        <MainContent
                            onCellPress={onCellPress}
                            onLayout={handleMainContentLayout}
                            data={cellData}
                            cellDimensions={cellDimensions}
                            cellContainerStyle={{ transform: [{ translateX, translateY }] }}
                            renderCellItem={renderCellItem}
                            renderCell={renderCell}
                            containerStyle={mainContentContainerStyle}
                        />
                        {renderHeadingByPosition("right")}
                    </Animated.View>
                    {renderHeadingByPosition("bottom")}
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
}

function areEqual(prevProps: ScheduleTableProps, nextProps: ScheduleTableProps) {
    if (nextProps.cellData !== prevProps.cellData ||
        nextProps.cellDimensions !== prevProps.cellDimensions ||
        nextProps.headingData !== prevProps.headingData ||
        nextProps.mainContentContainerStyle !== prevProps.mainContentContainerStyle ||
        nextProps.containerStyle !== prevProps.containerStyle ||
        nextProps.wrapperStyle !== prevProps.wrapperStyle ||
        nextProps.wrapperDimensions !== prevProps.wrapperDimensions
    ) {
        return false;
    }
    return true;
}

export default React.memo(ScheduleTable, areEqual);