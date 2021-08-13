import React, { Component } from 'react';
import { StyleSheet, View, Animated, Keyboard, Text } from 'react-native';

import Reanimated, { Easing } from 'react-native-reanimated';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import Header from './Header';
import Row from './Row';
import Images from './Images';
import Toggle from './Toggle';
import UserRow from './UserRow';
import Loading from '../../../../components/Loading';

const EXTEND_MESSAGE = 'Mở rộng';
const COLLAPSE_MESSAGE = 'Thu gọn';

class Card extends Component {
  state = {
    isExpanded: false,
    isKeyboardOpening: false,
    animatedArrow: new Animated.Value(0),
    animatedAreaHeight: new Reanimated.Value(0),
    animatedVisible: new Reanimated.Value(0),
    heightCollapsable: undefined
  };

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
        damping: 15,
        mass: 1,
        stiffness: 150,
        overshootClamping: true,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true
      };
      const method = nextState.isExpanded ? 'spring' : 'timing';

      Reanimated[method](this.state.animatedAreaHeight, {
        toValue: nextState.isExpanded ? 1 : 0,
        ...config
      }).start();

      Animated.spring(this.state.animatedArrow, {
        toValue: nextState.isExpanded ? 1 : 0,
        useNativeDriver: true
      }).start();
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.request !== this.props.request ||
      nextProps.containerStyle !== this.props.containerStyle
    ) {
      return true;
    }

    return false;
  }

  handleShowKeyboard = e => {
    const state = { ...this.state };
    state.isKeyboardOpening = true;
    // this.blurCard(0.5);
    if (this.state.isExpanded) {
      state.isExpanded = false;
    }
    this.setState(state);
  };

  handleHideKeyboard = e => {
    if (this.state.isKeyboardOpening) {
      this.setState({ isKeyboardOpening: false });
      // this.blurCard(1);
    }
  };

  blurCard(value) {
    Reanimated.timing(this.state.animatedVisible, {
      toValue: value,
      duration: 200,
      easing: Easing.quad
    }).start();
  }

  onTogglePress = () => {
    if (this.state.isKeyboardOpening && !this.state.isExpanded) {
      this.props.forceCloseKeyboard();
    }
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleLayoutAnimatedArea = e => {
    if (this.state.heightCollapsable === undefined) {
      this.props.onFinishLayout();
      const { height } = e.nativeEvent.layout;
      this.setState(
        {
          heightCollapsable: height
        },
        () => {
          Reanimated.timing(this.state.animatedVisible, {
            toValue: 1,
            duration: 200,
            delay: 100,
      easing: Easing.quad
          }).start();
        }
      );
    }
  };

  handleConfirmChangeStatus = status => {
    this.props.onUpdateStatus(status);
  };

  openStatusCollection = () => {
    if (!this.props.request) return null;

    Actions.push(appConfig.routes.modalPicker, {
      title: 'Chọn trạng thái',
      cancelTitle: 'Hủy',
      selectTitle: 'Chọn',
      selectedValue: this.props.request.status_id,
      selectedLabel: this.props.request.status,
      data: this.props.status,
      onSelect: this.handleConfirmChangeStatus
    });
  };

  openStaffCollection = () => {
    if (!this.props.request || !this.props.selectedStaff.id) return null;

    Actions.push(appConfig.routes.modalPicker, {
      title: 'Chọn nhân viên',
      cancelTitle: 'Hủy',
      selectTitle: 'Chọn',
      selectedValue: this.props.selectedStaff.id,
      selectedLabel: this.props.selectedStaff.name,
      data: this.props.receptionStaffs,
      onSelect: this.props.onChangeStaff
    });
  };

  onContainerLayout(e) {
    this.props.onContainerLayout(e);
  }

  renderLoadingReceptionStaffs() {
    return (
      this.props.loadingReceptionStaffs && (
        <View style={styles.loadingRowContainer}>
          <Loading size="small" style={styles.loadingRow} />
        </View>
      )
    );
  }

  renderSelectedStaff() {
    return (
      !this.props.loadingReceptionStaffs && (
        <Text>
          {this.props.selectedStaff.name} <Icon name="caret-down" />
        </Text>
      )
    );
  }

  renderSelectedStatus() {
    return (
      !!this.props.request && (
        <Text>
          {this.props.request.status} <Icon name="caret-down" />
        </Text>
      )
    );
  }

  render() {
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
      room_code
    } = this.props.request;

    const userRowProps = {
      ...user,
      room_code
    };

    const toggleValue = this.state.isExpanded
      ? COLLAPSE_MESSAGE
      : EXTEND_MESSAGE;

    const showUpStyle = {
      position: this.state.heightCollapsable ? 'relative' : 'absolute',
      opacity: this.state.animatedVisible
    };
    const animatedIconStyle = {
      transform: [
        {
          rotate: this.state.animatedArrow.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg']
          })
        }
      ]
    };

    const animatedHeight = this.state.heightCollapsable && {
      overflow: 'hidden',
      height: this.state.animatedAreaHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.heightCollapsable]
      }),
      opacity: this.state.animatedAreaHeight
    };

    const statusStyle = [
      {
        backgroundColor: bgColor,
        padding: 7,
        color: '#fff'
      },
      textColor && { color: textColor }
    ];

    return (
      <>
        <Reanimated.View
          onLayout={this.onContainerLayout.bind(this)}
          style={[showUpStyle, this.props.containerStyle]}
          pointerEvents="box-none"
        >
          <View pointerEvents="box-none" style={[styles.container]}>
            <View
              pointerEvents={this.state.isKeyboardOpening ? 'none' : 'auto'}
            >
              <Header type={request_type} title={title} subTitle={created} />
            </View>
            <Row renderRow={<UserRow {...userRowProps} />} />
            <Row
              disabled={false}
              label="Trạng thái"
              value={this.renderSelectedStatus()}
              valueStyle={statusStyle}
              onPressValue={this.openStatusCollection}
            />
            <View
              pointerEvents={this.state.isKeyboardOpening ? 'none' : 'auto'}
            >
              <Reanimated.View
                onLayout={this.handleLayoutAnimatedArea}
                style={animatedHeight}
              >
                <Row
                  label="Nhân viên tiếp nhận"
                  valueComponent={this.renderLoadingReceptionStaffs()}
                  value={this.renderSelectedStaff()}
                  disabled={this.props.loadingReceptionStaffs}
                  onPressValue={this.openStaffCollection}
                />
                {/* <Row label="Thời gian yêu cầu" value={created} /> */}
                <Row
                  isColumn
                  label="Nội dung"
                  labelStyle={{ marginBottom: 10 }}
                  value={content}
                  valueContainerProps={{
                    bounces: false,
                    style: {
                      maxHeight: 50
                    }
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
                valueStyle={styles.imagesValue}
              />
            </View>
          </View>
        </Reanimated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    ...elevationShadowStyle(7)
  },
  imagesValue: {
    alignSelf: 'center',
    color: appConfig.colors.primary
  },
  loadingRowContainer: {
    flex: 1,
    marginHorizontal: 15
  },
  loadingRow: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default withTranslation()(Card);
