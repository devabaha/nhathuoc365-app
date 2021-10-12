import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: .5,
        borderColor: '#eee'
    },
    title: {
        flex: 1,
        color: '#333',
        // width: '100%',
    },
    last: {
        borderBottomWidth: 0
    }
})

type AwesomeComboItemProps = {
    title: string,
    last?: boolean,
    onPress: (event: GestureResponderEvent) => void
}

const AwesomeComboItem = ({
    title,
    last = false,
    onPress
}: AwesomeComboItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View style={[styles.container, last && styles.last]}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default AwesomeComboItem;