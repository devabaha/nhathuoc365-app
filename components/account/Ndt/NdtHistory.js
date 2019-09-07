/* @flow */

import React, { Component } from 'react';
import {
    View,
    TouchableHighlight,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Animated
} from 'react-native';

//Library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../../../store/Store';
import { toJS } from 'mobx';

const CASH_MESSAGE = "Ví Tiền mặt được rút về App vào cuối tháng.\nTrong tháng được rút về ví Tạm ứng trên App để tiêu dùng trong chuỗi Macca Cafe.";
const PRODUCT_MESSAGE = "Ví Sản phẩm được rút về App vào cuối tháng.\nĐược sử dụng để mua trong cửa hàng TickID."
const formatDate = (date) => {
    date = new Date(date);
    return date.getDate() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear()
}

@observer
class NdtHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingHistory: true,
            loadingHistoryWithdraw: true,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loading) {
            this._getData();
        }
    }

    componentDidMount() {
        if (this.props.loading) {
            this._getData();
        }
    }

    _getData = () => {
        this._getInvestorHistory(0);
        this._getInvestorHistory(1);

    }

    _getInvestorHistory(apiType) {
        let { ndt, type } = this.props;
        let data = {
            mcc_username: ndt.mcc_investor_username,
            type,
            page: 1
        }
        let state = this.state;
        let loadingType = apiType === 0
            ? "loadingHistoryWithdraw"
            : "loadingHistory"
        state[loadingType] = true;

        this.setState({
            ...state
        }, async () => {
            try {
                var response = await APIHandler[apiType === 0
                    ? "investor_historywithdraw"
                    : "investor_history"](data);
                let state = this.state;
                state[loadingType] = false;

                if (this.props.loading
                    && !state.loadingHistory
                    && !state.loadingHistoryWithdraw) {
                    this.props.onLoaded();
                }

                if (response && response.status == STATUS_SUCCESS) {
                    let attrName = type === "0"
                        ? (apiType === 0
                            ? "ndt_cash_withdraw_history"
                            : "ndt_cash_input_history")
                        : (apiType === 0
                            ? "ndt_product_withdraw_history"
                            : "ndt_product_input_history");
                    store.updateNdtHistory({
                        mcc_investor_username: ndt.mcc_investor_username,
                        data: response.data
                    }, attrName);


                } else if (response) {
                    Toast.show(response.message, Toast.SHORT);
                }
                this.setState({
                    ...state
                });
            } catch (e) {
                console.log(e + ' investor_history');
                store.addApiQueue('investor_history', this._getInvestorHistory);
            }
        });
    }

    goToWithdraw = (isAdvance) => {
        let { ndt, type } = this.props;
        let title = type === "0" ? "Tiền mặt" : "Sản phẩm";
        if (isAdvance) {
            title = "Tạm ứng";
            type = "2";
        }
        Actions.view_ndt_withdraw({
            title,
            ndt,
            typeWallet: type
        })
    }

    render() {
        let { title, type, ndt } = this.props;
        let {
            loadingHistory,
            loadingHistoryWithdraw
        } = this.state;
        let ndt_history = store.getNdtHistory(ndt.mcc_investor_username);
        let inputHistory = null;
        let withdrawHistory = null;

        if (ndt_history) {
            inputHistory = ndt_history.data[type === "0"
                ? "ndt_cash_input_history"
                : "ndt_product_input_history"];
            withdrawHistory = ndt_history.data[type === "0"
                ? "ndt_cash_withdraw_history"
                : "ndt_product_withdraw_history"];

            inputHistory = inputHistory && inputHistory.map((d, i) =>
                <Row data={d} key={i} />
            )
            withdrawHistory = withdrawHistory && withdrawHistory.map((d, i) =>
                <Row data={d} key={i} />
            )
        }


        return (
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 15,
                    width: Util.size.width,
                }}
                keyboardShouldPersistTaps="always"
                refreshControl={
                    <RefreshControl
                        refreshing={loadingHistory || loadingHistoryWithdraw}
                        onRefresh={this._getData.bind(this)}
                    />
                }
            >
                <View style={{
                    paddingVertical: 10,
                    flexDirection: 'column'
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#404040',
                        fontSize: 18
                    }}>
                        {title}
                    </Text>
                    <View style={{
                        flex: 1,
                        // flexDirection: 'row',
                        padding: 10
                    }}
                    >
                        <View style={{ flex: 1 }}>
                            {type === "0"?
                            (<Text>Thông tin lịch sử rút tiền và thu nhập ví Tiền mặt trên Web Nhà đầu tư</Text>)
                            :(<Text>Thông tin lịch sử rút tiền và thu nhập ví Sản phẩm trên Web Nhà đầu tư</Text>)}
                        </View>
                        {type === "0" &&
                            <View style={{ flex: 1 }}>
                                <TouchableHighlight
                                    underlayColor="transparent"
                                    style={styles.btn_container}
                                    onPress={this.goToWithdraw.bind(this, true)}
                                >
                                    <View style={[styles.empty_box_btn, isIOS && { height: '100%' }]}>
                                        <Text style={styles.empty_box_btn_title}>
                                            Rút tạm ứng về App
                                    </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        }
                    </View>
                    {/* <Text style={{
                        fontSize: 16,
                        color: '#404040',
                        paddingHorizontal: 10
                    }}>
                        {type === "0" ? CASH_MESSAGE : PRODUCT_MESSAGE}
                    </Text> */}
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#404040',
                        fontSize: 18
                    }}>
                        Lịch sử Rút tiền
                    </Text>
                    {withdrawHistory}
                </View>

                <View style={{
                    marginTop: 15
                }}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#404040',
                        fontSize: 18
                    }}>
                        Lịch sử Thu nhập
                    </Text>
                    {inputHistory}
                </View>
            </ ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    row_container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingHorizontal: 10
    },
    row: {
        flexDirection: 'row'
    },
    icon_container: {
        justifyContent: 'center',
        marginRight: 15
    },
    contents: {
        flexDirection: 'column'
    },
    middle: {
    },
    title: {
        fontSize: 18,
        color: '#404040'
    },
    des: {
        fontSize: 14,
        color: '#333333'
    },
    end: {
        alignItems: 'center',
    },
    money: {
        fontWeight: '800',
        color: '#404040',
        fontSize: 16
    },
    status: {
        color: 'green',
        fontSize: 14
    },
    btn_container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,

    },
    empty_box_btn: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: Util.pixel,
        borderColor: DEFAULT_COLOR,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 12,
        borderRadius: 5,
        backgroundColor: DEFAULT_COLOR,
    },
    empty_box_btn_title: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: 'center'
    }
})

export default NdtHistory;

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0)
        };
    }

    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }

    render() {
        let { DateGet, Type, Money } = this.props.data;
        return (
            <Animated.View style={[
                styles.row_container,
                {
                    opacity: this.state.opacity
                }
            ]}>
                <View style={[styles.row]}>
                    <View style={[styles.icon_container]}>
                        <Icon name={"plus-square"} size={36} color="black" />
                    </View>
                    <View style={[styles.contents, styles.middle]}>
                        <Text style={[styles.title]}>
                            {Type}
                        </Text>
                        <Text style={[styles.des]}>
                            {formatDate(DateGet)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.contents, styles.end]}>
                    <Text style={[styles.money]}>
                        {`+${Money.formatMoney()}đ`}
                    </Text>
                </View>
            </Animated.View>
        );
    }
}
