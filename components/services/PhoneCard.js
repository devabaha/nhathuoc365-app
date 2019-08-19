/* @flow */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Switch,
    Keyboard,
    ScrollView,
    Alert,
    Image,
    FlatList,
    Platform
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions, ActionConst} from 'react-native-router-flux';
import {Button} from '../../lib/react-native-elements';

const TELCO_SERVICE = [
    {
        id: 'telco_viettel',
        title: 'viettel',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/hbb/h20/15165210132510.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '1',
                    value: 10000,
                    label: '10.000 đ',
                    discount: 2
                },
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2
                },
                {
                    telco_id: '1',
                    id: '3',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10
                },
            ]
    },
    {
        id: 'telco_mobiphone',
        title: 'mobiphone',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/he9/hac/15165210066974.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2
                },
                {
                    telco_id: '1',
                    id: '3',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10
                },
            ]
    },
    {
        id: 'telco_vinaphone',
        title: 'vinaphone',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/h58/hd1/15165210329118.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2
                },
                {
                    telco_id: '1',
                    id: '3',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10
                },
            ]
    },
    {
        id: 'telco_vietnammobile',
        title: 'vietnammobile',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/h65/h8a/15165210296350.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2
                },
                {
                    telco_id: '1',
                    id: '3',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10
                },
            ]
    }
];

