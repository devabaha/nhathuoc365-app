import * as React from 'react';
import { Component } from 'react';
import { StyleSheet} from 'react-native';
import HomeCardListSkeleton from '../HomeCardList/HomeCardListSkeleton';

const styles = StyleSheet.create({
    itemContainer: {
        width: 130,
        height: 116
    }
});
class ListProductSkeleton extends Component {
    state = {}

    render() {
        return (
            <HomeCardListSkeleton 
                itemContainerStyle={styles.itemContainer}
            />
        );
    }
}

export default ListProductSkeleton;