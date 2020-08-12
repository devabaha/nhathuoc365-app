import React, { MutableRefObject, useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Dimensions,
    LayoutChangeEvent,
    View
} from 'react-native';
import { useValues, timing as timingRedash, delay, transformOrigin, useClocks, TimingParams } from 'react-native-redash';
import Animated, {
    Easing,
    useCode,
    block,
    cond,
    set,
    not,
    call,
    startClock,
    stopClock,
    clockRunning,
    timing,
    eq,
    concat
} from 'react-native-reanimated';
import AwesomeComboItem from './AwesomeComboItem';

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        zIndex: 999,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        // @ts-ignore
        ...elevationShadowStyle(10),
    },
    mainContent: {
        borderRadius: 8,
        padding: 7,
        overflow: 'hidden'
    }
})
const PADDING_STANDARD = 15;
const { Value } = Animated;

type AwesomeComboItem = {
    title: string,
}
type AwesomeComboPosition = {
    x: number,
    y: number
}
type AwesomeComboProps = {
    data: Array<AwesomeComboItem>,
    show: boolean,
    parentRef: MutableRefObject<any>,
    position: AwesomeComboPosition,
    onSelect: (item: AwesomeComboItem) => void
}

function runTiming(clock: Animated.Clock, duration: number, from: Animated.Value<any>, toValue: number) {
    const state = {
        finished: new Value(0),
        position: from,
        time: new Value(0),
        frameTime: new Value(0),
    };

    const config = {
        toValue: new Value(toValue),
        duration,
        easing: Easing.inOut(Easing.ease),
    };

    return block([
        timing(clock, state, config),
        cond(eq(state.finished, 1), stopClock(clock)),
        state.position
    ])
}


function AwesomeCombo({
    data,
    show = false,
    parentRef,
    position = { x: 0, y: 0 },
    onSelect
}: AwesomeComboProps) {
    const refAwesomeCombo = useRef<any>();
    const [containerPosition, setContainerPosition] = useState(position);
    const [
        animatedOpacity,
        animatedHeight,
        aniamtedTranslateX,
        isShow
    ] = useValues(0, 0, -5, 0);

    const [opacityClock, heightClock] = useClocks(2);

    useCode(
        () => block([
            set(isShow, show ? 1 : 0),
            call([animatedHeight], ([a]) => console.log(a))
        ]),
        [show]
    );

    useCode(() =>
        block([
            startClock(opacityClock),
            set(animatedOpacity, runTiming(
                opacityClock,
                200,
                animatedOpacity,
                show ? 1 : 0
            ))
        ]), [show]);

    useCode(() => block([
        startClock(heightClock),
        set(animatedHeight,
            runTiming(
                heightClock,
                300,
                animatedHeight,
                show ? 100 : 0
            ),
        )
    ]), [show]);

    function renderItem(item: AwesomeComboItem, index: number) {
        return <AwesomeComboItem
            title={item.title}
            last={index === data.length - 1}
            onPress={() => onSelect(item)}
        />
    }

    function onContainerLayout(e: LayoutChangeEvent) {
        const { x, y, width: containerWidth, height: containerHeight } = e.nativeEvent.layout;
        // const { x: parentX, y: parentY } = this.props.position;
        const { width: appWidth, height: appHeight } = Dimensions.get('window');

        if (parentRef.current) {
            parentRef.current.measure((
                x: number,
                y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number) => {

                if (pageX + containerWidth > appWidth - PADDING_STANDARD) {
                    setContainerPosition({
                        x: pageX - (containerWidth - (appWidth - pageX)) - PADDING_STANDARD,
                        y: pageY + height + PADDING_STANDARD
                    })
                }
            })
        }
    }

    return (
        <View
            pointerEvents="box-none"
            onLayout={onContainerLayout}
            style={[styles.wrapper, {
                left: containerPosition.x,
                top: containerPosition.y,
            }]}>
            <Animated.View
                pointerEvents="box-none"
                style={[styles.container, {
                    opacity: animatedOpacity,
                    transform: [{ translateX: aniamtedTranslateX }]
                }]}>
                <Animated.View style={[styles.mainContent, {
                    height: concat(animatedHeight, '%')
                }]}>
                    {data.map((item: AwesomeComboItem, index: number) =>
                        renderItem(item, index)
                    )}
                </Animated.View>
            </Animated.View>
        </View>
    )
}

export default AwesomeCombo;

