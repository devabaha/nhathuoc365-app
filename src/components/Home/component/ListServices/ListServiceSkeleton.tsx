import * as React from 'react';
import { PureComponent } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SkeletonLoading from '../../../SkeletonLoading';
import { MIN_ITEMS_PER_ROW } from '../../constants';
//@ts-ignore
import appConfig from 'app-config';
import { SKELETON_COLOR } from '../../../SkeletonLoading/constants';

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 8
    },
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: (appConfig.device.width - 32) / MIN_ITEMS_PER_ROW,
        height: (appConfig.device.width - 32) / MIN_ITEMS_PER_ROW,
    },
    main: {
        borderRadius: 16,
        backgroundColor: SKELETON_COLOR,
        width: "50%",
        height: "50%",
        minWidth: 60,
        minHeight: 60,
    },
    sub: {
        marginTop: 8,
        height: 8,
        borderRadius: 4,
        width: '45%',
        backgroundColor: SKELETON_COLOR,
    },
    skeletonContainer: {
        backgroundColor: "rgba(0,0,0,0)",
        position: "absolute",
    }
})

class ListServiceSkeleton extends PureComponent {
    state = {}
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={Array.from(
                        { length: MIN_ITEMS_PER_ROW * 2 },
                        (_, idx) => `${++idx}`
                    )}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={styles.itemContainer}
                            >
                                <View
                                    style={styles.main}
                                />
                                <View style={styles.sub} />
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={MIN_ITEMS_PER_ROW}
                />
                <SkeletonLoading
                    style={styles.skeletonContainer}
                    width="100%"
                    height="100%"
                />
            </View>
        );
    }
}

export default ListServiceSkeleton;