@observer
export default class PhoneCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            telco: '',
            price_list: [],
            price: 0,
            discount: 0,
            pay: 0,
            pressStatus: false,
            selected: (new Map(): Map<string, boolean>)
        }
    }

    componentDidMount() {
        console.log(this.state);
    }

    _unMount() {
    }

    onPress = () => {
        this.setState({
            telco: true,
        });
    }

    onPressChooseTelco(telco_id, price_list) {
        console.log(telco_id);
        // console.log(this.state);

        this.setState({
            telco: telco_id,
            price: 0,
            discount: 0,
            pay: 0,
            price_list: price_list
        }, () => console.log(this.state));
    }

    onPressChoosePrice(telco_id, price, discount) {
        if (this.state.telco === '') {
            return Alert.alert(
                'Thông báo',
                'Bạn cần chọn nhà  tiếp tục',
                [
                    {
                        text: 'Đồng ý', onPress: () => {
                        }
                    },
                ],
                {cancelable: false}
            );
        } else {
            let pay = price - (price * discount) / 100;
            this.setState({
                price: price,
                discount: discount,
                pay: pay,
            }, () => console.log(this.state));
        }
    }

    onPressContinue() {
        if (this.state.pay === 0) {
            return Alert.alert(
                'Thông báo',
                'Bạn cần chọn nhà mạng và mệnh gía thẻ trước khi tiếp tục.',
                [
                    {
                        text: 'Đồng ý', onPress: () => {
                        }
                    },
                ],
                {cancelable: false}
            );
        } else {
            return Alert.alert(
                'Thông báo',
                'OK',
                [
                    {
                        text: 'Đồng ý', onPress: () => {
                        }
                    },
                ],
                {cancelable: false}
            );
        }
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        console.log(this.state);
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={{
                        marginBottom: 150,
                    }}>
                    {/* Block chon nha mang */}

                    <View style={styles.provinder_box}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={TELCO_SERVICE}
                            extraData={this.state}
                            renderItem={({item, index, separators}) => (
                                <TouchableHighlight
                                    id={item.id}
                                    // onPress={this.onPress}
                                    underlayColor="transparent"
                                    onPress={() => this.onPressChooseTelco(item.id, item.price_list)}
                                    keyExtractor={this._keyExtractor}
                                    selected={!!this.state.selected.get(item.id)}
                                    style={this.state.telco === item.id
                                        ? styles.provinder_box_action_btn_active
                                        : styles.provinder_box_action_btn}>
                                    <View style={styles.provinder_box_action_logo}>
                                        <Image
                                            style={{width: 135, height: 68}}
                                            source={{uri: item.logo}}
                                        />
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                    </View>

                    {/* Block chon menh gia the */}
                    <View style={styles.block_choose_price_option}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.input_label_header}>
                                {this.state.telco === ''
                                    ? "Vui lòng chọn nhà mạng"
                                    : "Chọn mệnh giá thẻ"}
                            </Text>
                        </View>

                        <View style={styles.choose_price_option}>
                            {this.state.price_list.map((item, key) => {
                                return (
                                    <TouchableHighlight
                                        onPress={() => this.onPressChoosePrice(item.telco_id, item.value, item.discount)}
                                        keyExtractor={this._keyExtractor}
                                        selected={!!this.state.selected.get(item.id)}
                                        style={[styles.buttonAction, {
                                            marginRight: 6
                                        },]}
                                        underlayColor="transparent">
                                        <View
                                            style={this.state.price === item.value
                                                ? styles.boxButtonActionChoosePriceActive
                                                : styles.boxButtonActionChoosePrice}>
                                            <Text
                                                style={this.state.price === item.value
                                                    ? styles.buttonActionTitleActive
                                                    : styles.buttonActionTitle}>{item.label}</Text>
                                        </View>
                                    </TouchableHighlight>
                                );
                            })}
                        </View>
                    </View>

                    {/* Block thong tin chi tiet*/}
                    <View style={styles.block_help_box}>
                        <TouchableHighlight underlayColor="#ffffff">
                            <View>
                                <Text style={styles.input_label_header}>Hướng dẫn</Text>
                                <Text style={styles.input_label_help}>
                                    1. Lợi ích khi nạp thẻ trực tuyến tại TickID
                                </Text>
                                <Text style={styles.input_label_help}>
                                    2. Mua thẻ cào online chiết khấu cao ở đâu?
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                </ScrollView>

                {/*Block Continue */}
                <TouchableHighlight
                    underlayColor="transparent"
                    style={[styles.block_continue]}
                    onPress={() => this.onPressContinue()}>
                    <View style={[
                        styles.block_continue_content,
                        {flexDirection: 'row'}
                    ]}>
                        <View style={styles.block_continue_content_label}>
                            <Text style={styles.blocl_continue_input_label}>Chiết khấu</Text>
                            <View style={styles.block_continue_content_label_right}>
                                <Text style={styles.blocl_continue_input_label}>{this.state.discount} %</Text>
                            </View>
                        </View>
                        <View style={styles.block_continue_content_label}>
                            <Text style={styles.blocl_continue_input_label}>Số tiền thanh </Text>
                            <View style={styles.block_continue_content_label_right}>
                                <Text style={styles.blocl_continue_input_label}>{this.state.pay} đ</Text>
                            </View>
                        </View>

                        <View style={[styles.boxButtonAction, {
                            width: Util.size.width - 160,
                            backgroundColor: DEFAULT_COLOR,
                            borderColor: "#999999",
                            marginTop: 5,
                        }]}>
                            <Text style={[styles.buttonActionTitle, {
                                color: "#ffffff"
                            }]}>Tiếp tục</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...MARGIN_SCREEN,
        marginBottom: 0
    },
    input_label_header: {
        fontSize: 15,
        color: "#000000",
        fontWeight: 'bold',
    },
    // Chon nha mang
    provinder_box: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: DEFAULT_COLOR,
        borderBottomWidth: Util.pixel,
        borderTopWidth: Util.pixel,
        borderColor: "#ffffff",
    },
    provinder_box_action_btn: {
        marginVertical: 5,
        marginHorizontal: 15,
        opacity: 0.6
    },
    provinder_box_action_btn_active: {
        marginVertical: 5,
        marginHorizontal: 15,
        opacity: 1
    },
    provinder_box_action_logo: {
        alignItems: 'center',
        justifyContent: 'center',
        width: ~~(Util.size.width / 4),
        marginRight: 15,
    },
    // Chon menh gia the
    block_choose_price_option: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderBottomWidth: Util.pixel,
        borderBottomColor: "#dddddd",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    choose_price_option: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        paddingHorizontal: 5,
        paddingTop: 5,
        // backgroundColor: "red",
        justifyContent: 'center',
    },
    choose_price_option_touchab: {
        padding: 5,
    },
    action_btn_choose_price: {
        alignItems: 'stretch',
        justifyContent: 'center',
        // flex: 1,
        // width: 100,
        width: ~~((Util.size.width) / 5),
        borderWidth: Util.pixel,
        borderColor: '#ebebeb',
        backgroundColor: DEFAULT_COLOR,
        flexDirection: 'row',
    },
    boxButtonActionChoosePrice: {
        flexDirection: 'row',
        borderWidth: Util.pixel,
        borderColor: "#666666",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: Util.size.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    boxButtonActionChoosePriceActive: {
        flexDirection: 'row',
        borderWidth: Util.pixel,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: Util.size.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: DEFAULT_COLOR,
        borderColor: "#999999",
    },
    btn_choose_price_option: {
        width: '100%',
        height: 45,
        lineHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        color: "#fff",
        textAlign: 'center',
        fontSize: 13,
        ...Platform.select({
            ios: {
                width: 200,
            },
        }),
    },
    input_box: {
        width: '100%',
        height: 52,
        backgroundColor: "#ffffff",
        borderBottomWidth: Util.pixel,
        borderBottomColor: "#dddddd",
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    input_text_box: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    input_label: {
        fontSize: 14,
        color: "#000000"
    },
    input_text: {
        width: '96%',
        height: 44,
        paddingLeft: 8,
        color: "#000000",
        fontSize: 14,
        textAlign: 'right',
        paddingVertical: 0
    },
    // Help
    block_help_box: {
        width: '100%',
        // minHeight: 100,
        backgroundColor: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderBottomWidth: Util.pixel,
        borderBottomColor: "#dddddd",
        borderTopWidth: Util.pixel,
        borderTopColor: "#dddddd",
    },
    input_label_help: {
        fontSize: 12,
        marginTop: 2,
        color: "#666666"
    },
    input_address_text: {
        width: '100%',
        color: "#000000",
        fontSize: 14,
        marginTop: 4,
        paddingVertical: 0
    },
    //Block Continue
    block_continue: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
    },
    block_continue_content: {
        // width: '100%',
        // height: '100%',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        margin: 10,
        padding: 10,
        borderWidth: Util.pixel,
        borderColor: DEFAULT_COLOR,
    },
    block_continue_content_label_right: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    block_continue_content_label: {
        width: '100%',
        height: 35,
        backgroundColor: "#ffffff",
        borderBottomWidth: Util.pixel,
        borderBottomColor: "#dddddd",
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn_phone_card_next: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 5,
        ...Platform.select({
            ios: {
                width: 250,
                height: 40,
            },
        }),
    },
    block_continue_btn: {
        backgroundColor: DEFAULT_COLOR,
        color: '#fff',
        width: '100%',
    },
    blocl_continue_input_label: {
        fontSize: 14,
        color: "#000000",
        fontWeight: 'bold'
    },
    separator: {
        width: '100%',
        height: Util.pixel,
        backgroundColor: "#cccccc"
    },
    right_title_btn_box: {
        flex: 1,
        alignItems: 'flex-end'
    },
    boxButtonActions: {
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16
    },
    boxButtonAction: {
        flexDirection: 'row',
        borderWidth: Util.pixel,
        borderColor: "#666666",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        width: Util.size.width / 2 - 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonActionTitle: {
        color: "#333333",
        marginLeft: 4,
        fontSize: 14
    },
    buttonActionTitleActive: {
        color: "#ffffff",
        marginLeft: 4,
        fontSize: 14
    },
    lineView: {
        height: 1,
        width: "100%",
        backgroundColor: "rgb(225,225,225)"
    },
    button: {
        borderColor: "#000066",
        borderWidth: 1,
        borderRadius: 10
    },
    buttonPress: {
        borderColor: "#000066",
        backgroundColor: "#000066",
        borderWidth: 1,
        borderRadius: 10
    }
});
