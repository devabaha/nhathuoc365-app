import React, { Component } from 'react';

import {
    View,
    TouchableHighlight,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    ScrollView
} from 'react-native';

// import {Scene} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
class NdtCashWithdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <ScrollView
                style={{ paddingHorizontal: 15, marginTop: 60, }}
                keyboardShouldPersistTaps={'always'}
            >
                <View style={{ marginBottom: 15 }}>
                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: '#dddddd',
                        flex: 1,
                        flexDirection: 'row',
                        paddingVertical: 10,
                        alignItems: 'center'
                    }}>
                        <View style={{ marginRight: 5 }}>
                            <Icon name="user" size={18} />
                        </View>
                        <View>
                            <Text style={{
                                fontWeight: 'bold',
                                color: '#404040',
                                fontSize: 18
                            }}>
                                Nguyễn Hoàng Minh
                            </Text>
                        </View>
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#404040',
                            fontSize: 18
                        }}>
                            Tạo lệnh rút tiền ví tiền mặt
                        </Text>
                    </View>
                </View>

                <View>
                    <Text style={{ color: '#404040', fontSize: 18 }}>
                        Số tiền
                    </Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        style={{
                            height: 42,
                            // width: 250,
                            borderColor: "#dddddd",
                            borderWidth: 1,
                            margin: 15,
                            paddingHorizontal: 8,
                            borderRadius: 2,
                            color: "#404040",
                            fontSize: 18,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: "#ffffff"
                        }}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    // onChangeText={this._onChangeSearch.bind(this)}
                    // onSubmitEditing={this._add_ref.bind(this)}
                    // value={this.state.searchValue}
                    />
                </View>
                <View>
                    <Text style={{ color: '#404040', fontSize: 18 }}>
                        Thông tin nhận tiền
                    </Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        style={{
                            height: 42,
                            // width: 250,
                            borderColor: "#dddddd",
                            borderWidth: 1,
                            margin: 15,
                            paddingHorizontal: 8,
                            borderRadius: 2,
                            color: "#404040",
                            fontSize: 18,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: "#ffffff"
                        }}
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    // onChangeText={this._onChangeSearch.bind(this)}
                    // onSubmitEditing={this._add_ref.bind(this)}
                    // value={this.state.searchValue}
                    />
                </View>
                <TouchableHighlight
                    underlayColor="transparent"
                    style={styles.btn_container}
                >
                    <View style={styles.empty_box_btn}>
                        <Text style={styles.empty_box_btn_title}>
                            Gửi yêu cầu Rút tiền
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={[styles.note_container]}>
                    <Text style={[styles.note]}>
                        Yêu cầu rút tiền chỉ được thực hiện vào cuối tháng.
                        {'\n'}
                        Yêu cầu sẽ được xem xét và thực hiện trong vòng 24h.
                </Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    btn_container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15
    },
    empty_box_btn: {
        borderWidth: Util.pixel,
        borderColor: DEFAULT_COLOR,
        maxWidth: 200,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 12,
        borderRadius: 5,
        backgroundColor: DEFAULT_COLOR,
    },
    empty_box_btn_title: {
        color: "#ffffff",
        fontSize: 18
    },
    note_container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    note: {
        fontSize: 18,
        color: '#404040',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    }
})

export default NdtCashWithdraw;