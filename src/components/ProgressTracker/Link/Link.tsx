import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

import { LinkProps } from '.';
import { timing, useValue } from 'react-native-redash/lib/module/v1';
import { DEFAULT_UNACTIVE_LINK_COLOR, DEFAULT_ACTIVE_LINK_COLOR } from '../constants';

const styles = StyleSheet.create({
    container: {
        height: 2,
        flex: 1,
        overflow: 'hidden',
    },
    link: {
        flex: 1,
        zIndex: 0
    },
    maskLink: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
    }
})

const { View, useCode, set, concat, block, call } = Animated;

const Link: React.FunctionComponent<LinkProps> = ({
    isActive: propIsActive = false,
    containerStyle,
    linkStyle,
    maskLinkStyle,
    unActiveLinkColor = DEFAULT_UNACTIVE_LINK_COLOR,
    activeLinkColor = DEFAULT_ACTIVE_LINK_COLOR,
}) => {

    const [isActive, setActive] = React.useState(false);
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
        return set(animatedActive, timing({
            from: animatedActive,
            to: isActive ? 1 : 0,
            easing: Easing.quad,
            duration: 400
        }))
    }, [isActive])

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[
                styles.link,
                { backgroundColor: unActiveLinkColor },
                linkStyle
            ]} />
            <View style={[
                styles.maskLink,
                {
                    backgroundColor: activeLinkColor,
                    width: concat(animatedActive.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 100]
                    }), '%')
                },
                maskLinkStyle
            ]} />
        </View>
    );
}

export default Link;