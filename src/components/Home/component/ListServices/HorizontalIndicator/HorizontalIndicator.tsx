import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { HorizontalIndicatorProps } from '.';
//@ts-ignore
import appConfig from 'app-config';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 2,
        height: 3,
        width: 50,
        overflow: 'hidden'
    },
    indicator: {
        borderRadius: 2,
        height: '100%',
        width: '30%'
    }
})

class HorizontalIndicator extends Component<HorizontalIndicatorProps> {
    static defaultProps = {
        color: appConfig.colors.primary,
    }
    state = {};
    animatedIndicatorWidth = new Animated.Value(0);

    componentDidMount() {
        Animated.timing(this.animatedIndicatorWidth, {
            toValue: this.props.indicatorWidth,
            easing: Easing.quad,
            duration: 200
        }).start();
    }

    componentDidUpdate() {
        Animated.timing(this.animatedIndicatorWidth, {
            toValue: this.props.indicatorWidth,
            easing: Easing.quad,
            duration: 200
        }).start();
    }

    get containerStyle() {
        return {
            backgroundColor: this.props.foregroundColor ||
                //@ts-ignore
                hexToRgbA(this.props.color, .25)
        }
    }

    get indicatorStyle() {
        return {
            backgroundColor: this.props.indicatorColor || this.props.color,
            width: this.animatedIndicatorWidth
        }
    }

    render() {
        return (
            <View style={[styles.container, this.containerStyle, this.props.containerStyle]}>
                <Animated.View style={[styles.indicator, this.indicatorStyle, this.props.indicatorStyle]} />
            </View>
        );
    }
}

export default HorizontalIndicator;