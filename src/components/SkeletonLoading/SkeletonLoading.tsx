import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SkeletonLoadingProps } from '.';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

class SkeletonLoading extends Component<SkeletonLoadingProps> {
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eff1f2'
    }
});

export default SkeletonLoading;

class Highlight extends Component<SkeletonLoadingProps> {
    static defaultProps = {
        style: {}
    };
    state = {
        highlightAnimated: new Animated.Value(this.props.start)
    };
    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.highlightAnimated, {
                    toValue: this.props.end,
                    duration: 800,
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
                    duration: 600,
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
        const { width, height, style, start, end } = this.props;
        const animatedStyle = {
            transform: [{ translateX: this.state.highlightAnimated }]
        };
        const containerStyle = [{ width, height }, style, animatedStyle];
        return (
            <AnimatedLinearGradient
                style={containerStyle}
                colors={[
                    'rgba(255,255,255,0)',
                    'rgba(255,255,255,.4)',
                    'rgba(255,255,255,.4)',
                    'rgba(255,255,255,0)'
                ]}
                locations={[0.15, 0.45, 0.55, 0.85]}
                useAngle
                angle={90}
            />
        );
    }
}