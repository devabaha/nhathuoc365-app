import * as React from 'react';
import { PureComponent } from 'react';
import { View, Text, FlatList, StyleSheet, ViewStyle, StyleProp } from 'react-native';
//@ts-ignore
import SkeletonLoading from '../../../SkeletonLoading';
import { SKELETON_COLOR } from '../../constants';

export interface HomeCardListSkeletonProps {
    itemContainerStyle: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: 8,
        paddingBottom: 15
    },
    content: {
        paddingLeft: 16,
        paddingVertical: 4,
    },
    title: {
        width: '23%',
        backgroundColor: SKELETON_COLOR,
        lineHeight: 20,
        marginTop: 12,
        marginBottom: 6
    },
    itemContainer: {
        width: 210,
        height: 120,
        marginRight: 16,
        justifyContent: 'space-between'
    },
    itemMain: {
        backgroundColor: SKELETON_COLOR,
        borderRadius: 8,
        width: '100%',
        height: '80%',
    },
    itemSub: {
        width: '50%',
        height: '10%',
        backgroundColor: SKELETON_COLOR
    },
    skeletonContainer: {
        backgroundColor: "rgba(0,0,0,0)",
        position: "absolute",
    }
});

const SKELETON_LENGTH = 5;

class HomeCardListSkeleton extends PureComponent<HomeCardListSkeletonProps> {
    state = {}
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}></Text>
                </View>

                <FlatList
                    contentContainerStyle={styles.content}
                    horizontal
                    data={Array.from(
                        { length: SKELETON_LENGTH },
                        (_, idx) => `${++idx}`
                    )}
                    showsHorizontalScrollIndicator={false}
                    renderItem={() => {
                        return (
                            <View style={[styles.itemContainer, this.props.itemContainerStyle]} >
                                <View style={styles.itemMain} />
                                <View style={styles.itemSub} />
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
                <SkeletonLoading
                    style={styles.skeletonContainer}
                    width="100%"
                    height="100%"
                    loading
                />
            </View>
        );
    }
}

export default HomeCardListSkeleton;