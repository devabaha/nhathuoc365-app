import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Container from '../../Layout/Container';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavBarProps } from './index';
import appConfig from 'app-config';
import { BACK_NAV_ICON_NAME } from '../../../constants';
import { COMBO_LOCATION_TYPE } from '../constants';
import Animated, { Easing, useValue, interpolate } from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: .5,
        borderColor: '#ddd'
    },
    icon: {
        fontSize: 24,
        color: '#333',
        padding: 15,
        paddingLeft: 10,
    },
    iconClose: {
        position: 'absolute',
    },
    navTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        paddingHorizontal: 50,
    },
    title: {
        textAlign: 'center',
        color: '#333',
        textTransform: 'uppercase',
        fontWeight: '500',
        letterSpacing: 1
    },
    descriptionContainer: {
        backgroundColor: '#f5f5f5',
    },
    description: {
        textAlign: 'center',
        color: appConfig.colors.primary,
        fontSize: 12,
        paddingHorizontal: 5,
        letterSpacing: .2
    }
})


const NavBar = ({
    title,
    description,
    type,
    onPressBack
}: NavBarProps) => {
    const animatedOpacity = useValue(type === COMBO_LOCATION_TYPE.PROVINCE ? 0 : 1);

    useEffect(() => {
        Animated.timing(animatedOpacity, {
            toValue: type === COMBO_LOCATION_TYPE.PROVINCE ? 0 : 1,
            duration: 300,
            easing: Easing.quad,
        }).start();
    }, [type])

    return (
        <>
            <Container row style={styles.container}>
                <TouchableOpacity onPress={onPressBack}>
                    <AnimatedIcon
                        name={BACK_NAV_ICON_NAME}
                        style={[styles.icon, {
                            opacity: animatedOpacity.interpolate({
                                inputRange: [0, .4, 1],
                                outputRange: [0, 1, 1]
                            }),
                            transform: [{
                                translateX: interpolate(animatedOpacity, {
                                    inputRange: [0, 1],
                                    outputRange: [-10, 0]
                                })
                            }]
                        }]}
                    />
                    <AnimatedIcon
                        name="close"
                        style={[styles.icon, styles.iconClose, {
                            opacity: interpolate(animatedOpacity, {
                                inputRange: [0, .4, 1],
                                outputRange: [1, 0, 0]
                            }),
                            transform: [{
                                translateX: interpolate(animatedOpacity, {
                                    inputRange: [0, 1],
                                    outputRange: [0, -10]
                                })
                            }]
                        }]}
                    />
                </TouchableOpacity>

                <Container style={styles.navTextContainer}>
                    <Text style={styles.title}>{title}</Text>
                </Container>
            </Container>

            {!!description && <Container paddingVertical={10} style={[ styles.descriptionContainer]}>
                <Text numberOfLines={2} style={styles.description}>{description}</Text>
            </Container>}
        </>
    );
}

export default React.memo(NavBar);