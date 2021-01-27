import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Shimmer from 'react-native-shimmer';
import { SKELETON_COLOR } from '../SkeletonLoading/constants';
import appConfig from '../../config';

const styles = StyleSheet.create({
    container: {
        width: appConfig.device.width,
        flexDirection: 'row',
        backgroundColor: SKELETON_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 7,
        paddingTop: 4,
        height: 40,
    },
    itemContainer: {
        paddingHorizontal: 12,
        height: 12,
        flex: 1,
    },
    item: {
        //@ts-ignore
        backgroundColor: LightenColor(SKELETON_COLOR, -12),
        borderRadius: 4,
        flex: 1
    }
})


const CategoriesSkeleton = () => {

    const renderItem = (item, index) => {
        return (
            <View key={index} style={styles.itemContainer}>
                <View style={styles.item}/>
            </View>
        )
    }

    return (
        <Shimmer>
            <Text>
                <View style={styles.container}>
                    {[1,2,3,4].map(renderItem)}
                </View>
            </Text>
        </Shimmer>
    );
}

export default CategoriesSkeleton;