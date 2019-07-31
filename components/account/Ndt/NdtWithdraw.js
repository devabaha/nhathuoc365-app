/* @flow */

import React, { Component, Fragment } from 'react';
import {
    View,
    TouchableHighlight,
    Text,
    StyleSheet,
    TextInput,
    Platform,
    ScrollView
} from 'react-native';

//Library
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActionConst, Actions } from 'react-native-router-flux';

const CASH_MESSAGE = "Rút từ ví Tiền mặt về Tài khoản Tiền mặt trên App";
const PRODUCT_MESSAGE = "Rút từ ví Sản phẩm về Tài khoản Sản phẩm trên App";
const ADVANCE_MESSAGE = "Rút từ ví Tiền mặt về Tài khoản Tạm ứng trên App";
const GUIDE_MESSAGE = "Trong tháng, ví Tiền mặt trên Web được rút về TK Tạm ứng trên App, chỉ được sử dụng trong chuỗi Macca Coffee+, không được rút ra tiền mặt. Lệnh rút được thực hiện ngay lập tức."
const ERROR_MONEY = "Số tiền không hợp lệ.";

class NdtWithdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            isError: false,
            loading: false
        };
    }

    onChangeMoney = (value) => this.setState({ value, isError: false })

    withdrawMoney = (ndt, typeWallet) => {
        var { value, loading } = this.state;

        if(loading){
            return;
        }
        if (validateMoney(value)) {
            this.setState({
                isError: false
            })
            let data = {
                mcc_username: ndt.mcc_investor_username,
                money: value
            }

            this.setState({ loading: true }, async () => {
                try {
                    var response = await APIHandler[typeWallet === "0"
                        ? "investor_send_cash_withdraw"
                        : typeWallet === "1"
                            ? "investor_send_product_withdraw"
                            : "investor_send_advance_withdraw"](data);
                    this.setState({ loading: false });
                    if (response && response.status == STATUS_SUCCESS) {
                        APIHandler.investor_sync_info();
                        Toast.show(response.message, Toast.SHORT);
                        Actions.pop();
                    } else {
                        Toast.show(response.message, Toast.SHORT);
                    }
                } catch (err) {
                    console.warn(e + ' investor_withdraw');
                    store.addApiQueue('investor_withdraw', this.withdrawMoney);
                }
            });
        } else {
            this.setState({
                isError: true
            })
        }
    }

    render() {
        let { ndt, typeWallet } = this.props;
        let mess = typeWallet === "0"
            ? CASH_MESSAGE
            : typeWallet === "1"
                ? PRODUCT_MESSAGE
                : ADVANCE_MESSAGE;

        return (
            <Fragment>
                {this.state.loading &&
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                    }}>
                        <Indicator />
                    </View>}
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
                                    {ndt.mcc_investor_username}
                                </Text>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{
                                fontWeight: 'bold',
                                color: '#404040',
                                fontSize: 18
                            }}>
                                {mess}
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: 15 }}>
                        <Text style={{ color: '#404040', fontSize: 18 }}>
                            Số tiền
                    </Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{
                                height: 42,
                                borderColor: "#dddddd",
                                borderWidth: 1,
                                marginVertical: 15,
                                paddingHorizontal: 8,
                                borderRadius: 2,
                                color: "#404040",
                                fontSize: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: "#ffffff"
                            }}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            onChangeText={this.onChangeMoney.bind(this)}
                            value={this.state.value}
                        />
                        {this.state.isError && <Text style={{ color: 'red', fontSize: 16 }}>
                            {ERROR_MONEY}
                        </Text>}
                    </View>
                    <TouchableHighlight
                        underlayColor="transparent"
                        style={styles.btn_container}
                        onPress={this.withdrawMoney.bind(this, ndt, typeWallet)}
                    >
                        <View style={styles.empty_box_btn}>
                            <Text style={styles.empty_box_btn_title}>
                                Rút về App
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.note_container]}>
                        <Text style={[styles.note]}>
                            {GUIDE_MESSAGE}
                        </Text>
                    </View>
                </ScrollView>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    btn_container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30
    },
    empty_box_btn: {
        borderWidth: Util.pixel,
        borderColor: DEFAULT_COLOR,
        maxWidth: 400,
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

export default NdtWithdraw;