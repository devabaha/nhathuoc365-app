import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SkeletonLoadingProps } from '.';
import { SKELETON_COLOR } from './constants';


const styles = StyleSheet.create({
    container: {
        backgroundColor: SKELETON_COLOR,
        overflow: 'hidden'
    }
});

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class SkeletonLoading extends Component<SkeletonLoadingProps> {
    static defaultProps = {
        loading: true
    };
    
    state = {
        width: 0,
        height: 0
    };

    handleContainerLayout = e => {
        const { width, height } = e.nativeEvent.layout;
        this.setState({
            width,
            height
        });
    };

    render() {
        const {
            loading,
            children,
            style,
            backgroundColor,
            foregroundColor,
            start,
            end,
            highlightMainDuration,
            highlightColor,
            highlightOpacity,
            ...props
        } = this.props;

        const { width, height } = this.state;
        const highlightWidth = width * 0.8;

        return (
            <>
                {loading ? (
                    <View
                        pointerEvents="none"
                        onLayout={this.handleContainerLayout}
                        style={[styles.container, style]}
                        {...props}
                    >
                        {!!width && (
                            <Highlight
                                width={highlightWidth}
                                height="100%"
                                start={-highlightWidth}
                                end={width + highlightWidth}
                                highlightMainDuration={highlightMainDuration}
                                highlightColor={highlightColor}
                                highlightOpacity={highlightOpacity}
                            />
                        )}
                    </View>
                ) : (
                        children
                    )}
            </>
        );
    }
}

export default SkeletonLoading;

class Highlight extends Component<SkeletonLoadingProps> {
    static defaultProps = {
        style: {}
    };
    state = {
        highlightAnimated: new Animated.Value(this.props.start)
    };

    get highlightColor() {
        const color = this.props.highlightColor || "#fff";
        const opacity = this.props.highlightOpacity || .4;
        return [
            //@ts-ignore
            hexToRgbA(color, 0),
            //@ts-ignore
            hexToRgbA(color, opacity),
            //@ts-ignore
            hexToRgbA(color, opacity),
            //@ts-ignore
            hexToRgbA(color, 0),
        ]
    }

    componentDidMount() {
        const speed = this.props.highlightMainDuration;
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.highlightAnimated, {
                    toValue: this.props.end,
                    duration: speed,
                    easing: Easing.cubic,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: this.props.start,
                    duration: 0,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: this.props.end,
                    duration: speed * .75,
                    easing: Easing.cubic,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: this.props.start,
                    duration: 0,
                    useNativeDriver: true
                }),
                Animated.delay(1000)
            ])
        ).start();
    }

    render() {
        const { width, height, style, highlightColor } = this.props;
        const animatedStyle = {
            transform: [{ translateX: this.state.highlightAnimated }]
        };
        const containerStyle = [{ width, height }, style, animatedStyle];

        return (
            <AnimatedLinearGradient
                style={containerStyle}
                colors={this.highlightColor}
                locations={[0.15, 0.45, 0.55, 0.85]}
                useAngle
                angle={90}
            />
        );
    }
}