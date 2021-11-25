import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SkeletonLoadingProps } from '.';
import Skeleton from '../base/Skeleton';
import { SKELETON_COLOR } from './constants';


const styles = StyleSheet.create({
    container: {
        // backgroundColor: SKELETON_COLOR,
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
                    <Skeleton
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
                    </Skeleton>
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
            hexToRgba(color, 0),
            //@ts-ignore
            hexToRgba(color, opacity),
            //@ts-ignore
            hexToRgba(color, opacity),
            //@ts-ignore
            hexToRgba(color, 0),
        ]
    }

    shouldComponentUpdate(nextProps: SkeletonLoadingProps, nextState) {
        if(nextProps.width !== this.props.width){
            this.state.highlightAnimated.stopAnimation();
            this.animate(nextProps);
        }

        return true;
    }

    componentDidMount() {
        this.animate();
    }

    // componentDidUpdate(prevProps: SkeletonLoadingProps, prevState) {
    //     if(prevProps.width !== this.props.width){
    //         this.state.highlightAnimated.stopAnimation();
    //         this.animate();
    //     }
    // }

    animate(props = this.props){
        const speed = props.highlightMainDuration;
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.highlightAnimated, {
                    toValue: props.end,
                    duration: speed,
                    easing: Easing.cubic,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: props.start,
                    duration: 0,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: props.end,
                    duration: speed * .75,
                    easing: Easing.cubic,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.highlightAnimated, {
                    toValue: props.start,
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