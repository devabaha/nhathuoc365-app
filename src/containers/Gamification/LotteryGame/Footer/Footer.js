import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Keyboard,
} from 'react-native';
import appConfig from 'app-config';
import Animated, {Easing} from 'react-native-reanimated';
import Button from '../../../../components/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Shimmer from 'react-native-shimmer';

import {MAIN_COLOR, SUB_COLOR} from '../constants';
import {GAME_TYPE} from '../../constants';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const {concat, Extrapolate} = Animated;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    ...elevationShadowStyle(appConfig.device.isIOS ? 10 : 24, 0, -1),
  },
  borderTop: {
    height: 2,
    width: appConfig.device.width,
  },
  header: {
    justifyContent: 'space-between',
    padding: 15,
  },
  image: {
    width: 30,
    height: '100%',
    position: 'absolute',
    zIndex: 9,
    top: '-55%',
    left: 20,
    transform: [{rotate: '-3deg'}],
  },
  titleContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  mainTitleContainer: {
    flexWrap: 'wrap',
  },
  noteContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginBottom: 5,
  },
  note: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  highlight: {
    color: MAIN_COLOR,
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#666',
    marginRight: 7,
    marginBottom: 5,
  },
  pointTitle: {
    marginTop: 5,
    marginRight: 20,
    fontSize: 12,
    fontWeight: '300',
  },
  totalPoint: {
    fontSize: 14,
    fontWeight: '500',
    color: SUB_COLOR,
  },
  feePoint: {
    fontSize: 14,
    fontWeight: '500',
    color: MAIN_COLOR,
  },
  collapseContainer: {
    top: -3,
    width: null,
    alignSelf: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  collapseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseBtnContainer: {
    width: null,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  collapseIcon: {
    fontSize: 30,
  },
  collapseText: {
    fontSize: 12,
    fontWeight: '300',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 0,
    borderColor: '#ddd',
    borderTopWidth: 1,
  },
  inputContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    borderTopLeftRadius: 0,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: 'bold',
    color: SUB_COLOR,
  },
  btnContainer: {
    backgroundColor: 'transparent',
    width: null,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  submitBtnContainer: {
    width: null,
    borderTopLeftRadius: 0,
    paddingHorizontal: 15,
  },
  footer: {
    marginTop: 10,
  },
  resultsContainer: {
    flex: 1,
    maxHeight: 300,
  },
  results: {
    flexGrow: 1,
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  resultsSubmittedTitle: {
    fontSize: 12,
    marginRight: 10,
    marginTop: 10,
  },
  resultContainer: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: SUB_COLOR,
    marginRight: 7,
    marginTop: 10,
  },
  result: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginHorizontal: -15,
    marginTop: -15,
    padding: 15,
    backgroundColor: MAIN_COLOR,
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 0.3,
    fontWeight: '500',
    color: '#fff',
  },
});

const animatedConfig = {
  duration: 300,
  easing: Easing.out(Easing.quad),
};

class Footer extends Component {
  state = {
    containerHeight: undefined,
    isCollapsed: false,
    collapseText: 'Đóng',
    number: '',
  };
  translateY = new Animated.Value(0);

