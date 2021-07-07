import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
    permission: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 30,
        alignItems: 'center',
      },
      permissionNoLocationIcon: {
        fontSize: 45,
        marginBottom: 15,
        color: '#666',
      },
      permissionTitle: {
          fontSize: 15,
          marginBottom: 10,
          color: '#666'
      },
      permissionConfirm: {
          backgroundColor: '#eaeaea',
          alignItems: 'center',
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderRadius: 20,
          flexDirection: 'row',
      },
      permissionSettingIcon: {
        fontSize: 14,
        marginRight: 8,
        color: '#666'
      },
      permissionConfirmText: {
          fontWeight: '500',
          fontSize: 13,
          color: '#666',
      }
})

function NoResult({
    iconName,
    message,
    btnTitle,
    btnIconName,
    onPress
}) {
    return (
        <View style={styles.permission}>
            <View>
                <MaterialCommunityIcons name={iconName} style={styles.permissionNoLocationIcon}/>
            </View>
            <Text style={styles.permissionTitle}>{message}</Text>
            
            {!!btnTitle && 
            <TouchableOpacity 
                hitSlop={HIT_SLOP}
                style={styles.permissionConfirm}
                onPress={onPress}
            >

                <AntDesignIcon name={btnIconName} style={styles.permissionSettingIcon}/>
                <Text style={styles.permissionConfirmText}>
                    {btnTitle}
                </Text>
            </TouchableOpacity>}
        </View>
    )
}

export default NoResult