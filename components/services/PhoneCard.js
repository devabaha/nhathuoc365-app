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

@observer
export default class PhoneCard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    _unMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={{
                        marginBottom: 0,
                        height: '50%'
                    }}>
                    {/* Block chon nha mang */}

                    <View style={styles.provinder_box}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={[
                                {key: '../../images/viettel.png'},
                                {key: '../../images/vinaphone'},
                                {key: '../../images/mobiphone'},
                                {key: '../../images/vietnammobile'}
                            ]}
                            renderItem={({item}) =>
                                <TouchableHighlight
                                    underlayColor="transparent"
                                    style={styles.provinder_box_action_btn}>
                                    <View style={styles.provinder_box_action_logo}>
                                        <Image
                                            style={{width: 135, height: 68}}
                                            source={require('../../images/viettel.png')}
                                        />
                                    </View>
                                </TouchableHighlight>
                            }
                            />
                    </View>

                    {/* Block chon menh gia the */}
                    <View style={styles.block_choose_price_option}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.input_label_header}>Chọn mệnh giá thẻ</Text>
                        </View>

                        <View style={styles.choose_price_option}>
                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        10.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        20.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        50.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        100.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        200.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        300.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                underlayColor="transparent"
                                style={styles.choose_price_option_touchab}>
                                <View style={styles.action_btn_choose_price}>
                                    <Text style={styles.btn_choose_price_option}>
                                        500.000 đ
                                    </Text>
                                </View>
                            </TouchableHighlight>
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

                    {/*Block Continue */}
                    <TouchableHighlight
                        underlayColor="transparent"
                        style={[styles.block_continue]}>
                        <View style={[
                            styles.block_continue_content,
                            {flexDirection: 'row'}
                        ]}>
                            <View style={styles.block_continue_content_label}>
                                <Text style={styles.blocl_continue_input_label}>Chiết khấu</Text>
                                <View style={styles.block_continue_content_label_right}>
                                    <Text style={styles.blocl_continue_input_label}>10%</Text>
                                </View>
                            </View>
                            <View style={styles.block_continue_content_label}>
                                <Text style={styles.blocl_continue_input_label}>Số tiền thanh </Text>
                                <View style={styles.block_continue_content_label_right}>
                                    <Text style={styles.blocl_continue_input_label}>18.000 đ</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.btn_phone_card_next,
                                {flexDirection: 'row'}
                            ]}>
                                <Button style={styles.block_continue_btn}
                                        color="#fff"
                                        backgroundColor="#812384"
                                        title="TIẾP TỤC"
                                />
                            </View>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
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
        paddingVertical: 8,
        backgroundColor: DEFAULT_COLOR,
        borderBottomWidth: Util.pixel,
        borderTopWidth: Util.pixel,
        borderColor: "#ffffff",
        marginTop: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    provinder_box_action_btn: {
        paddingVertical: 10,
        paddingHorizontal: 15,
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
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    choose_price_option: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingTop: 5,
        // backgroundColor: "red",
        justifyContent: 'center',
    },
    choose_price_option_touchab: {
        padding: 5,
    },
    action_btn_choose_price: {
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
        // width: 100,
        width: ~~((Util.size.width) / 5),
        borderWidth: Util.pixel,
        borderColor: '#ebebeb',
        backgroundColor: DEFAULT_COLOR,
        flexDirection: 'row',
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
        minHeight: 100,
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
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0,
        width: '100%',
        marginBottom: 50,
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
        padding: 20,
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
        height: 45,
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
                height: 50,
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
        // backgroundColor: "#ffffff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7
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
    lineView: {
        height: 1,
        width: "100%",
        backgroundColor: "rgb(225,225,225)"
    }
});