  get submitDisabled() {
    return Number.isNaN(this.state.number) || this.state.number === '';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isCollapsed !== this.state.isCollapsed) {
      Animated.timing(this.translateY, {
        ...animatedConfig,
        toValue: nextState.isCollapsed ? 1 : 0,
        duration: 300,
      }).start();
    }
    return true;
  }

  submit = () => {
    Keyboard.dismiss();
    this.props.onSubmit(this.state.number);
    this.setState({number: ''});
  };

  onChangeText = (number) => {
    this.setState({number});
  };

  onToogleCollapse = () => {
    this.props.collapsing(!this.state.isCollapsed, {
      ...animatedConfig,
      toValue: this.state.isCollapsed ? this.state.containerHeight : 0,
    });
    this.setState({
      isCollapsed: !this.state.isCollapsed,
      collapseText: !this.state.isCollapsed ? 'Mở' : 'Đóng',
    });
  };

  handleContentLayout = (e) => {
    const containerHeight = e.nativeEvent.layout.height;
    if (this.state.containerHeight === undefined) {
      this.props.collapsing(!this.state.isCollapsed, {
        ...animatedConfig,
        toValue: containerHeight,
      });
    }
    this.setState({containerHeight});
  };

  renderResults() {
    if (!this.props.hasResults) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>Bạn chưa chọn số</Text>
        </View>
      );
    }
    return this.props.results.map((result, index) => (
      <View key={index} style={styles.resultContainer}>
        <Text style={styles.result}>{result}</Text>
      </View>
    ));
  }

  render() {
    const translateYStyle = this.state.containerHeight !== undefined && {
      transform: [
        {
          translateY: this.translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.containerHeight],
          }),
        },
      ],
    };
    const rotateStyle = {
      transform: [
        {
          rotate: concat(
            this.translateY.interpolate({
              inputRange: [0, 0.5],
              outputRange: [0, 180],
              extrapolate: Extrapolate.CLAMP,
            }),
            'deg',
          ),
        },
      ],
    };
    return (
      <Animated.View style={[styles.container, translateYStyle]}>
        <Shimmer
          animating
          opacity={1}
          animationOpacity={0.4}
          pauseDuration={3000}>
          <View>
            <LinearGradient
              style={styles.borderTop}
              colors={[SUB_COLOR, MAIN_COLOR]}
              locations={[0, 1]}
              useAngle
              angle={135}
            />
          </View>
        </Shimmer>
        <View style={[styles.row, styles.header]}>
          <Image
            source={require('../../../../images/numbers.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={[styles.titleContainer]}>
            <View style={[styles.row, styles.mainTitleContainer]}>
              <Text style={styles.title}>{this.props.title}</Text>
              {!!this.props.isActive && (
                <View style={styles.noteContainer}>
                  <Text style={styles.note}>
                    còn{' '}
                    <Text style={styles.highlight}>{this.props.maxTurn}</Text>{' '}
                    lượt miễn phí
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.row}>
              {!!this.props.totalPoint && (
                <Text style={styles.pointTitle}>
                  Bạn còn:{' '}
                  <Text style={styles.totalPoint}>{this.props.totalPoint}</Text>
                </Text>
              )}
              {!!this.props.feePoint && (
                <Text style={styles.pointTitle}>
                  Điểm sử dụng:{' '}
                  <Text style={styles.feePoint}>{this.props.feePoint}</Text>
                </Text>
              )}
            </View>
          </View>

          <Button
            iconLeft={
              <View style={styles.collapseWrapper}>
                <Text style={styles.collapseText}>
                  {this.state.collapseText}
                </Text>
                <AnimatedIcon
                  style={[styles.collapseIcon, rotateStyle]}
                  name="arrow-drop-down"
                />
              </View>
            }
            onPress={this.onToogleCollapse}
            containerStyle={styles.collapseContainer}
            btnContainerStyle={styles.collapseBtnContainer}
          />
        </View>

        <View style={styles.content} onLayout={this.handleContentLayout}>
          <>
            {this.props.isActive ? (
              <View style={[styles.row, styles.inputContainer]}>
                <TextInput
                  style={styles.textInput}
                  keyboardType={
                    appConfig.device.isIOS ? 'number-pad' : 'numeric'
                  }
                  maxLength={this.props.maxLengthInput || 3}
                  selectionColor={SUB_COLOR}
                  placeholder="Nhập số của bạn..."
                  value={this.state.number}
                  onChangeText={this.onChangeText}
                />
                <Button
                  disabled={this.submitDisabled}
                  title={this.props.submitTitle}
                  onPress={this.submit}
                  containerStyle={styles.btnContainer}
                  btnContainerStyle={styles.submitBtnContainer}
                />
              </View>
            ) : (
              <View style={[styles.messageContainer]}>
                <Text style={styles.message}>{this.props.message}</Text>
              </View>
            )}

            <ScrollView
              style={[styles.footer, styles.resultsContainer]}
              contentContainerStyle={[styles.results]}>
              <View style={[styles.row, styles.results]}>
                <Text style={styles.resultsSubmittedTitle}>
                  {this.props.resultsSubmittedTitle}
                </Text>
                {this.renderResults()}
              </View>
            </ScrollView>
          </>
        </View>
      </Animated.View>
    );
  }
}

export default Footer;
