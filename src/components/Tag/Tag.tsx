import React, { useEffect, useRef, useState } from 'react'
import { TagProps } from './index';
import { StyleSheet, Text, Animated as RNAnimated, Easing as RNEasing } from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import Animated, { useValue, Easing } from 'react-native-reanimated';
import appConfig from 'app-config';
import { svgPathProperties } from "svg-path-properties";
import AnimatedPath from 'react-native-svg-animations/components/AnimatedPath';

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        // transform: [{ rotate: '5deg' }],

    },
    svgContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        top: 0,
    },
    textContainer: {
        alignSelf: 'flex-start',
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 12,
        color: '#fff',
        letterSpacing: 1,
        fontWeight: 'bold',
    }
})

const Tag = ({
    fill,
    strokeColor,
    label = "",
    strokeWidth: propsStrokeWidth = 0,
    containerStyle = {},
    labelContainerStyle = {},
    labelStyle = {},
    animate = false
}: TagProps) => {
    let counter = 0;
    let refPath = null;
    const PathComponent = animate ? AnimatedPath : Path;

    const [padding, setPadding] = useState(5);
    const [containerHeight, setContainerHeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [tailWidth, setTailWidth] = useState(0);
    const [radius, setRadius] = useState(4);
    const [strokeWidth, setStrokeWidth] = useState(propsStrokeWidth);

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [holeR, setHoleR] = useState(0);
    const [startHoleX, setStartHoleX] = useState(startX + tailWidth / 1.618 + holeR);
    const [startHoleY, setStartHoleY] = useState(startY);


    const renders = useRef(0);
    const animated = useValue(0);

    const [properties, setProperties] = useState("");
    const [pathLength, setPathLength] = useState(0);
    const strokeDashoffset = new RNAnimated.Value(animate ? pathLength: 0);

    const animatedPaddingLeft = useValue(animate ? 0: 1);

    useEffect(() => {
        animate && animateStroke();
    }, []);

    const animateStroke = () => {
        strokeDashoffset.setValue(pathLength);
        const animationsSequence = [
            RNAnimated.timing(strokeDashoffset, {
                toValue: 0,
                duration: 200,
                easing: RNEasing.quad,
                useNativeDriver: true
            }),
        ]

        RNAnimated.sequence(animationsSequence).start(() => {

        });
    };

    const handleLayoutText = (e) => {
        if(!animate) return;
        const { x, y, width, height } = e.nativeEvent.layout;
        // const tailWidth = .5 * width;
        const tailWidth = 20;
        const startX = x - tailWidth;
        const startY = y + height / 2;
        const strokeWidth = .03 * height;
        const holeR = .1 * height;
        const startHoleX = startX + tailWidth * .618 + holeR;
        const containerHeight = height + strokeWidth * 2;
        const radius = .2 * tailWidth;


        // setStrokeWidth(strokeWidth);
        setStartHoleX(startHoleX);
        setStartHoleY(startY);
        setHoleR(holeR);
        setRadius(radius)

        setStartY(startY);
        setStartX(startX);

        setTailWidth(tailWidth);
        setWidth(width + tailWidth);
        setHeight(height);
        setContainerHeight(containerHeight);

        const svgPath = new svgPathProperties(getPath());
        const pathLength = svgPath.getTotalLength();

        setProperties(svgPath);
        setPathLength(pathLength);
        strokeDashoffset.setValue(pathLength);

        if (!renders.current) {
            renders.current++;
            setTimeout(() =>Animated.timing(animatedPaddingLeft, {
                toValue: 1,
                duration: 200,
                easing: Easing.quad,
            }).start());
        }
    }

    const getPath = () => {
        // q${-tailWidth} ${-height / 2} ${0} ${-height} 
        // c${-tailWidth - radius} 0 ${-tailWidth - radius} ${-height} 0 ${-height}
        const controlPointX = tailWidth - radius;
        return `
        M${startX + tailWidth} ${startY + height / 2}
        c${-radius * 2} 0 ${-controlPointX} ${-radius * 2} ${-controlPointX} ${-height / 2} s${controlPointX - radius * 2} ${-height / 2} ${controlPointX} ${-height / 2}
        H${startX + width - radius} 
        q${radius} ${0} ${radius} ${radius} 
        V${startY + height / 2 - radius} 
        q${0} ${radius} ${-radius} ${radius} 
        H${(startX + tailWidth)} 
        M${startHoleX + holeR} ${startHoleY} 
        A${holeR} ${holeR} 0 0 0 ${startHoleX - holeR} ${startHoleY} 
        A${holeR} ${holeR} 0 0 0 ${startHoleX + holeR} ${startHoleY}
         `
    }

    return (
        <Animated.View style={[styles.container, {
            paddingLeft: tailWidth,
            opacity: animatedPaddingLeft,
        }, containerStyle]}>
            {!!height && !!width &&
                <Svg width={width + strokeWidth * 2} height="100%" style={[styles.svgContainer]}>
                    <Defs>
                        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={appConfig.colors.status.info} stopOpacity="1" />
                            <Stop offset="60%" stopColor={appConfig.colors.status.danger} stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    <PathComponent
                        // ref={inst => refPath = inst}
                        fill={fill || "url(#grad)"}
                        stroke={strokeColor || "url(#grad)"}
                        strokeColor={strokeColor || "url(#grad)"}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // vectorEffect="non-scaling-stroke"
                        d={getPath()}
                        strokeDasharray={[pathLength, pathLength]}
                        strokeDashoffset={strokeDashoffset}
                        loop={false}
                    />
                </Svg>
            }
            {!!label &&
                <Animated.View onLayout={handleLayoutText} style={[styles.textContainer, {
                    paddingRight: padding * 1.5,
                    paddingLeft: animate ? padding: padding*1.5,
                    paddingVertical: padding,
                    marginVertical: strokeWidth * 2,
                    backgroundColor: animate ? 'transparent': fill,
                    borderRadius: animate? 0: radius
                }, labelContainerStyle]}>
                    {/* <Text>{renders.current++}</Text> */}
                    <Text style={[styles.text, labelStyle]}>{label}</Text>
                </Animated.View>}
        </Animated.View>
    );
}

const areEquals = (prev: TagProps, next: TagProps) => {
    const areEquals = prev.fill === next.fill ||
        prev.strokeColor === next.strokeColor ||
        prev.containerStyle === next.containerStyle ||
        prev.label === next.label ||
        prev.labelContainerStyle === next.labelContainerStyle ||
        prev.labelStyle === next.labelStyle ||
        prev.strokeWidth === next.strokeWidth;
    return areEquals
}


Tag.defaultProps = {
    strokeColor: '#333',
    fill: appConfig.colors.primary,
    strokeWidth: 1,
    animate: true
}

export default React.memo(Tag, areEquals);