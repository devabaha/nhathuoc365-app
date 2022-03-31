import * as React from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { timing, useValue } from 'react-native-redash';

import { CheckPointProps } from '.';
import { DEFAULT_UNACTIVE_COLOR, DEFAULT_ACTIVE_COLOR, DEFAULT_ACTIVE_LINK_COLOR, DEFAULT_UNACTIVE_LINK_COLOR } from '../constants';
import Link from '../Link';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },
    checkPointContainer: {
        flex: 1,
        alignItems: 'center',
    },
    markPointContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: .5,
        borderColor: '#666',
        backgroundColor: '#fff',
        marginBottom: 10,
        overflow: 'hidden'
    },
    iconContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 15,
        color: '#fff'
    },
    label: {
        fontSize: 10,
        textAlign: 'center',
        color: '#333'
    },
    markLabel: {
        color: '#242424',
        textAlign: 'center'
    }
});
const { View, Text, useCode, set } = Animated;
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const CheckPoint: React.FunctionComponent<CheckPointProps> = ({
    hasLink = false,
    isActive: propIsActive = false,
    checkPointDimensions,
    label,
    markLabel,
    iconName,
    iconColor,
    labelStyle,
    iconStyle,
    containerStyle,
    checkPointContainerStyle,
    renderCustomIcon,
    renderCustomLabel,
    onMarkLayout,
    unActiveColor = DEFAULT_UNACTIVE_COLOR,
    activeColor = DEFAULT_ACTIVE_COLOR,

    linkContainerStyle,
    linkStyle,
    unActiveLinkColor = DEFAULT_UNACTIVE_LINK_COLOR,
    activeLinkColor = DEFAULT_ACTIVE_LINK_COLOR,
    maskLinkStyle
}) => {
    const [isActive, setActive] = React.useState(false);
    const [markDimensions, setMarkDimensions] = React.useState({ width: 0, height: 0 });
    const animatedActive = useValue(0);

    React.useEffect(() => {
        if (isActive !== propIsActive) {
            setActive(propIsActive)
        }
    }, [])

    React.useEffect(() => {
        setActive(propIsActive)
    }, [propIsActive])

    useCode(() => {
        return set(animatedActive,
            timing({
                from: animatedActive,
                to: isActive ? 1 : 0,
                easing: Easing.quad,
                duration: 500
            })
        );
    }, [isActive])

    function handleLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        onMarkLayout && onMarkLayout(e);
        setMarkDimensions({ width, height });
    }

    function renderIcon() {
        const animatedStyle = {
            backgroundColor: activeColor,
            opacity: animatedActive,
            transform: [{
                scale: animatedActive.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1.01]
                })
            }],
        }
        return (
            <View onLayout={handleLayout} style={[
                styles.markPointContainer,
                checkPointDimensions && checkPointDimensions,
                {
                    backgroundColor: unActiveColor,
                    borderRadius: markDimensions.width / 2,
                }
            ]}>
                {isActive
                    ? (renderCustomIcon
                        ? renderCustomIcon
                        : <View style={[
                            styles.iconContainer, {
                                borderRadius: markDimensions.width / 2
                            },
                            animatedStyle
                        ]}>
                            <AnimatedIcon
                                color={iconColor}
                                name={iconName}
                                style={[
                                    styles.icon,
                                    iconStyle
                                ]}
                            />
                        </View>)
                    : <Text style={styles.markLabel}>{markLabel}</Text>}
            </View>
        )
    }

    function renderLabel() {
        return (
            renderCustomLabel
                ? renderCustomLabel
                : <Text style={[styles.label, labelStyle]}>{label}</Text>
        )
    }

    return (
        <View
            style={[
                styles.container,
                {
                    opacity: markDimensions.width !== 0 ? 1 : 0
                },
                containerStyle
            ]}
        >
            {
                hasLink &&
                <Link
                    isActive={isActive}
                    containerStyle={[
                        { top: markDimensions.height / 2 },
                        linkContainerStyle
                    ]}
                    linkStyle={linkStyle}
                    maskLinkStyle={maskLinkStyle}
                    unActiveLinkColor={unActiveLinkColor}
                    activeLinkColor={activeLinkColor}
                />
            }
            <View style={[styles.checkPointContainer, checkPointContainerStyle]}>
                {renderIcon()}
                {renderLabel()}
            </View>
        </View>
    );
}

export default CheckPoint;