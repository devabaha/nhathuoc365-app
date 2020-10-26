import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, GestureResponderEvent, Easing, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';
//@ts-ignore
import appConfig from 'app-config';

const IMAGE_WIDTH_CONTAINER = appConfig.device.width * .8;
const IMAGE_HEIGHT_CONTAINER = appConfig.device.height * .6;

const CLOSE_ICON_DIMENSION = 60;

const MARGIN_TOP_CLOSE_BTN = CLOSE_ICON_DIMENSION * .8;
const MARGIN_LEFT_CLOSE_BTN = CLOSE_ICON_DIMENSION * .5;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 99999,
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,.8)',
        width: '100%',
        height: '100%',
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        position: 'absolute',
        width: CLOSE_ICON_DIMENSION,
        height: CLOSE_ICON_DIMENSION,
        zIndex: 9
    },
    iconContainer: {
        borderRadius: 15,
        // padding: 10,
    },
    icon: {
        fontSize: 40,
        color: '#fff'
    },
    imageContainer: {
        width: IMAGE_WIDTH_CONTAINER,
        height: IMAGE_HEIGHT_CONTAINER,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
})

export interface ModalPopupProps {
    onPressImage: (e: GestureResponderEvent) => void,
    onClose: () => void,
    image: string
}

class ModalPopup extends PureComponent<ModalPopupProps> {
    state = {
        closeBtnPosition: {
            left: '-100%',
            top: '-100%'
        },
        imageDimension: {
            width: undefined,
            height: undefined
        }
    };
    refPopupContainer = React.createRef<any>();
    refPopup = React.createRef<any>();
    animatedBackgroundValue = new Animated.Value(0)

    componentDidMount() {
        Animated.timing(this.animatedBackgroundValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.quad,
            useNativeDriver: true
        }).start();
    }

    handleClose() {
        this.props.onClose
            ? this.props.onClose()
            : Actions.pop();
    }

    /**
     * @todo update close btn position by 
     * real image dimension (even image in resizeMode `contained`)
     * 
     * @description try to pretend resizing image to get actual image size shown on screen 
     * to calculate the most accuracy the position of close btn 
     * above top-corner right of actual image shown on screen.
     * 
     * @param offsetX origin container offsetX
     * @param offsetY origin container offsetY
     */
    updateCloseBtnPosition(offsetX, offsetY) {
        if (this.props.image) {
            // get actual size of image
            Image.getSize(this.props.image,
                (width, height) => {
                    /**
                     * suppose close icon will appear at position 
                     * left: image width, top: image height
                     */
                    let left = width;
                    let top = height;

                    if (width > IMAGE_WIDTH_CONTAINER || height > IMAGE_HEIGHT_CONTAINER) {
                        /**
                         * Get ratio of width & height of image dimension with origin container dimension
                         */
                        const ratioWidth = width / IMAGE_WIDTH_CONTAINER;
                        const ratioHeight = height / IMAGE_HEIGHT_CONTAINER;

                        /**
                         * If container width smaller than image width
                         * resize image by width dimension.
                         * so 
                         * left: origin container width, 
                         * top: image height resized by width dimension
                         */
                        if (IMAGE_WIDTH_CONTAINER < width) {
                            left = IMAGE_WIDTH_CONTAINER;
                            top = height / ratioWidth;
                        }
                        /**
                         * After resized by width dimension, 
                         * if height still larger than origin container
                         * resize image by height dimension.
                         * so
                         * left: image width resized by height dimension
                         * top: origin container height
                         */
                        if (IMAGE_HEIGHT_CONTAINER < top) {
                            left = width / ratioHeight;
                            top = IMAGE_HEIGHT_CONTAINER;
                        }
                        /**
                         * adding offsetX of origin container 
                         * including a half of difference of origin container width with left.
                         * 
                         * re-set top value by offsetY with a half of 
                         * difference of origin container height with top.
                         */
                        left += ((IMAGE_WIDTH_CONTAINER - left) / 2) + offsetX;
                        top = ((IMAGE_HEIGHT_CONTAINER - top) / 2) + offsetY;
                    } else {
                        /**
                         * Sum of image width with offsetX and a half of 
                         * difference of origin container width with image width.
                         * 
                         * re-set top value by offsetY with a half of 
                         * difference of origin container height with image height.
                         */
                        left = width + (IMAGE_WIDTH_CONTAINER - width) / 2 + offsetX;
                        top = (IMAGE_HEIGHT_CONTAINER - height) / 2 + offsetY;
                    }

                    top -= MARGIN_TOP_CLOSE_BTN;
                    left -= MARGIN_LEFT_CLOSE_BTN;

                    this.setState({
                        closeBtnPosition: {
                            left,
                            top
                        }
                    })
                },
                (err) => {
                    console.log("%cload_image_popup", "color:red", err)
                    //@ts-ignore
                    flashShowMessage({
                        type: "danger",
                        message: "Lỗi tải ảnh!"
                    })
                }
            );
        }
    }

    handleImageLayout(e) {
        if (this.refPopup.current) {
            this.refPopup.current.measure((a, b, width, height, px, py) => {
                this.updateCloseBtnPosition(px, py);
            })
        }
    }

    render() {
        const animatedBackgroundStyle = {
            opacity: this.animatedBackgroundValue
        }

        const animatedImageStyle = {
            opacity: this.animatedBackgroundValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            }),
            transform: [
                {
                    translateY: this.animatedBackgroundValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                    })
                }
            ]
        }

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.background, animatedBackgroundStyle]} />
                <View style={[
                    styles.iconWrapper,
                    this.state.closeBtnPosition,
                ]}>
                    <TouchableOpacity
                        onPress={this.handleClose.bind(this)}
                        style={styles.iconContainer}
                    >
                        <Icon name="closecircleo" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <Animated.View
                    style={[
                        styles.imageContainer,
                        animatedImageStyle
                    ]}
                    onLayout={this.handleImageLayout.bind(this)}
                >
                    <TouchableOpacity
                        activeOpacity={.9}
                        onPress={this.props.onPressImage}
                    >
                        <Image
                            ref={this.refPopup}
                            source={{ uri: this.props.image }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
}

export default ModalPopup;