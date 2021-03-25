import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../../../components/Layout/Container';
import appConfig from 'app-config';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderColor: appConfig.colors.primary
    },
    input: {
        paddingVertical: 0,
        height: 50,
        flex: 1
    },
    searchContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    search: {
        fontSize: 20,
        color: '#aaa',
        marginRight: 15
    }
})


const Search = ({
    onChangeText,
    value
}) => {
    return (
        <Container row style={styles.container}>
            <AntDesignIcon name="search1" style={styles.search} />

            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder="Nhập để tìm kiếm..."
            />
        </Container>
    );
}

export default Search;