import * as React from 'react';
import { Component } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { CameraViewProps } from '.';
import appConfig from 'app-config';

import Loading from '../Loading';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    icon: {
        padding: 20,
        fontSize: 36,
        color: "#fff",
        //@ts-ignore
        ...elevationShadowStyle(7)
    },
    btnContainer: {
        paddingVertical: appConfig.device.height * .05,
        alignSelf: 'center'
    },
    btn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#aaa',
        justifyContent: 'center',
        alignItems: 'center',
        //@ts-ignore
        ...elevationShadowStyle(7)
    },
    innerBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    mainArea: {
        position: "absolute",
        width: appConfig.device.width,
        height: appConfig.device.height,
        borderLeftWidth: appConfig.device.width * .05,
        borderRightWidth: appConfig.device.width * .05,
        borderTopWidth: appConfig.device.height * .15,
        borderBottomWidth: appConfig.device.height * .2,
        borderColor: "rgba(0,0,0,.3)",
        alignSelf: 'center'
    }
})

class CameraView extends Component<CameraViewProps> {
    static defaultProps = {
        prefixImageCapture: "data:image/jpg;base64,",
        type: RNCamera.Constants.Type.front,
        onCaptured: () => { },
        options: { quality: 1, base64: true, doNotSave: true, orientation: "portrait", pauseAfterCapture: true }
    }
    state = {
        loading: false,
        zoom: 0
    };
    refCamera = null;

    async capture() {
        if (this.refCamera) {
            this.setState({ loading: true });
            const options = this.props.options;
            try {
                const data = await this.refCamera.takePictureAsync(options);
                this.refCamera.resumePreview();
                if (data.base64) {
                    data.base64 = this.props.prefixImageCapture + data.base64;
                }
                this.props.onCaptured(data);
            } catch (err) {
                console.log('%ccapture', "color: red", err);
                //@ts-ignore
                flashShowMessage({
                    type: "danger",
                    message: "Có sự cố xảy ra, vui lòng thử lại sau!"
                });
            } finally {
                this.setState({ loading: false });
            }
        }
    }

    render() {
        const iconName = appConfig.device.isIOS ? "ios-arrow-back" : "md-arrow-back";
        const {
            prefixImageCapture,
            options,
            ...cameraProps
        } = this.props;

        const disabled = this.state.loading;

        return (
            <RNCamera zoom={this.state.zoom} autoFocus="on" ref={inst => this.refCamera = inst} style={styles.container} {...cameraProps}>
                <AnimatedLoading isLoading={this.state.loading} />
                <SafeAreaView style={styles.container}>
                    <View style={styles.mainArea}>
                    </View>

                    <TouchableOpacity disabled={disabled} onPress={Actions.pop}>
                        <Icon name={iconName} style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={disabled}
                        style={styles.btnContainer}
                        onPress={this.capture.bind(this)}
                    >
                        <View style={styles.btn}>
                            <View style={styles.innerBtn} />
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
            </RNCamera>
        )
    }
}

export default CameraView;


import Animated, { Easing, timing } from 'react-native-reanimated';
import { useValue, useClock } from 'react-native-redash';
const { useCode, set, block, cond, call, startClock, stopClock,
    clockRunning, Value } = Animated;
const animatedLoadingStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,.6)"
    }
})

const AnimatedLoading = ({
    isLoading = false
}) => {
    const animatedOpacity = useValue(0);
    const Clock = useClock();
    const [isFadeOut, setFadeOut] = React.useState(false);

    function runTiming(clock, value, dest) {
        const state = {
            finished: new Value(0),
            position: new Value(0),
            time: new Value(0),
            frameTime: new Value(0),
        };

        const config = {
            duration: 300,
            toValue: new Value(0),
            easing: Easing.quad,
        };

        return block([
            cond(
                clockRunning(clock),
                [
                    // if the clock is already running we update the toValue, in case a new dest has been passed in
                    set(config.toValue, dest),
                ],
                [
                    // if the clock isn't running we reset all the animation params and start the clock
                    set(state.finished, 0),
                    set(state.time, 0),
                    set(state.position, value),
                    set(state.frameTime, 0),
                    set(config.toValue, dest),
                    startClock(clock),
                ]
            ),
            // we run the step here that is going to update position
            timing(clock, state, config),
            // if the animation is over we stop the clock
            cond(state.finished, block([
                stopClock(clock),
                call([animatedOpacity], ([value]) => {
                    if (dest === 0) {
                        setFadeOut(true)
                    } else {
                        setFadeOut(false)
                    }
                }),
            ])
            ),
            // we made the block return the updated position
            state.position,
        ]);
    }

    useCode(() => {
        return set(animatedOpacity, runTiming(Clock, animatedOpacity, isLoading ? 1 : 0))
    }, [isLoading])


    return (
        (isLoading || !isFadeOut) && <Animated.View
            style={[
                animatedLoadingStyles.loadingContainer,
                {
                    opacity: animatedOpacity
                }
            ]}
        >
            <Loading center />
        </Animated.View>
    )
}