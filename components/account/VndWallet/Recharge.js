/* @flow */

import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text
} from 'react-native';

const Recharge = (props) => {
    return (
        <ScrollView
            contentContainerStyle={{
                padding: 15,
                width: Util.size.width,
            }}
            keyboardShouldPersistTaps="always"
        // refreshControl={
        //     <RefreshControl
        //         refreshing={loadingHistory || loadingHistoryWithdraw}
        //         onRefresh={this._getData.bind(this)}
        //     />
        // }
        >
            <Text style={[styles.heading]}>
                Chuyển khoản ngân hàng
            </Text>
            <View style={[{ paddingLeft: 10, marginTop: 10 }]}>
                <Text style={[styles.des]}>
                    Miễn phí nạp tiền
                </Text>
                <View style={[{ paddingLeft: 10 }]}>
                    <View style={[{ flexDirection: 'row' }]}>
                        <Text style={[styles.des]}>
                            {`Tài khoản: `}
                        </Text>
                        <Text style={[styles.des]}>
                            Công ty cổ phần TickID
                        </Text>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                        <Text style={[styles.des]}>
                            {`Vietcombank: `}
                        </Text>
                        <Text style={[styles.des]}>
                            0011004056527
                        </Text>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                        <Text style={[styles.des]}>
                            {`Techcombank: `}
                        </Text>
                        <Text style={[styles.des]}>
                            0011004056527
                        </Text>
                    </View>
                    <View style={[{ flexDirection: 'row' }]}>
                        <Text style={[styles.des]}>
                            {`Nội dung: `}
                        </Text>
                        <Text style={[styles.des]}>
                            (0983962301)
                        </Text>
                    </View>
                    <Text style={[styles.notice]}>
                        Vui lòng ghi đúng nội như trên để được xác nhận tự động trong 1 phút.
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        color: '#404040'
    },
    des: {
        fontSize: 16,
        marginBottom: 2
    },
    notice: {
        fontSize: 18,
        color: '#404040',
        marginBottom: 2
    }
})

export default Recharge;