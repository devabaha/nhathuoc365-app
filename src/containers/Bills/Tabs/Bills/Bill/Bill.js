import React, { Component } from 'react';
import Button from 'react-native-button';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import appConfig from 'app-config';
import { CheckBox } from 'react-native-elements';

const BILL_STATUS = {
  INCOMPLETE: 'Chưa thanh toán',
  COMPLETE: 'Đã thanh toán'
};

class Bill extends Component {
  static defaultProps = {
    disabled: false
  };

  state = {};

  get extraStyle() {
    let extraStyle = styles.successMark;
    switch (this.props.status) {
      case BILL_STATUS.INCOMPLETE:
        extraStyle = styles.errorMark;
        break;
      case BILL_STATUS.COMPLETE:
        break;
    }

    return extraStyle;
  }

  render() {
    return (
      <Button
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        containerStyle={[
          styles.containerBtn,
          {
            marginRight: this.props.last ? 15 : 0
          },
          this.extraStyle,
          this.props.wrapperStyle
        ]}
      >
        {!!this.props.checkable && (
          <CheckBox
            containerStyle={styles.checkBox}
            title={<View />}
            uncheckedIcon="square"
            uncheckedColor="#fafafa"
            checked={this.props.checked}
            checkedIcon="check-square"
            checkedColor={appConfig.colors.primary}
            onPress={this.props.onCheck}
          />
        )}
        <View style={[styles.container, this.props.containerStyle]}>
          {!!this.props.title && (
            <View style={styles.titleContainer}>
              <View style={styles.mainTitle}>
                <Text numberOfLines={2} style={styles.title}>
                  {!!this.props.index && (
                    <Text style={styles.index}>{this.props.index}. </Text>
                  )}
                  {this.props.title}
                </Text>
              </View>
              <Svg height={3} width="100%">
                <Line
                  x1="0"
                  y1=""
                  x2="100%"
                  y2="0"
                  strokeWidth={3}
                  stroke="#ccc"
                  strokeDasharray={[3, 10]}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          )}

          <View style={styles.footer}>
            {!!this.props.period && (
              <Text numberOfLines={2} style={styles.subTitle}>
                Kỳ <Text style={styles.hightlight}>{this.props.period}</Text>
              </Text>
            )}
            {!!this.props.price && (
              <Text style={styles.special}>{this.props.price}</Text>
            )}
          </View>
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 15,
    borderRadius: 4,
    backgroundColor: '#deedf7',
    overflow: 'hidden'
  },
  container: {
    padding: 15,
    width: '100%',
    flex: 1
  },
  checkBox: {
    backgroundColor: 'transparent',
    padding: 0,
    marginRight: 5,
    marginLeft: 15,
    borderWidth: 0
  },
  mainTitle: {
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  index: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  successMark: {
    borderLeftColor: '#5bb85c',
    borderLeftWidth: 3
  },
  errorMark: {
    borderLeftColor: '#eeae4d',
    borderLeftWidth: 3
  },
  footer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  titleContainer: {
    // backgroundColor: '#deedf7',
    marginHorizontal: -15,
    marginTop: -15,
    paddingHorizontal: 15,
    paddingTop: 15,
    flex: 1,
  },
  title: {
    color: '#333',
    fontWeight: '500',
    flex: 1
  },
  subTitle: {
    marginTop: 10,
    fontSize: 12,
    color: '#666'
  },
  hightlight: {
    fontWeight: '600',
    color: '#444',
    fontSize: 14
  },
  special: {
    color: appConfig.colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Bill;
