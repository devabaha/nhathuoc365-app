import React, { Component } from 'react';
import { Image, Text, View, StyleSheet, Animated, Easing, TouchableHighlight } from 'react-native';
import { CategoryProps } from '.';
//@ts-ignore
import appConfig from 'app-config';

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden'
    },
    activeMask: {
        backgroundColor: appConfig.colors.primary,
        position: 'absolute',
        borderRadius: 100,
        width: '100%',
        height: '100%'
    },
    container: {
        width: appConfig.device.width / 4,
        height: appConfig.device.width / 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '7%',
        borderBottomColor: '#ddd',
        borderBottomWidth: .5
    },
    imageContainer: {
        width: '55%',
        height: '55%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
    },
    image: {
        flex: 1
    },
    title: {
        marginTop: 10,
        fontSize: 12,
        letterSpacing: .5,
        textAlign: 'center',
        color: '#333',
        fontWeight: '500'
    }
})

class Category extends Component<CategoryProps> {
    static defaultProps = {
        isActive: false,
        onPress: () => { }
    }

    state = {};
    animatedActiveValue = new Animated.Value(0);

    shouldComponentUpdate(nextProps: CategoryProps, nextState: any) {
        if (nextProps.isActive !== this.props.isActive) {
            this.animateActive(nextProps.isActive ? 1 : 0);
        }
        return true;
    }

    componentDidMount() {
        this.animateActive(this.props.isActive ? 1 : 0);
    }

    animateActive(toValue) {
        Animated.timing(this.animatedActiveValue, {
            toValue,
            duration: 150,
            easing: Easing.quad,
            useNativeDriver: true
        }).start();
    }

    render() {
        const activeContainerStyle = {
            opacity: this.animatedActiveValue,
            transform: [{
                scale: this.animatedActiveValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1.5]
                })
            }]
        };
        const activeTitleStyle = this.props.isActive && {
            color: '#fff'
        };
        return (
            <TouchableHighlight
                style={styles.wrapper}
                underlayColor="#e5e5e5"
                onPress={this.props.onPress}
            >
                <>
                    <Animated.View style={[styles.activeMask, activeContainerStyle]} />
                    <View style={[styles.container, this.props.containerStyle]}>
                        {!!this.props.image &&
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} source={{ uri: this.props.image }} />
                            </View>
                        }
                        {!!this.props.title &&
                            <Text numberOfLines={2} style={[
                                styles.title,
                                activeTitleStyle,
                                this.props.titleStyle
                            ]}>{this.props.title}</Text>}
                        {this.props.children}
                    </View>
                </>
            </TouchableHighlight>
        );
    }
}

export default Category;