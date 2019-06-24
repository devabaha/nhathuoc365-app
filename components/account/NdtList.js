/* @flow */

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

// library
import store from '../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

// components
import SyncNdt from './SyncNdt';

@observer
class NdtList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.warn(store.user_info.mcc_investor_key_);
    }

    onSyncSuccess = (message) => {
        Toast.show(message)
    }

    gotoNdt = () => {
        Actions.view_ndt({ title: store.user_info.name, user: store.user_info })
    }

    render() {
        let { user_info } = store;
        let listKeyNdt = Object.keys(user_info.mcc_investor_key_);
        let ndts = listKeyNdt.map(key => 
            <NdtRow 
            ndt={user_info.mcc_investor_key_[key]}
            key={key}
            onPress={() => this.gotoNdt(ndt)}
            />)

        return (
            <View style={styles.container}>
                <ScrollView
                    style={{
                        marginBottom: store.keyboardTop,
                        marginTop: 60,
                    }}
                    keyboardShouldPersistTaps="always">

                    {ndts}

                    {(
                        <SyncNdt 
                        containerStyle={styles.syncNdtStyle}
                        isAppBegin={false} 
                        onSuccess={(message) => this.onSyncSuccess(message)}
                        />
                    )}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 0,
        backgroundColor: "#ffffff"
    },
    syncNdtStyle: {
        marginTop: 15,
    },
    angle: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flex: 1,
        justifyContent: 'center'
    },
    ndt_container: {
        paddingVertical: 15,
        borderTopWidth: 0,
        borderColor: "#dddddd",
        borderBottomWidth: Util.pixel,
        borderColor: "#dddddd"
    },
    ndt_content_container: {
    },
    add_store_actions_box: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: "#ffffff",
    },
    add_store_action_btn: {
        paddingVertical: 4
    },
    add_store_action_btn_box: {
        alignItems: 'center',
        // width: ~~((Util.size.width - 16) / 2),
        width: ~~(Util.size.width / 2),
        borderRightWidth: Util.pixel,
        borderRightColor: '#ebebeb'
    },
    add_store_action_label: {
        fontSize: 12,
        color: '#404040',
        marginTop: 4
    },
    add_store_action_label: {
        fontSize: 12,
        color: '#404040',
        marginTop: 4
    },
    add_store_action_wallet_text: {
        fontSize: 15,
        color: '#404040',
        marginLeft: 3
    },
    add_store_action_wallet_content: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '700'
    },
    add_store_action_wallet: {
        flexDirection: 'row',
        alignItems: 'stretch',
        // paddingVertical: 8,
        paddingHorizontal: 8,
        // marginRight: 8
    },
})

export default NdtList;

const NdtRow = (props) => {
    let {ndt} = props;
    return (
            <TouchableHighlight
                style={[styles.ndt_container]}
                onPress={props.onPress}
            >
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 15
                    }}>
                        <Icon name="user" size={18} />
                        <Text style={{
                            fontWeight: '500',
                            color: "#444444",
                            fontSize: 18,
                            marginLeft: 5
                        }}>
                            {ndt.mcc_investor_username}
                        </Text>
                    </View>


                    <View style={[styles.ndt_content_container]}>
                        <View style={styles.add_store_actions_box}>
                            <View
                                // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                                underlayColor="transparent"
                                style={styles.add_store_action_btn}>
                                <View style={styles.add_store_action_btn_box}>
                                    <View style={styles.add_store_action_wallet}>
                                        <Icon style={{ color: 'blue' }} name="credit-card" size={16} color="#333333" />
                                        <Text style={styles.add_store_action_wallet_text}>Đầu tư</Text>
                                    </View>
                                    <Text style={styles.add_store_action_wallet_content}>
                                    {ndt.mcc_investor_invest_balance}
                                    </Text>
                                </View>
                            </View>

                            <View
                                // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                                underlayColor="transparent"
                                style={styles.add_store_action_btn}>
                                <View style={styles.add_store_action_btn_box}>
                                    <View style={[styles.add_store_action_wallet]}>
                                        <Icon style={{ color: 'red' }} name="credit-card" size={16} color="#333333" />
                                        <Text style={styles.add_store_action_wallet_text}>Tiền mặt</Text>
                                    </View>
                                    <Text style={styles.add_store_action_wallet_content}>
                                    {ndt.mcc_investor_lending_balance}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.add_store_actions_box}>
                            <View
                                // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                                underlayColor="transparent"
                                style={styles.add_store_action_btn}>
                                <View style={styles.add_store_action_btn_box}>
                                    <View style={styles.add_store_action_wallet}>
                                        <Icon style={{ color: '#cc9900' }} name="credit-card" size={16} color="#333333" />
                                        <Text style={styles.add_store_action_wallet_text}>Sản phẩm</Text>
                                    </View>
                                    <Text style={styles.add_store_action_wallet_content}>
                                    {ndt.mcc_investor_product_balance}
                                    </Text>
                                </View>
                            </View>

                            <View
                                // onPress={() => {Communications.phonecall(this.state.store_data.tel, true)}}
                                underlayColor="transparent"
                                style={styles.add_store_action_btn}>
                                <View style={styles.add_store_action_btn_box}>
                                    <View style={styles.add_store_action_wallet}>
                                        <Icon style={{ color: 'green' }} name="credit-card" size={16} color="#333333" />
                                        <Text style={styles.add_store_action_wallet_text}>Đầu tư 4.0</Text>
                                    </View>
                                    <Text style={styles.add_store_action_wallet_content}>
                                    {ndt.mcc_investor_invest_40_balance}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.angle]}>
                            <Icon name="angle-right" size={24} color="#999999" />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
    )
} 