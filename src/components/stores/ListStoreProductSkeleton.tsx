import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, ScrollView, Text } from 'react-native';
import Shimmer from 'react-native-shimmer';
import appConfig from '../../config';
import SkeletonLoading from '../SkeletonLoading';
import { SKELETON_COLOR } from '../SkeletonLoading/constants';
import Animated, { useValue, Easing, useCode, call } from 'react-native-reanimated';


const ITEM_WIDTH = appConfig.device.width / 2 - 12;
//@ts-ignore
const LightenSkeletonColor = LightenColor(SKELETON_COLOR, -12);

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: appConfig.colors.sceneBackground,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999
    },
    container: {
        width: appConfig.device.width,
    },
    content: {
        flexGrow: 1,
        paddingTop: 15
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    itemImageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        backgroundColor: SKELETON_COLOR
    },
    itemActionBtn: {
        width: 50,
        height: 50,
        backgroundColor: LightenSkeletonColor,
        position: 'absolute',
        right: 0,
        top: 0,
        borderBottomLeftRadius: 4
    },
    itemInfoContainer: {
        width: '100%',
        padding: 7
    },
    itemMainInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemLocation: {
        width: '30%',
        height: 8,
        backgroundColor:
            SKELETON_COLOR,
        borderRadius: 7
    },
    itemUnit: {
        width: '10%',
        height: 8,
        backgroundColor: SKELETON_COLOR,
        borderRadius: 7
    },
    itemTitle: {
        width: '80%',
        height: 11,
        backgroundColor: SKELETON_COLOR,
        marginTop: 5,
        borderRadius: 7
    },
    itemPrice: {
        width: '40%',
        height: 14,
        backgroundColor: LightenSkeletonColor,
        marginTop: 10,
        borderRadius: 7
    }
})

const ListStoreProductSkeleton = ({ loading }) => {

    const animatedOpacity = useValue(1);
    const [isShow, setShow] = useState(!loading);

    useEffect(() => {
        Animated.timing(animatedOpacity, {
            toValue: loading ? 1 : 0,
            duration: 200,
            easing: Easing.quad
        }).start();
    }, [loading])

    useCode(() => {
        return call([animatedOpacity], ([opacityValue]) => {
            if (opacityValue >= 1) {
                setShow(true)
            } else {
                setShow(false);
            }
        })
    }, [])

    const renderItemSkeleton = ({ item, index }) => {
        return (
            <View style={[styles.itemContainer, {
                marginRight: index % 2 == 0 ? 8 : 0,
                marginLeft: index % 2 == 0 ? 8 : 0,
            }]}>

                <View style={styles.itemImageContainer}>
                    <View style={styles.itemActionBtn} />
                </View>
                <View style={styles.itemInfoContainer}>
                    <View style={styles.itemMainInfoContainer}>
                        <View style={styles.itemLocation} />
                        <View style={styles.itemUnit} />
                    </View>
                    <View style={styles.itemTitle} />
                    <View style={styles.itemPrice} />
                </View>
            </View>
        )
    };

    return (
        <Animated.View pointerEvents={isShow ? 'auto' : 'none'} style={[
            styles.wrapper,
            {
                opacity: animatedOpacity,
            }]}>
            <Shimmer>
                <Text style={styles.container}>
                    <FlatList
                        style={styles.container}
                        contentContainerStyle={[styles.content]}
                        data={[1, 2, 3, 4, 5, 6]}
                        numColumns={2}
                        renderItem={renderItemSkeleton}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Text>
            </Shimmer>
        </Animated.View>
    );
}

export default (ListStoreProductSkeleton);