import React, { Component } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { CategoryProps } from '.';
//@ts-ignore
import appConfig from 'app-config';
import { TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: appConfig.device.width / 4,
        height: appConfig.device.width / 4,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10%',
        borderBottomColor: '#ddd',
        borderBottomWidth: .5,
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
        onPress: () => { }
    }

    state = {}
    render() {
        return (
            <TouchableHighlight underlayColor="#e5e5e5" onPress={this.props.onPress}>
                <View style={[styles.container, this.props.containerStyle]}>
                    {!!this.props.image &&
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{ uri: this.props.image }} />
                        </View>
                    }
                    {!!this.props.title &&
                        <Text numberOfLines={2} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>}
                    {this.props.children}
                </View>
            </TouchableHighlight>
        );
    }
}

export default Category;