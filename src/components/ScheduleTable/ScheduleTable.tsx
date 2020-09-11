import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Dimensions,
    LayoutChangeEvent,
    StatusBar
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { block, set, call, useCode, cond, eq } from 'react-native-reanimated';
import { useValue, useValues, usePanGestureHandler, diffClamp, withDecay, timing } from 'react-native-redash';

import Heading, { HeadingProps, HeadingPosition } from './Heading';
import MainContent from './MainContent';
import { ScheduleTableProps } from '.';

import Loading from '../Loading';


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
    headingData = [],
    cellDimensions = { width: 100, height: 100 },
    wrapperDimensions: propsWrapperDimensions,
    cellData = [],
    renderHeadingItem,
    renderHeading,
    renderCell,
    renderCellItem,
    renderLoading,
    containerStyle,
    wrapperStyle,
    mainContentContainerStyle,
    onHeadingPress = () => { },
    onCellPress = () => { },
}: ScheduleTableProps) => {
    let refContainer = useRef();
    const [headingLayout, setHeadingLayout] = useState({
        "top": { width: 0, height: 0 },
        "bottom": { width: 0, height: 0 },
        "right": { width: 0, height: 0 },
        "left": { width: 0, height: 0 },
    })
    const [isLoading, setLoading] = useState(true);
    const [isShowingUp, setShowingUp] = useState(false);

    const [wrapperDimensions, setWrapperDimensions] = useState({ width: appWidth, height: appHeight - (StatusBar.currentHeight || 0) });
    const [wrapperOffset, setWrapperOffset] = useState({ x: 0, y: 0 });
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [mainContentWrapperDimensions, setMainContentWrapperDimensions] = useState({ width: 0, height: 0 });
    const [mainContentDimensions, setMainContentDimensions] = useState({ width: 0, height: 0 });

    const showingUpAnimated = useValue(0);
    const {
        gestureHandler,
        translation: { x, y },
        velocity: { x: vx, y: vy },
        state
    } = usePanGestureHandler();
    // const [x, y, vx, vy, state] = useValues(0, 0, 0, 0, State.UNDETERMINED);
    const translateX = diffClamp(withDecay({
        value: x,
        velocity: vx,
        state
    }), wrapperDimensions.width - mainContentDimensions.width - headingLayout.right.width - headingLayout.left.width, 0);
    const translateY = diffClamp(withDecay({
        value: y,
        velocity: vy,
        state
    }), getLowBoundingTranslateY(), 0);

    function getLowBoundingTranslateY() {
        const diffComponentWithAppHeight =
            wrapperDimensions.height - mainContentDimensions.height >= 0
                ? 0
                : wrapperDimensions.height - mainContentDimensions.height - headingLayout.top.height;
        return diffComponentWithAppHeight - headingLayout.bottom.height
    }

    useCode(() => {
        return block([
            set(state, State.ACTIVE),
            set(x, 0),
            set(y, 0),
        ])
    }, [cellData]);

    useCode(() => {
        return !isLoading && set(showingUpAnimated, timing({
            from: 0,
            to: 1,
            duration: 300,
        }))
    }, [isLoading]);

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
        if (width !== wrapperDimensions.width || height !== wrapperDimensions.height) {
            if (refContainer.current) {
                //@ts-ignore
                refContainer.current.getNode().measure((x, y, width, height) => {
                    setWrapperOffset({ x, y });
                    setTimeout(() => {
                        setLoading(false);
                    }, 200);
                })
            }
            console.log('wrapperLayout', width, height);
            setWrapperDimensions({ width, height });
        }
    }

    function handleContainerLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        if (width !== containerDimensions.width || height !== containerDimensions.height) {
            console.log('containerLayout', width, height);
            setContainerDimensions({ width, height });
        }
    }

    function handleMainContentWrapperLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        if (width !== mainContentDimensions.width || height !== mainContentDimensions.height) {
            console.log('mainContentWrapperLayout', width, height);
            setMainContentWrapperDimensions({ width, height });
        }
    }

    function handleMainContentLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        if (width !== mainContentDimensions.width || height !== mainContentDimensions.height) {
            console.log('mainContentLayout', width, height);
            setMainContentDimensions({ width, height });
        }
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
                        zIndex: 2,
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
        // console.log(mainContentDimensions.height, wrapperOffset.y, appHeight)
        return {
            /** flex: 
             * 1 - for list has content's height crossing the screen area 
             * undefined - for list has content's height inside the screen area
            */
            flex: mainContentDimensions.height + wrapperOffset.y + headingLayout.top.height > appHeight ? 1 : undefined,

            /** alignSelf:
             * `auto` - for list has content's width crossing the screen area
             * `flex-start` - for list has content's width inside the screen area
            */
            alignSelf: mainContentDimensions.width + wrapperOffset.x + headingLayout.left.width > appWidth ? 'auto' : 'flex-start'
        }
    }

    const handlePan = Animated.event(
        [{
            nativeEvent: {
                translationX: x,
                translationY: y,
                velocityX: vx,
                velocityY: vy,
                state,
            },
        }],
        { useNativeDriver: true },
    )
    // Animated.event([{
    //     nativeEvent: ({ translationX, translationY, state, velocityX, velocityY }) => {
    //         return block([set(x, translateX),
    //         set(y, translateY),
    //         set(vx, velocityX),
    //         set(vy, velocityY),
    //         set(state, state)
    //         ])
    //     }
    // }], { useNativeDriver: true })

    return (
        <>
            {isLoading && (renderLoading
                ? renderLoading()
                : <Loading center />)
            }
            <Animated.View
                //@ts-ignore
                ref={refContainer}
                onLayout={handleWrapperLayout}
                style={[
                    styles.wrapper,
                    getCoreStyleByWrapperDimensions(), wrapperStyle]}
            >

                <PanGestureHandler
                    enabled={!isLoading}
                    minDeltaX={30}
                    minDeltaY={30}
                    {...gestureHandler}
                    // onGestureEvent={handlePan}
                    // onHandlerStateChange={handlePan}
                    {...panGestureHandlerProps}
                >
                    <Animated.View
                        style={[{
                            transform: [
                                {
                                    translateY: showingUpAnimated.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [200, 0]
                                    })
                                }
                            ],
                            opacity: showingUpAnimated.interpolate({
                                inputRange: [0.7, 1],
                                outputRange: [0.3, 1]
                            })
                        }, getCoreStyleByWrapperDimensions(), containerStyle]}
                        onLayout={handleContainerLayout}
                    >
                        {renderHeadingByPosition("top")}
                        <Animated.View
                            style={[styles.container]}
                        // onLayout={handleMainContentWrapperLayout}
                        >
                            {renderHeadingByPosition("left")}
                            <Animated.View style={
                                {
                                    transform: [{
                                        translateX,
                                        translateY
                                    }]
                                }}>
                                <MainContent
                                    onCellPress={onCellPress}
                                    onLayout={handleMainContentLayout}
                                    data={cellData}
                                    cellDimensions={cellDimensions}
                                    // cellContainerStyle={{
                                    //     transform: [{
                                    //         translateX,
                                    //         translateY
                                    //     }]
                                    // }}
                                    renderCellItem={renderCellItem}
                                    renderCell={renderCell}
                                    containerStyle={mainContentContainerStyle}
                                />
                            </Animated.View>
                            {renderHeadingByPosition("right")}
                        </Animated.View>
                        {renderHeadingByPosition("bottom")}
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View >
        </>
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