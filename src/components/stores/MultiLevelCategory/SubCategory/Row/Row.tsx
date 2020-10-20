import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Animated, { Easing, timing, concat } from 'react-native-reanimated';
import { RowProps } from '.';

const styles = StyleSheet.create({
    container: {
    },
    layoutContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    contentContainer: {
        overflow: 'hidden',
    },
    iconContainer: {
        flex: 1,
        paddingLeft: 15,
    },
    icon: {
        alignSelf: 'flex-end',
        color: '#777'
    }
})

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

class Row extends Component<RowProps> {
    static defaultProps = {
        defaultOpenChild: false,
        disabledOpenChild: false,
        onPressTitle: () => { }
    }
    state = {
        isOpen: this.props.defaultOpenChild,
        animatedCoreValue: new Animated.Value(0)
    };

    get animatedContentStyle() {
        return !this.props.fullMode ? {
            opacity: this.state.animatedCoreValue,
            height: this.state.animatedCoreValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, this.props.totalHeight]
            })
        } : {};
    }

    get animatedIconStyle() {
        return {
            transform: [{
                rotate: concat(this.state.animatedCoreValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 180]
                }), 'deg')
            }]
        }
    }

    shouldComponentUpdate(nextProps: RowProps, nextState: any) {
        if (nextState.isOpen !== this.state.isOpen) {
            timing(this.state.animatedCoreValue, {
                toValue: nextState.isOpen ? 1 : 0,
                duration: 200,
                easing: Easing.quad
            }).start();
        }

        if (nextProps.defaultOpenChild !== this.props.defaultOpenChild) {
            this.setState({ isOpen: nextProps.defaultOpenChild })
        }

        if (nextState !== this.state) {
            return true;
        }

        const isUpdateProps = Object.keys(nextProps).some(key => nextProps[key] !== this.props[key] && key !== "children")

        if (isUpdateProps) {
            return true;
        }

        return false;
    }

    onToggle() {
        this.setState((prevState: any) => ({
            isOpen: !prevState.isOpen
        }))
    }

    render() {
        const isShowDirectionIcon = !this.props.fullMode && !!this.props.totalHeight;
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={[styles.header, this.props.headerContainerStyle]}>
                    <TouchableOpacity
                        style={[styles.layoutContainer, { flex: !!this.props.totalHeight ? 0 : 1 }]}
                        onPress={this.props.onPressTitle}
                    >
                        <Text>{this.props.title}</Text>
                    </TouchableOpacity>
                    {isShowDirectionIcon && <TouchableOpacity
                        onPress={this.onToggle.bind(this)}
                        style={[styles.layoutContainer, styles.iconContainer]}
                    >
                        <AnimatedIcon
                            name="chevron-down"
                            style={[styles.icon, this.animatedIconStyle]}
                        />
                    </TouchableOpacity>}
                </View>

                <Animated.View
                    style={[
                        styles.contentContainer,
                        this.animatedContentStyle,
                        this.props.contentContainerStyle
                    ]}
                >
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }
}

export default Row;