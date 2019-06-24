import React, { Component } from 'react';

import {
    View,
    TouchableHighlight,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

// import {Scene} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';

const DATA = [
    {
        icon: "plus-square",
        title: "Lãi KD và gốc",
        des: "18/06/2018",
        money: "+120.000đ",
        status: "Chờ duyệt"
    },
    {
        icon: "plus-square",
        title: "Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc Lãi KD và gốc",
        des: "18/06/2018",
        money: "+120.000đ",
        status: "Thành công"
    },
    {
        icon: "plus-square",
        title: "Lãi KD và gốc",
        des: "18/06/2018",
        money: "+120.000đ",
        status: "Thành công"
    },
]

class NdtCashInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const data = DATA.map((d, i) =>
            <Row data={d} key={i} />
        )
        return (
            <ScrollView
                style={{
                    marginTop: 60,
                    marginHorizontal: 15
                }}
            >
                <View>
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
                            Lịch sử thu nhập ví Tiền mặt
                        </Text>
                    </View>
                </View>

                {data}
                <TouchableHighlight
                    underlayColor="transparent"
                    style={styles.btn_container}
                >
                    <View style={styles.empty_box_btn}>
                        <Text style={styles.empty_box_btn_title}>
                            Tải thêm
                        </Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    row_container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 15,
    },
    icon_container: {
        width: '10%',
        justifyContent: 'center'
    },
    contents: {
        flexDirection: 'column'
    },
    middle: {
        width: '70%'
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
        width: '20%',
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
        color: "#ffffff"
    }
})

export default NdtCashInput;

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { icon, title, des, money, status } = this.props.data;
        return (
            <View style={[styles.row_container]}>
                <View style={[styles.icon_container]}>
                    <Icon name={icon} size={36} color="black" />
                </View>
                <View style={[styles.contents, styles.middle]}>
                    <Text style={[styles.title]}>
                        {title}
                    </Text>
                    <Text style={[styles.des]}>
                        {des}
                    </Text>
                </View>
                <View style={[styles.contents, styles.end]}>
                    <Text style={[styles.money]}>
                        {money}
                    </Text>
                    <Text style={[styles.status]}>
                        {status}
                    </Text>
                </View>
            </View>
        );
    }
}
