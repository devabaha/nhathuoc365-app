import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ItemProps } from '.';

const styles = StyleSheet.create({
    container: {

    },
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
})

class Item extends Component<ItemProps> {
    static defaultProps = {
        flex: false
    }

    state = {};

    get containerStyle() {
        let containerStyle = {};
        if (this.props.flex) {
            containerStyle = {
                ...containerStyle,
                ...styles.flex
            }
        }

        return containerStyle;
    }

    render() {
        const { style, ...props } = this.props;
        const extraStyle = this.containerStyle;
        return (
            <View {...props} style={[styles.container, extraStyle, style]}>
                {this.props.children}
            </View>
        );
    }
}

export default Item;