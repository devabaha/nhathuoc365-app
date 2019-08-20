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
        title: 'Viettel',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/hbb/h20/15165210132510.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '1',
                    value: 10000,
                    label: '10.000 đ',
                    discount: 2,
                    discount_label: '300 đ'
                },
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2,
                    discount_label: '500 đ'
                },
                {
                    telco_id: '1',
                    id: '3',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4,
                    discount_label: '1500 đ'
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4,
                    discount_label: '10.000 đ'
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10,
                    discount_label: '10.000 đ'
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10,
                    discount_label: '10.000 đ'
                },
            ]
    },
    {
        id: 'telco_mobiphone',
        title: 'Mobiphone',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/he9/hac/15165210066974.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '1',
                    value: 10000,
                    label: '10.000 đ',
                    discount: 2,
                    discount_label: '300 đ'
                },
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2,
                    discount_label: '500 đ'
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 4,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 200000,
                    label: '200.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
            ]
    },
    {
        id: 'telco_vinaphone',
        title: 'Vinaphone',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/h58/hd1/15165210329118.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '1',
                    value: 10000,
                    label: '10.000 đ',
                    discount: 2,
                    discount_label: '300 đ'
                },
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2,
                    discount_label: '500 đ'
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4,
                    discount_label: '4000 đ'
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
            ]
    },
    {
        id: 'telco_vietnammobile',
        title: 'Vietnammobile',
        logo: 'https://media-ak.static-adayroi.com/sys_master/images/h65/h8a/15165210296350.png',
        price_list:
            [
                {
                    telco_id: '1',
                    id: '1',
                    value: 10000,
                    label: '10.000 đ',
                    discount: 2,
                    discount_label: '300 đ'
                },
                {
                    telco_id: '1',
                    id: '2',
                    value: 20000,
                    label: '20.000 đ',
                    discount: 2,
                    discount_label: '500 đ'
                },
                {
                    telco_id: '1',
                    id: '4',
                    value: 100000,
                    label: '100.000 đ',
                    discount: 4,
                    discount_label: '4000 đ'
                },
                {
                    telco_id: '1',
                    id: '5',
                    value: 50000,
                    label: '50.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '6',
                    value: 300000,
                    label: '300.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
                },
                {
                    telco_id: '1',
                    id: '7',
                    value: 500000,
                    label: '500.000 đ',
                    discount: 10,
                    discount_label: '10000 đ'
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
            price_select: '',
            discount_label: '',
            pressStatus: false,
            selected: (new Map(): Map<string, boolean>)
        }
    }

    componentDidMount() {

    }

    _unMount() {
    }

    onPress = () => {
        this.setState({
            telco: true,
        });
    }

    onPressChooseTelco(telco_id, price_list) {
        // Fix for api
        let discount = 4;
        let price = 50000;
        let pay = price - (price * discount) / 100;
        this.setState({
            telco: telco_id,
            price: 50000,
            discount: discount,
            pay: pay,
            price_select: '50.000 đ',
            price_list: price_list,
            discount_label: '5000 đ'
        }, () => console.log());
    }

    onPressChoosePrice(telco_id, price, discount, label, discount_label) {
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
                price_select: label,
                discount_label: discount_label,
            }, () => console.log());
        }
    }

    render() {
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
                            ref="telco_list"
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={TELCO_SERVICE}
                            extraData={this.state}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={
                                () => <View style={{ width: ~~(Util.size.width / 25)}}/>
                            }
                            renderItem={({item}) => (
                                <TouchableHighlight
                                    id={item.id}
                                    underlayColor="transparent"
                                    onPress={() => this.onPressChooseTelco(item.title, item.price_list)}
                                    style={this.state.telco === item.title
                                        ? styles.provinder_box_action_btn_active
                                        : styles.provinder_box_action_btn}>
                                    <View style={styles.provinder_box_action_logo}>
                                        <Image
                                            style={{
                                                width: ~~(Util.size.width / 5), height: 70, borderWidth: Util.pixel,
                                                borderColor: "#666666", borderRadius: 10,
                                            }}
                                            source={{uri: item.logo}}
                                        />
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                    </View>

                    {/* Block chon menh gia the */}
                    <View style={styles.block_choose_price_option}>
                        <View style={{flexDirection: 'row', alignItems: "center", marginBottom: 10,}}>
                            <Icon
                                style={styles.icon_label}
                                name="info-circle"
                                size={12}
                                color="#999999"
                            />
                            <Text style={styles.input_label_header}>
                                {this.state.telco === ''
                                    ? "Vui lòng chọn nhà mạng"
                                    : "Chọn mệnh giá thẻ"}
                            </Text>
                        </View>

                        <View style={styles.choose_price_option}>
                            {this.state.price_list.map((item) => {
                                return (
                                    <TouchableHighlight
                                        key={item.value}
                                        onPress={() => this.onPressChoosePrice(item.telco_id, item.value, item.discount, item.label, item.discount_label)}
                                        ref="price_list"
                                        underlayColor="transparent">
                                        <View
                                            style={this.state.price === item.value
                                                ? styles.boxButtonActionChoosePriceActive
                                                : styles.boxButtonActionChoosePrice}>
                                            <Text
                                                style={this.state.price === item.value
                                                    ? styles.buttonActionTitleActive
                                                    : styles.buttonActionTitle}>{item.label}</Text>
                                            <Text
                                                style={this.state.price === item.value
                                                    ? styles.buttonActionSubTitleActive
                                                    : styles.buttonActionSubTitle}>Hoàn lại {item.discount_label}</Text>
                                        </View>
                                    </TouchableHighlight>
                                );
                            })}
                        </View>
                    </View>

                    {/* Block thong tin chi tiet*/}
                    <View style={styles.block_help_box}>
                        <TouchableHighlight underlayColor="#ffffff">
                            <View style={{flexDirection: 'row', alignItems: "center", marginBottom: 10,}}>
                                <Icon
                                    style={styles.icon_label}
                                    name="question"
                                    size={12}
                                    color="#999999"
                                />
                                <Text style={styles.input_label_header}>Hướng dẫn</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.desc_content}>
                            <Text style={styles.input_label_help}>
                                1. Lợi ích khi nạp thẻ trực tuyến tại TickID
                            </Text>
                            <Text style={styles.input_label_help}>
                                2. Mua thẻ cào online chiết khấu cao ở đâu?
                            </Text>
                        </View>
                    </View>

                </ScrollView>

                {/*Block Continue */}
                <View
                    underlayColor="transparent"
                    style={[styles.block_continue]}>
                    <View style={[
                        styles.block_continue_content,
                        {flexDirection: 'row'}
                    ]}>
                        <View style={styles.block_continue_content_label}>
                            <Text style={styles.blocl_continue_input_label}>Thẻ điện thoại </Text>
                            <View style={styles.block_continue_content_label_right}>
                                <Text style={[styles.blocl_continue_input_label, {color: DEFAULT_COLOR}]}>{this.state.telco} {this.state.price_select}</Text>
                            </View>
                        </View>
                        <View style={styles.block_continue_content_label}>
                            <Text style={styles.blocl_continue_input_label}>Hoàn tiền</Text>
                            <View style={styles.block_continue_content_label_right}>
                                <Text style={[styles.blocl_continue_input_label, {color: DEFAULT_COLOR}]}>{this.state.pay !== 0
                                    ? this.state.discount_label + '(' + this.state.discount + '%)'
                                    : ''}</Text>
                            </View>
                        </View>
                        <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => {
                                Actions.phonecard_confirm({
                                    detail: this.state
                                });
                            }}
                            >
                            <View style={[styles.boxButtonAction, {
                                width: Util.size.width - 160,
                                backgroundColor: DEFAULT_COLOR,
                                borderColor: "#999999",
                                marginTop: 10,
                            }]}>
                                <Text style={[styles.buttonActionTitle, {
                                    color: "#ffffff"
                                }]}>Tiếp tục</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
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
        fontSize: 16,
        color: "#000000",
        marginLeft: 8
    },
    // Chon nha mang
    provinder_box: {
        // width: '100%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: "#ffffff",
        borderBottomWidth: Util.pixel,
        borderTopWidth: Util.pixel,
        borderColor: "#dddddd",
        borderBottomColor: "#dddddd",
    },
    provinder_box_action_btn: {
        width: ~~(Util.size.width / 5),
        // marginVertical: 5,
        // marginHorizontal: 5,
        opacity: 0.4,

    },
    provinder_box_action_btn_active: {
        width: ~~(Util.size.width / 5),
        // marginVertical: 5,
        // marginHorizontal: 5,
        opacity: 1
    },
    provinder_box_action_logo: {
        alignItems: 'center',
        justifyContent: 'center',
        // width: ~~(Util.size.width / 4),
        // marginRight: 15,
    },
    // Chon menh gia the
    block_choose_price_option: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderBottomWidth: Util.pixel,
        borderBottomColor: "#dddddd",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    choose_price_option: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // alignItems: 'stretch',
        justifyContent: 'space-between',
        // paddingHorizontal: 5,
        // paddingTop: 5,
        // backgroundColor: "red",
    },
    boxButtonActionChoosePrice: {
        flexDirection: 'column',
        flex: 1,
        borderWidth: Util.pixel,
        borderColor: "#666666",
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 5,
        width: Util.size.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    boxButtonActionChoosePriceActive: {
        flexDirection: 'column',
        flex: 1,
        borderWidth: Util.pixel,
        paddingVertical: 8,
        paddingHorizontal: 5,
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
        backgroundColor: "#ffffff",
        paddingHorizontal: 15,
        paddingVertical: 15,
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
    desc_content: {
        fontSize: 12,
        color: "#666666",
        marginLeft: 22
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
        padding: 10,
        paddingHorizontal: 15,
        borderTopWidth: Util.pixel,
        borderTopColor: '#dddddd',
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
        color: "#000",
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
        flexDirection: 'row',
        color: "#333333",
        marginLeft: 4,
        fontSize: 14
    },
    buttonActionTitleActive: {
        flexDirection: 'row',
        color: "#ffffff",
        marginLeft: 4,
        fontSize: 14
    },
    buttonActionSubTitle: {
        color: "#333333",
        marginLeft: 4,
        fontSize: 8
    },
    buttonActionSubTitleActive: {
        color: "#ffffff",
        marginLeft: 4,
        fontSize: 8
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
