import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import config from '../../config';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import addEnableImage from '../../assets/images/add-enable.png';
import addDisabledImage from '../../assets/images/add-disabled.png';
import removeEnableImage from '../../assets/images/remove-enable.png';
import removeDisabledImage from '../../assets/images/remove-disabled.png';

const MAX_CARD_BUY_AT_ONCE = 5;

class ChooseQuantity extends Component {
  static propTypes = {
    initQuantity: PropTypes.number,
    onChangeQuantity: PropTypes.func
  };

  static defaultProps = {
    initQuantity: 1,
    onChangeQuantity: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      quantity: props.initQuantity
    };
  }

  get canIncrease() {
    return this.state.quantity < MAX_CARD_BUY_AT_ONCE;
  }

  get canDecrease() {
    return this.state.quantity > 1;
  }

  decrease = () => {
    if (this.canDecrease) {
      this.setState(
        prevState => ({
          quantity: prevState.quantity - 1
        }),
        () => {
          this.props.onChangeQuantity(this.state.quantity);
        }
      );
    }
  };

  increase = () => {
    if (this.canIncrease) {
      this.setState(
        prevState => ({
          quantity: prevState.quantity + 1
        }),
        () => {
          this.props.onChangeQuantity(this.state.quantity);
        }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Số lượng</Text>

        <View style={styles.controlBtnWrapper}>
          <Button onPress={this.decrease}>
            <Image
              style={styles.controlBtn}
              source={
                this.canDecrease ? removeEnableImage : removeDisabledImage
              }
            />
          </Button>
          <View style={styles.valueWrapper}>
            <Text style={styles.value}>{this.state.quantity}</Text>
          </View>
          <Button onPress={this.increase}>
            <Image
              style={styles.controlBtn}
              source={this.canIncrease ? addEnableImage : addDisabledImage}
            />
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18
  },
  controlBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  controlBtn: {
    width: 26,
    height: 26
  },
  valueWrapper: {
    width: 42,
    paddingVertical: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 12
  },
  value: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  }
});

export default ChooseQuantity;
