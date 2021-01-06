import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { ImageBgProps } from '.';
import FastImage from 'react-native-fast-image';
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
    },
    image: {
        ...StyleSheet.absoluteFillObject
    }
})


const ImageBackground = ({
    style,
    imageStyle,
    imageProps,
    source,
    children,
    ...props
}: ImageBgProps) => {
    return (
        <View
            {...props}
            style={[
                styles.container,
                style
            ]}>
            <FastImage
                // {...imageProps}
                source={source}
                style={[styles.image, imageStyle]}
            />
            {children}
        </View>
    )
}

export default ImageBackground;