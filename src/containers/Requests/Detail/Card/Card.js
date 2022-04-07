import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
// 3-party libs
import Reanimated, {Easing, Extrapolate} from 'react-native-reanimated';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import Header from './Header';
import Row from './Row';
import Images from './Images';
import Toggle from './Toggle';
import {Card as BaseCard} from 'src/components/base';

class Card extends Component {
  static contextType = ThemeContext;

  state = {
    isExpanded: false,
    isKeyboardOpening: false,
    animatedArrow: new Reanimated.Value(0),
    animatedAreaHeight: new Reanimated.Value(0),
    animatedVisible: new Reanimated.Value(0),
    heightCollapsable: undefined,
  };

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.handleShowKeyboard);
    Keyboard.addListener('keyboardDidHide', this.handleHideKeyboard);
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.handleShowKeyboard);
    Keyboard.removeListener('keyboardDidHide', this.handleHideKeyboard);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isExpanded !== this.state.isExpanded) {
      const config = {
        damping: 20,
        mass: 1,
        stiffness: 120,
        // overshootClamping: true,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        duration: 300,
        easing: Easing.quad,
      };
      const method = nextState.isExpanded ? 'spring' : 'timing';

      Reanimated[method](this.state.animatedAreaHeight, {
        toValue: nextState.isExpanded ? 1 : 0,
        ...config,
      }).start();

      Reanimated[method](this.state.animatedArrow, {
        toValue: nextState.isExpanded ? 1 : 0,
        ...config,
      }).start();
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.forceUpdate !== this.props.forceUpdate &&
      !!nextProps.forceUpdate
    ) {
      this.state.animatedVisible.setValue(0);
      this.setState({
        heightCollapsable: undefined,
        // isExpanded: false,
      });
    }

    if (
      nextProps.request !== this.props.request ||
      nextProps.containerStyle !== this.props.containerStyle ||
      nextProps.forceUpdate !== this.props.forceUpdate
    ) {
      return true;
    }

    return false;
  }

  handleShowKeyboard = (e) => {
    const state = {...this.state};
    state.isKeyboardOpening = true;
    // this.blurCard(0.5);
    if (this.state.isExpanded) {
      state.isExpanded = false;
    }
    this.setState(state);
  };

  handleHideKeyboard = (e) => {
    if (this.state.isKeyboardOpening) {
      this.setState({isKeyboardOpening: false});
      // this.blurCard(1);
    }
  };

  blurCard(value) {
    Reanimated.timing(this.state.animatedVisible, {
      toValue: value,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }

  onTogglePress = () => {
    if (this.state.isKeyboardOpening && !this.state.isExpanded) {
      this.props.forceCloseKeyboard();
    }
    this.setState((prevState) => ({isExpanded: !prevState.isExpanded}));
  };

  handleLayoutAnimatedArea = (e) => {
    if (this.state.heightCollapsable === undefined) {
      this.props.onFinishLayout();
      const {height} = e.nativeEvent.layout;
      this.setState(
        {
          heightCollapsable: height,
        },
        () => {
          Reanimated.timing(this.state.animatedVisible, {
            toValue: 1,
            duration: 200,
            delay: 100,
            easing: Easing.quad,
          }).start();
        },
      );
    }
  };

  handleConfirmChangeStatus = (status) => {
    this.props.onUpdateStatus(status);
  };

  onContainerLayout(e) {
    this.props.onContainerLayout(e);
  }

  get statusStyle() {
    return {
      backgroundColor: this.theme.color.persistPrimary,
      color: this.theme.color.onPersistPrimary,
    };
  }

  render() {
    if (this.props.forceUpdate) return null;

    const {
      title,
      department,
      status,
      created,
      content,
      images,
      request_type,
      color: bgColor,
      textColor,
      user,
      room_code,
      admin_name,
      object,
    } = this.props.request;

    const toggleValue = this.state.isExpanded
      ? this.props.t('showLess')
      : this.props.t('showMore');

    const showUpStyle = {
      position: this.state.heightCollapsable ? 'relative' : 'absolute',
      opacity: this.state.animatedVisible,
    };
    const animatedIconStyle = {
      transform: [
        {
          rotate: this.state.animatedArrow.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg'],
          }),
        },
      ],
    };

    const animatedHeight = this.state.heightCollapsable && {
      overflow: 'hidden',
      height: this.state.animatedAreaHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.heightCollapsable],
        extrapolateLeft: Extrapolate.CLAMP,
      }),
      opacity: this.state.animatedAreaHeight,
    };

    const statusStyle = [
      styles.status,
      this.statusStyle,
      textColor && {color: textColor},
      bgColor && {backgroundColor: bgColor},
    ];

    return (
      <Reanimated.View
        onLayout={this.onContainerLayout.bind(this)}
        style={[showUpStyle, this.props.containerStyle]}
        pointerEvents="box-none">
        <BaseCard shadow pointerEvents="box-none">
          <View pointerEvents={this.state.isKeyboardOpening ? 'none' : 'auto'}>
            <Header
              tagCode={object?.warranty_code}
              tagName={object?.title}
              type={request_type}
              title={title}
              subTitle={created}
            />
          </View>
          <Row
            label={this.props.t('request:detail.status')}
            value={status}
            valueStyle={statusStyle}
          />
          <View pointerEvents={this.state.isKeyboardOpening ? 'none' : 'auto'}>
            <Reanimated.View
              onLayout={this.handleLayoutAnimatedArea}
              style={animatedHeight}>
              <Row
                label={this.props.t('request:detail.staffInCharge')}
                value={admin_name}
              />
              {/* <Row label={this.props.t('request:detail.createdTime')} value={created} /> */}
              <Row
                isColumn
                label={this.props.t('request:detail.content')}
                labelStyle={{marginBottom: 10}}
                value={content}
                valueContainerProps={{
                  bounces: false,
                  style: {
                    height: 50,
                  },
                }}
                extraComponent={<Images images={images} />}
                scrollable
              />
            </Reanimated.View>
          </View>
          <View pointerEvents="box-none">
            <Row
              disabled={false}
              isColumn
              valueComponent={
                <Toggle
                  value={toggleValue}
                  animatedIconStyle={animatedIconStyle}
                />
              }
              onPressValue={this.onTogglePress}
            />
          </View>
        </BaseCard>
      </Reanimated.View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    padding: 7,
  },
});

export default withTranslation(['common', 'request'])(Card);
