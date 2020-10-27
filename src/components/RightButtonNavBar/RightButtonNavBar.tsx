import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, View, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from '../../config';
import store from '../../store';
import { RightButtonNavBarProps } from '.';
import { RIGHT_BUTTON_TYPE } from './constants';
import { NotiBadge } from '../Badges';

const styles = StyleSheet.create({
    right_btn_add_store: {
        paddingVertical: 1,
        paddingHorizontal: 12,
        paddingTop: appConfig.device.isAndroid ? 4 : 0
    },
    icon: {
        color: '#fff',
        fontSize: 26
    },
    notiContainer: {
        right: 5,
        top: appConfig.device.isAndroid ? -2 : -4
    }
});

const AnimatedNoti = Animated.createAnimatedComponent(NotiBadge);

class RightButtonNavBar extends Component<RightButtonNavBarProps> {
    state = {
        noti: store.cart_data ? store.cart_data.count : 0,
        animatedNoti: new Animated.Value(0),
        animatedNotiBounce: new Animated.Value(0)
    };

    get icon() {
        let Icon = null, name = "", extraStyle = {};
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                name = "ios-cart";
                Icon = Ionicons;
                break;
        }

        return <Icon name={name} style={[styles.icon, extraStyle, this.props.iconStyle]} />
    }

    handlePressIcon() {
        if (typeof this.props.onPress === "function") {
            this.props.onPress();
            return;
        }
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                this.handlePressCart();
                break;
        }
    }

    handlePressCart() {
        if (store.cart_data) {
            Actions.push(appConfig.routes.paymentConfirm);
        } else {
            Actions.push(appConfig.routes.storeOrders);
        }
    }

    updateNoti() {
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                if (
                    (store.cart_data && (store.cart_data.count !== this.state.noti)) ||
                    (!store.cart_data && this.state.noti)
                ) {
                    this.setState({ noti: store.cart_data ? store.cart_data.count : 0 });
                    this.activeNotiAnimation();
                }
                break;
        }
    }

    activeNotiAnimation() {
        Animated.parallel(
            [
                Animated.sequence([
                    Animated.timing(this.state.animatedNoti, {
                        toValue: 1,
                        duration: 100,
                        easing: Easing.quad,
                        useNativeDriver: true
                    }),
                    Animated.delay(200),
                    Animated.timing(this.state.animatedNoti, {
                        toValue: -1,
                        duration: 200,
                        easing: Easing.elastic(0.5),
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.animatedNoti, {
                        toValue: 1,
                        duration: 200,
                        easing: Easing.elastic(0.5),
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.animatedNoti, {
                        toValue: 0,
                        duration: 100,
                        easing: Easing.elastic(0.5),
                        useNativeDriver: true
                    })
                ]),

                Animated.sequence([
                    Animated.timing(this.state.animatedNotiBounce, {
                        toValue: -1,
                        duration: 200,
                        easing: Easing.quad,
                        useNativeDriver: true
                    }),
                    Animated.delay(50),
                    Animated.timing(this.state.animatedNotiBounce, {
                        toValue: 1,
                        duration: 200,
                        easing: Easing.quad,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.animatedNotiBounce, {
                        toValue: 2,
                        duration: 200,
                        easing: Easing.elastic(0.5),
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.animatedNotiBounce, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.quad,
                        useNativeDriver: true
                    })
                ])
            ],
            { stopTogether: false }
        ).start(({ finished }) => {
            if (finished) {
                this.state.animatedNoti.setValue(0);
                this.state.animatedNotiBounce.setValue(0);
            }
        });
    }

    animatedNoti() {
        return {
            transform: [
                {
                    scaleX: this.state.animatedNoti.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [0.8, 1, 1.25]
                    })
                },
                {
                    translateY: this.state.animatedNotiBounce.interpolate({
                        inputRange: [-1, 0, 1, 2],
                        outputRange: [2, 0, -3, 2]
                    })
                }
            ]
        };
    }

    render() {
        this.updateNoti();

        return (
            <TouchableHighlight
                underlayColor="transparent"
                onPress={this.handlePressIcon.bind(this)}
            >
                <View style={[
                    styles.right_btn_add_store,
                    this.props.containerStyle
                ]}>
                    {this.icon}
                    {!!this.state.noti && (
                        <AnimatedNoti
                            label={this.state.noti}
                            containerStyle={styles.notiContainer}
                            style={this.animatedNoti()}
                        />
                    )}

                </View>
            </TouchableHighlight>
        );
    }
}

//@ts-ignore
export default observer(RightButtonNavBar);