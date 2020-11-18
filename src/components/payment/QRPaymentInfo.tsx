import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, View, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { TFunction } from 'i18next';
//@ts-ignore
import appConfig from 'app-config';
import Button from '../Button';
import Input from '../account/Transfer/Payment/Input';
import { Actions } from 'react-native-router-flux';
import { formatMoney } from '../account/Transfer/Payment/helper';
import EventTracker from '../../helper/EventTracker';

export interface QRPaymentInfoProps {
    logoUrl: string
    name: string
    address: string
    t: TFunction
    wallet: {
        min_transfer: string
        max_transfer: string
        symbol: string
        //...others
    }
    receiver: {
        avatar: string
        name: string
        //...others
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainerStyle: {
        flexGrow: 1
    },
    scrollView: {
        backgroundColor: '#eae9ef'
    },
    box: {
        backgroundColor: 'white',
        marginTop: 60,
        marginBottom: 10,
        paddingBottom: 15,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        justifyContent: 'flex-end'
    },
    user: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        top: -40
    },
    avatarContainer: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        borderRadius: 40,
        borderColor: appConfig.colors.primary,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: '#f5f5f5',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1
    },
    shortContactNameContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
    shortContactName: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold'
    },
    informationContainer: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginTop: 15,
        fontSize: 18
    },
    subTitle: {
        marginTop: 5,
        color: '#a5a5a5',
        fontSize: 16
    }
})

class QRPaymentInfo extends Component<QRPaymentInfoProps> {
    static defaultProps = {
        name: "",
        address: "",
        wallet: {
            min_transfer: "",
            max_transfer: "",
            symbol: ""
        },
        receiver: {
            avatar: "",
            name: ""
        }
    }
    state = {
        moneyValue: '',
        moneyError: ''
    };
    moneyInput = React.createRef<any>();
    eventTracker = new EventTracker();

    componentDidMount() {
        this.eventTracker.logCurrentView();
    }

    componentWillUnmount() {
        this.eventTracker.clearTracking();
    }

    goToConfirm = () => {
        if (this.moneyInput.current) {
            const isValid = this.checkValidate(this.moneyInput.current.inputText);
            if (isValid) {
                const price =
                    this.moneyInput.current.formattedText +
                    ' ' +
                    this.props.wallet.symbol;

                Actions.push(appConfig.routes.transferConfirm, {
                    receiver: this.props.receiver,
                    wallet: this.props.wallet,
                    originPrice: this.moneyInput.current.inputText,
                    price,
                    originTotalPrice: this.moneyInput.current.formattedText,
                    totalPrice: price
                });
            }
        }
    };

    checkValidate(text) {
        let moneyError = '';
        const min_transfer_view = formatMoney(this.props.wallet.min_transfer);
        const max_transfer_view = formatMoney(this.props.wallet.max_transfer);
        const { t } = this.props;

        try {
            if (!text) {
                moneyError = t('validate.empty');
            } else if (text < Number(this.props.wallet.min_transfer)) {
                moneyError = t('validate.min', {
                    money: min_transfer_view + this.props.wallet.symbol
                });
            } else if (text > Number(this.props.wallet.max_transfer)) {
                moneyError = t('validate.max', {
                    money: max_transfer_view + this.props.wallet.symbol
                });
            }

            this.setState({ moneyError });

            return !!!moneyError;
        } catch (err) {
            console.log('money input error', err);
        }

        return false;
    }

    clearMoneyError = () => {
        this.setState({ moneyError: '' });
    };

    handleOnBlurMoney = () => {
        const text = this.moneyInput.current
            ? this.moneyInput.current.inputText
            : '';
        this.checkValidate(text);
    };

    onChange(e, value) {
        this.setState({ moneyValue: value });
        this.checkValidate(value);
    }

    renderAvatar() {
        let shortTitle = '',
            contactName = this.props.receiver.name, contactNames = [];

        if (contactName) {
            contactNames = contactName.split(' ');
            contactNames.map(
                (name, index) =>
                    index <= 2 && (shortTitle += name.charAt(0).toUpperCase())
            );
        }

        return (
            !!this.props.receiver.avatar
                ? <Image
                    style={styles.avatar}
                    source={{ uri: this.props.receiver.avatar }}
                    resizeMode="cover"
                />
                : <View style={styles.shortContactNameContainer}>
                    <Text style={styles.shortContactName}>{shortTitle}</Text>
                </View>

        );
    };

    render() {
        const { t } = this.props;
        const disabled = this.state.moneyError || !!!this.state.moneyValue;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={appConfig.device.isIOS ? 'padding' : null}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        style={[styles.container, styles.scrollView]}
                        contentContainerStyle={styles.contentContainerStyle}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.box}>
                            <View style={styles.user}>
                                <View style={styles.avatarContainer}>
                                    {this.renderAvatar()}
                                </View>

                                <View style={styles.informationContainer}>
                                    <Text style={styles.title}>{this.props.name}</Text>
                                    <Text style={styles.subTitle}>{this.props.address}</Text>
                                </View>
                            </View>

                            <Input
                                ref={this.moneyInput}
                                placeholder={t('input.money.placeholder')}
                                keyboardType="number-pad"
                                title={t('input.money.title')}
                                errorMess={this.state.moneyError}
                                onChange={this.onChange.bind(this)}
                                onClear={this.handleOnBlurMoney}
                                onBlur={this.handleOnBlurMoney}
                                value={this.state.moneyValue}
                            />
                        </View>
                    </ScrollView>
                    <Button disabled={disabled} title={t('transferBtnTitle')} onPress={this.goToConfirm} />
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

//@ts-ignore
export default withTranslation(['payment', 'common'])(QRPaymentInfo);