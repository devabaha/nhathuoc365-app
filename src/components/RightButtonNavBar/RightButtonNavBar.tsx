import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appConfig from '../../config';
import store from '../../store';
import { RightButtonNavBarProps } from '.';
import { RIGHT_BUTTON_TYPE } from './constants';
import { NotiBadge } from '../Badges';

const styles = StyleSheet.create({
    right_btn_add_store: {
        paddingVertical: 1,
        paddingLeft: 10,
        paddingRight: 5,
        paddingTop: appConfig.device.isAndroid ? 4 : 0
    },
    icon: {
        color: '#fff',
        fontSize: 26
    },
    notiContainer: {
        right: -4,
        top: appConfig.device.isAndroid ? -2 : -4,
        borderColor: '#fff',
        borderWidth: .5,
        height: 16,
        minWidth: 16
        //@ts-ignore
        // ...elevationShadowStyle(2)
    }
});

class RightButtonNavBar extends Component<RightButtonNavBarProps> {
    state = {
        noti: 0,
    };

    componentDidMount() {
        this.updateNoti();
    }

    get icon() {
        if (this.props.icon) return this.props.icon;
        let Icon = null, name = "", extraStyle = {};
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                name = "shoppingcart";
                Icon = AntDesign;
                break;
            case RIGHT_BUTTON_TYPE.CHAT:
                name = "message1";
                Icon = AntDesign;
                break;
        }

        return <Icon name={name} style={[styles.icon, extraStyle, this.props.iconStyle]} />
    }

    handlePressIcon() {
        if (typeof this.props.onPress === "function") {
            this.props.onPress();
            return;
        }
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                this.handlePressCart();
                break;
        }
    }

    handlePressCart() {
        if (store.cart_data && store.cart_products) {
            if (store.cart_data.address_id != 0) {
                Actions.push(appConfig.routes.paymentConfirm, {
                    goConfirm: true
                });
            } else {
                Actions.create_address({
                    redirect: 'confirm'
                });
            }
        } else {
            Actions.push(appConfig.routes.ordersTab);
        }
    }

    updateNoti() {
        switch (this.props.type) {
            case RIGHT_BUTTON_TYPE.SHOPPING_CART:
                if (
                    (store.cart_data && (store.cart_data.count !== this.state.noti)) ||
                    (!store.cart_data && this.state.noti)
                ) {
                    this.setState({ noti: store.cart_data ? store.cart_data.count : 0 });
                }
                break;
            case RIGHT_BUTTON_TYPE.CHAT:
                if ((store.notify && store.notify.notify_chat !== this.state.noti) ||
                    (!store.notify && this.state.noti)) {
                    this.setState({ noti: store.notify ? store.notify.notify_chat : 0 });
                }
                break;
        }
    }

    render() {
        this.updateNoti();

        return (
            <TouchableHighlight
                underlayColor="transparent"
                onPress={this.handlePressIcon.bind(this)}
            >
                <View style={[
                    styles.right_btn_add_store,
                    this.props.containerStyle
                ]}>
                    {this.icon}
                    <NotiBadge
                        animation
                        show={this.state.noti}
                        label={this.state.noti}
                        containerStyle={styles.notiContainer}
                    />
                </View>
            </TouchableHighlight>
        );
    }
}

//@ts-ignore
export default observer(RightButtonNavBar);